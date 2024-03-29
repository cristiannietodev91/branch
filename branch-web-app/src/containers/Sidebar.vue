<template>
  <div
    class="sidebar"
    @mouseenter="isMenuOver=true"
    @mouseleave="isMenuOver=false"
    @touchstart="isMenuOver=true"
  >
    <div class="main-menu">
      <ul class="list-unstyled">
        <li
          v-for="(item) in menuItems"
          :key="`parent_${item.id}`"
          :class="{ 'active' : (selectedParentMenu === item.id && viewingParentMenu === '') || viewingParentMenu === item.id }"
          :data-flag="item.id"
        >
          <a v-if="item.newWindow" :href="item.to" rel="noopener noreferrer" target="_blank">
            <i :class="item.icon" />
            {{ $t(item.label) }}
          </a>
          <a
            v-else-if="item.subs && item.subs.length>0"
            :href="`#${item.to}`"
            @click.prevent="openSubMenu($event,item)"
          >
            <span v-if="item.notifications && newMessages > 0" class="badge bg-light">{{ newMessages }}</span>
            <i :class="item.icon" />
            {{ $t(item.label) }}
          </a>
          <router-link
            v-else
            :to="item.to"
            @click="changeSelectedParentHasNoSubmenu(item.id)"
          >
            <i :class="item.icon" />
            {{ $t(item.label) }}
          </router-link>
        </li>
      </ul>
    </div>

    <div class="sub-menu">
      <ul
        v-for="(item,itemIndex) in menuItems"
        :key="`sub_${item.id}`"
        :class="{'list-unstyled':true, 'd-block' : (selectedParentMenu === item.id && viewingParentMenu === '') || viewingParentMenu === item.id }"
        :data-parent="item.id"
      >
        <li
          v-for="(sub,subIndex) in item.subs"
          :key="`sub_sub_${sub.to}`"
          :class="{'has-sub-item' : sub.subs && sub.subs.length > 0 , 'active' : $route.path.indexOf(sub.to)>-1}"
        >
          <a v-if="sub.newWindow" :href="sub.to" rel="noopener noreferrer" target="_blank">
            <i :class="sub.icon" />
            <span>{{ $t(sub.label) }}</span>
          </a>
          <template v-else-if="sub.subs && sub.subs.length > 0">
            <button
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#menu_${itemIndex}_${subIndex}`"
              aria-expanded="false" aria-controls="collapseExample"
              class="btn btn-link rotate-arrow-icon opacity-50"
            >
              <i class="simple-icon-arrow-down" />
              <span class="d-inline-block">{{ $t(sub.label) }}</span>
            </button>
            <div :id="`menu_${itemIndex}_${subIndex}`" class="collapse">
              <ul class="list-unstyled third-level-menu">
                <li
                  v-for="(thirdLevelSub, thirdIndex) in sub.subs"
                  :key="`third_${itemIndex}_${subIndex}_${thirdIndex}`"
                  :class="{'third-level-menu':true , 'active' : $route.path ===thirdLevelSub.to}"
                >
                  <a
                    v-if="thirdLevelSub.newWindow"
                    :href="thirdLevelSub.to"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i :class="thirdLevelSub.icon" />
                    <span>{{ $t(thirdLevelSub.label) }}</span>
                  </a>

                  <router-link v-else :to="thirdLevelSub.to">
                    <i :class="thirdLevelSub.icon" />
                    <span>{{ $t(thirdLevelSub.label) }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </template>
          <router-link v-else :to="sub.to" @click="resetUnreadMessages">
            <i :class="sub.icon" />

            <span>
              {{ $t(sub.label) }}
              <span v-if="sub.notifications && newMessages > 0" class="badge text-bg-light">{{ newMessages }}</span>
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { menuHiddenBreakpoint, subHiddenBreakpoint } from "../constants/config";
import menuItems from "../constants/menu";

export default {
  name: "sidebar-container",
  data() {
    return {
      selectedParentMenu: "",
      isMenuOver: false,
      menuItems,
      viewingParentMenu: "",
      newmessages: 0
    };
  },
  computed: {
    ...mapGetters({
      menuType: "getMenuType",
      menuClickCount: "getMenuClickCount",
      selectedMenuHasSubItems: "getSelectedMenuHasSubItems",
      newMessages: "newMessages"
    })
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        const toParentUrl = to.path.split("/").filter(x => x !== "")[1];
        if (toParentUrl !== undefined || toParentUrl !== null) {
          this.selectedParentMenu = toParentUrl.toLowerCase();
        } else {
          this.selectedParentMenu = "dashboards";
        }
        this.selectMenu();
        this.toggle();
        this.changeSideMenuStatus({
          step: 0,
          classNames: this.menuType,
          selectedMenuHasSubItems: this.selectedMenuHasSubItems
        });

        window.scrollTo(0, top);
      }
    }
  },
  mounted() {
    this.selectMenu();
    window.addEventListener("resize", this.handleWindowResize);
    document.addEventListener("click", this.handleDocumentClick);
    this.handleWindowResize();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    ...mapMutations([
      "changeSideMenuStatus",
      "addMenuClassname",
      "changeSelectedMenuHasSubItems",
      "resetNewMessages"
    ]),
    selectMenu() {
      const currentParentUrl = this.$route.path
        .split("/")
        .filter(x => x !== "")[1];
      if (currentParentUrl !== undefined || currentParentUrl !== null) {
        this.selectedParentMenu = currentParentUrl.toLowerCase();
      } else {
        this.selectedParentMenu = "dashboards";
      }
      this.isCurrentMenuHasSubItem();
    },
    isCurrentMenuHasSubItem() {
      const menuItem = this.menuItems.find(
        x => x.id === this.selectedParentMenu
      );
      const isCurrentMenuHasSubItem =
        menuItem && menuItem.subs && menuItem.subs.length > 0 ? true : false;
      if (isCurrentMenuHasSubItem != this.selectedMenuHasSubItems) {
        if (!isCurrentMenuHasSubItem) {
          this.changeSideMenuStatus({
            step: 0,
            classNames: this.menuType,
            selectedMenuHasSubItems: false
          });
        }
      }

      return isCurrentMenuHasSubItem;
    },

    changeSelectedParentHasNoSubmenu(parentMenu) {
      this.selectedParentMenu = parentMenu;
      this.viewingParentMenu = parentMenu;
      this.changeSelectedMenuHasSubItems(false);
      this.changeSideMenuStatus({
        step: 0,
        classNames: this.menuType,
        selectedMenuHasSubItems: false
      });
    },

    openSubMenu(e, menuItem) {
      const selectedParent = menuItem.id;
      const hasSubMenu = menuItem.subs && menuItem.subs.length > 0;
      this.changeSelectedMenuHasSubItems(hasSubMenu);
      if (!hasSubMenu) {
        this.viewingParentMenu = selectedParent;
        this.selectedParentMenu = selectedParent;
        this.toggle();
      } else {
        const currentClasses = this.menuType
          ? this.menuType.split(" ").filter(x => x !== "")
          : "";

        if (!currentClasses.includes("menu-mobile")) {
          if (
            currentClasses.includes("menu-sub-hidden") &&
            (this.menuClickCount === 2 || this.menuClickCount === 0)
          ) {
            this.changeSideMenuStatus({
              step: 3,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu
            });
          } else if (
            currentClasses.includes("menu-hidden") &&
            (this.menuClickCount === 1 || this.menuClickCount === 3)
          ) {
            this.changeSideMenuStatus({
              step: 2,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu
            });
          } else if (
            currentClasses.includes("menu-default") &&
            !currentClasses.includes("menu-sub-hidden") &&
            (this.menuClickCount === 1 || this.menuClickCount === 3)
          ) {
            this.changeSideMenuStatus({
              step: 0,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu
            });
          }
        } else {
          this.addMenuClassname({
            classname: "sub-show-temporary",
            currentClasses: this.menuType
          });
        }
        this.viewingParentMenu = selectedParent;
      }
    },
    handleDocumentClick(e) {
      if (!this.isMenuOver) {
        let cont = true;
        const path = e.path || (e.composedPath && e.composedPath());
        path.map(p => {
          if (
            p.nodeName !== "svg" &&
            p.nodeName !== "line" &&
            p.nodeName !== "rect" &&
            p.nodeName !== "g" &&
            p.className !== undefined &&
            p.className.indexOf("menu-button") > -1
          ) {
            cont = false;
          }
        });

        this.viewingParentMenu = "";
        this.selectMenu();
        if (cont || !this.selectedMenuHasSubItems) {
          this.toggle();
        }
      }
    },
    toggle() {
      const currentClasses = this.menuType.split(" ").filter(x => x !== "");
      if (
        currentClasses.includes("menu-sub-hidden") &&
        this.menuClickCount === 3
      ) {
        this.changeSideMenuStatus({
          step: 2,
          classNames: this.menuType,
          selectedMenuHasSubItems: this.selectedMenuHasSubItems
        });
      } else if (
        currentClasses.includes("menu-hidden") ||
        currentClasses.includes("menu-mobile")
      ) {
        if (!(this.menuClickCount === 1 && !this.selectedMenuHasSubItems)) {
          this.changeSideMenuStatus({
            step: 0,
            classNames: this.menuType,
            selectedMenuHasSubItems: this.selectedMenuHasSubItems
          });
        }
      }
    },
    // Resize
    handleWindowResize(event) {
      if (event && !event.isTrusted) {
        return;
      }
      let nextClasses = this.getMenuClassesForResize(this.menuType);
      this.changeSideMenuStatus({
        step: 0,
        classNames: nextClasses.join(" "),
        selectedMenuHasSubItems: this.selectedMenuHasSubItems
      });
    },
    getMenuClassesForResize(classes) {
      let nextClasses = classes.split(" ").filter(x => x !== "");
      const windowWidth = window.innerWidth;

      if (windowWidth < menuHiddenBreakpoint) {
        nextClasses.push("menu-mobile");
      } else if (windowWidth < subHiddenBreakpoint) {
        nextClasses = nextClasses.filter(x => x !== "menu-mobile");
        if (
          nextClasses.includes("menu-default") &&
          !nextClasses.includes("menu-sub-hidden")
        ) {
          nextClasses.push("menu-sub-hidden");
        }
      } else {
        nextClasses = nextClasses.filter(x => x !== "menu-mobile");
        if (
          nextClasses.includes("menu-default") &&
          nextClasses.includes("menu-sub-hidden")
        ) {
          nextClasses = nextClasses.filter(x => x !== "menu-sub-hidden");
        }
      }
      return nextClasses;
    },
    resetUnreadMessages() {
      // this.newmessages = 0;
      this.resetNewMessages();
    }
  }
};
</script>
