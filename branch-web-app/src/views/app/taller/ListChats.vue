<template>
  <div>
    <div class="row">
      <div class="col disable-text-selection">
        <div class="row">
          <div class="col col-12">
            <h1>{{ $t('branch.chat.conversaciones') }}</h1>
            <piaf-breadcrumb />

            <div class="separator mb-5" />
          </div>
        </div>
        <div class="row m-3">
          <div class="d-flex align-items-center navbar-left">
            <div
              ref="searchContainer"
              :class="{ search: true, 'mobile-view': isMobileSearch }"
              @mouseenter="isSearchOver = true"
              @mouseleave="isSearchOver = false"
            >
              <input
                v-model="searchKeyword"
                type="text"
                :placeholder="$t('menu.search')"
                @keypress.enter="search"
              >
              <span class="search-icon" @click="searchClick">
                <i class="simple-icon-magnifier" />
              </span>
            </div>
          </div>
        </div>
        <template v-if="isLoad">
          <div class="row">
            <div class="col col-12 col-lg-8">
              <div class="card mb-4" :title="$t('pages.comments')">
                <conversacion-item
                  v-for="(item,index) in conversaciones"
                  :key="index"
                  :conversacion="item"
                  @markreadmessages="markreadmessages"
                />
              </div>
            </div>
            <div class="col col-12 col-lg-4">
              <div class="card mb-4">
                <div class="card-body">
                  <h5 class="card-title">
                    {{ $t('branch.chat.conversacionesunread') }}
                  </h5>
                  <div class="comment-likes">
                    <span class="post-icon">
                      <span class="badge text-bg-light">{{ conversacionesUnRead.length }}</span>
                      <router-link to="#" />
                    </span>
                  </div>
                  <conversacion-item
                    v-for="(item,index) in conversacionesUnRead"
                    :key="index"
                    :conversacion="item"
                    @markreadmessages="markreadmessages"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="loading" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ServicesCore from "../../../services/service";
import ConversacionItem from "../../../components/Listing/ConversacionItem";

export default {
  components: {
    "conversacion-item": ConversacionItem
  },
  data() {
    return {
      searchKeyword: "",
      isMobileSearch: false,
      isLoad: false,
      conversacionesUnRead: [],
      conversaciones: []
    };
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  mounted() {
    this.loadItems();
  },
  methods: {
    loadItems() {
      this.isLoad = false;
      ServicesCore.getConversacionesUnReadByTaller(
        this.currentUser.IdTaller
      ).then(response => {
        if (response.status == 200) {
          this.conversacionesUnRead = response.data;
          this.isLoad = true;
        }
      });
    },
    markreadmessages(data) {
      const conversacion = {
        IdConversacionUser: data.IdConversacionUser,
        IdTaller: data.IdTaller,
        typeusuario: "cliente"
      };
      ServicesCore.markReadMessagesConversacion(conversacion)
        .then(response => {
          if (response.status == 200) {
            console.log("Se marcaron como leidos los mensajes");
          }
        })
        .catch(() => {
          console.error("Error al marcar como leidos los mensajes");
        });
    },
    searchClick() {
      if (window.innerWidth < this.menuHiddenBreakpoint) {
        if (!this.isMobileSearch) {
          this.isMobileSearch = true;
        } else {
          this.search();
          this.isMobileSearch = false;
        }
      } else {
        this.search();
      }
    },
    search() {
      ServicesCore.getConversacionesByTaller(
        this.currentUser.IdTaller,
        this.searchKeyword
      ).then(response => {
        if (response.status == 200) {
          this.conversaciones = response.data;
          this.isLoad = true;
        }
      });
    }
  },
};
</script>
