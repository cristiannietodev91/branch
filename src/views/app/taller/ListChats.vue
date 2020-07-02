<template>
  <b-row>
    <b-colxx class="disable-text-selection">
      <b-row>
        <b-colxx xxs="12">
          <h1>{{ $t('branch.chat.conversaciones') }}</h1>
          <piaf-breadcrumb />

          <div class="separator mb-5" />
        </b-colxx>
      </b-row>
      <template v-if="isLoad">
        <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
          <conversacion-item :key="item.id" :conversacion="item" />
        </b-colxx>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-colxx>
  </b-row>
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
      isLoad: false,
      items: [],
      selectedItems: []
    };
  },
  methods: {
    loadItems() {
      this.isLoad = false;
      ServicesCore.getConversacionesByTaller(this.currentUser.IdTaller).then(
        response => {
          if (response.status == 200) {
            this.items = response.data;
            this.selectedItems = [];
            this.isLoad = true;
          }
        }
      );
    }
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  watch: {},
  mounted() {
    this.loadItems();
  }
};
</script>
