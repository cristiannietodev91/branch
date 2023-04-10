<template>
  <div>
    <div class="row">
      <div class="col col-12">
        <v-breadcrumb :heading="$t('menu.taller')" />
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs nav-fill">
              <li
                v-for="(navItem, index) in navItems" :key="index" class="nav-item"
                @click="activeTab(navItem)"
              >
                <button
                  class="nav-link"
                  type="button"
                  role="tab"
                  :class="{
                    'active': navItem.isActive
                  }"
                  @click="$router.push(navItem.to)"
                >
                  {{ $t(navItem.text) }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isLoad: false,
      navItems: [
        {
          text: "branch.cita.cita",
          to: "/app/taller/detailTaller",
          isActive: true
        },
        {
          text: "pages.branch.mecanicos",
          to: "/app/taller/detailTaller/mecanicos",
          isActive: false
        },
        {
          text: "pages.branch.ordentrabajo",
          to: "/app/taller/detailTaller/ordenes",
          isActive: false
        },
        {
          text: "pages.details",
          to: "/app/taller/detailTaller/info",
          isActive: false
        }
      ]
    };
  },
  created() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
  },
  methods: {
    activeTab(item) {
      if(item.isActive) {
        return
      }
      this.navItems = this.navItems.reduce((acc, curr)=> {
        return [...acc, { ...curr, isActive: curr.to === item.to ? true : false }]
      },[]);
    }
  }
};
</script>
