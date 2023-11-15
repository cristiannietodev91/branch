<template>
  <div class="row">
    <div class="col disable-text-selection">
      <div class="row">
        <div class="col col-12">
          <div class="top-right-button-container">
            <button
              type="button"
              class="btn btn-primary btn-lg top-right-button"
              @click="showModal"
            >
              {{ $t("pages.add-new") }}
            </button>
            <modal-add-client 
              :open="isOpenModal" 
              @loadClients="loadItems" 
              @close="isOpenModal = false"
            />
          </div>
          <v-breadcrumb :heading="$t('branch.clientes.listaClientes')" />
          <div class="separator mb-5" />
        </div>
      </div>
      <template v-if="isLoad">
        <div
          v-for="(item, index) in items"
          :id="item.id"
          :key="index"
          class="col col-12 mb-3"
        >
          <vehiculo-list-item
            :key="item.id"
            :data="item"
            :selected-items="selectedItems"
            @toggle-item="toggleItem"
          />
        </div>
      </template>
      <template v-else>
        <div class="loading" />
      </template>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { mapGetters } from "vuex";
import ModalAddClient from "../../../components/Modals/addclientmodal";


import "vue-select/dist/vue-select.css";
import ServicesCore from "../../../services/service";

import VehiculoListItem from "../../../components/Listing/VehiculoListItem";

export default {
  components: {
    "modal-add-client": ModalAddClient,
    "vehiculo-list-item": VehiculoListItem,
  },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      isLoad: false,
      isOpenModal: false,
      items: [],
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  mounted() {
    this.loadItems();
  },
  methods: {
    showModal() {
      this.isOpenModal = true;
    },
    loadItems() {
      this.isLoad = false;
      ServicesCore.getVehiculosByIdTaller(
        this.currentUser.IdTaller,
      ).then((response) => {
        if (response.status == 200) {
          this.items = response.data;
          this.isLoad = true;
        }
      });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
  },
  
};
</script>
