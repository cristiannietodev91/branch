<template>
  <div>
    <b-row>
      <b-colxx class="disable-text-selection">
        <b-row>
          <b-colxx xxs="12">
            <h1>{{ $t('branch.chat.conversaciones') }}</h1>
            <piaf-breadcrumb />

            <div class="separator mb-5" />
          </b-colxx>
        </b-row>
        <b-row class="m-3">
          <div class="d-flex align-items-center navbar-left">
            <div
              ref="searchContainer"
              :class="{ search: true, 'mobile-view': isMobileSearch }"
              @mouseenter="isSearchOver = true"
              @mouseleave="isSearchOver = false"
            >
              <b-input
                v-model="searchKeyword"
                :placeholder="$t('menu.search')"
                @keypress.enter="search"
              />
              <span class="search-icon" @click="searchClick">
                <i class="simple-icon-magnifier" />
              </span>
            </div>
          </div>
        </b-row>
        <template v-if="isLoad">
          <b-row>
            <b-colxx xxs="12" lg="8">
              <b-card class="mb-4" :title="$t('pages.comments')">
                <conversacion-item
                  v-for="(item,index) in conversaciones"
                  :key="index"
                  :conversacion="item"
                  @markreadmessages="markreadmessages"
                />
              </b-card>
            </b-colxx>
            <b-colxx xxs="12" lg="4">
              <b-card class="mb-4" :title="$t('branch.chat.conversacionesunread')">
                <div class="comment-likes">
                  <span class="post-icon">
                    <b-badge variant="light">{{ conversacionesUnRead.length }}</b-badge>
                    <router-link to="#" />
                  </span>
                </div>
                <conversacion-item
                  v-for="(item,index) in conversacionesUnRead"
                  :key="index"
                  :conversacion="item"
                  @markreadmessages="markreadmessages"
                />
              </b-card>
            </b-colxx>
          </b-row>
        </template>
        <template v-else>
          <div class="loading" />
        </template>
      </b-colxx>
    </b-row>
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
