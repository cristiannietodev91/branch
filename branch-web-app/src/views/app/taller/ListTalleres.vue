<template>
  <div class="row">
    <div class="col disable-text-selection">
      <div class="row">
        <div class="col col-12">
          <div class="top-right-button-container">
            <button
              type="button"
              class="btn btn-primary top-right-button btn-lg"
              @click="isOpenModal = !isOpenModal"
            >
              {{ $t('pages.add-new') }}
            </button>
            <modal-add-workshop :open="isOpenModal" @close="isOpenModal = false" @loadItems="loadItems" />
          </div>
          <v-breadcrumb :heading="$t('branch.taller.listaTalleres')" />
          <div class="separator mb-5" />
        </div>
      </div>
      <template v-if="isLoad">
        <div class="row">
          <div
            v-for="(item,index) in items" :id="item.id" :key="index"
            class="col col-12 mb-3"
          >
            <taller-list-item
              :key="item.id"
              :data="item"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="loading" />
      </template>
    </div>
  </div>
</template>

<script>
import ServicesCore from "../../../services/service";

import TallerListItem from "../../../components/Listing/TallerListItem";
import ModalAddWorkshop from "../../../components/Modals/addworkshop";


export default {
  components: {
    "taller-list-item": TallerListItem,
    "modal-add-workshop": ModalAddWorkshop,
  },
  data() {
    return {
      isLoad: false,
      isOpenModal: false,
      items: [],
    };
  },
  mounted() {
    this.loadItems();
  },
  methods: {
    loadItems() {
      this.isLoad = false;
      ServicesCore.getAllTalleres().then(response => {
        this.total = response.total;
        this.from = response.from;
        this.to = response.to;
        this.items = response.data;
        this.perPage = response.per_page;
        this.selectedItems = [];
        this.lastPage = response.last_page;
        this.isLoad = true;
        return response.data;
      });
    },
  }
};
</script>
