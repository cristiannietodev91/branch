<template>
  <div class="row">
    <div class="col disable-text-selection">
      <div class="row">
        <div class="col col-12">
          <h1>{{ $t('branch.taller.listaTalleres') }}</h1>
          <div class="top-right-button-container">
            <button
              type="button"
              class="btn btn-primary top-right-button btn-lg"
              data-bs-toggle="modal" 
              data-bs-target="#modalAddTaller"
            >
              {{ $t('pages.add-new') }}
            </button>
            <div
              id="modalAddTaller"
              tabindex="-1"
              aria-hidden="true"
              class="modal"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    {{ $t('branch.taller.add-new-taller-title') }}
                  </div>
                  <div class="modal-body">
                    <form novalidate @submit.prevent="onValitadeFormSubmit">
                      <div class="row">
                        <label for="workshop_name" class="form-label">{{ $t('branch.taller.nombreTaller') }}</label>
                        <div class="input-group col-sm-10 has-validation">
                          <input
                            id="workshop_name"
                            v-model="v$.newItem.nombre.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.nombre.$error }"
                          >
                          <div v-if="v$.newItem.nombre.required.$invalid" class="invalid-feedback">
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div
                            v-else-if="v$.newItem.nombre.minLength.$invalid || v$.newItem.nombre.maxLength.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.longitud') }}
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <label for="workshop_id" class="form-label">{{ $t('branch.taller.identificacion') }}</label>
                        <div class="input-group col-sm-10 has-validation">
                          <input
                            id="workshop_id"
                            v-model="v$.newItem.identificacion.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.identificacion.$error }"
                          >
                          <div v-if="v$.newItem.identificacion.required.$invalid" class="invalid-feedback">
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div
                            v-else-if="v$.newItem.identificacion.alpha.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.nit') }}
                          </div>
                          <div
                            v-else-if="v$.newItem.nombre.minLength.$invalid || v$.newItem.nombre.maxLength.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.longitud') }}
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <label for="workshop_address" class="form-label">{{ $t('branch.taller.direccion') }}</label>
                        <div class="input-group col-sm-10 has-validation">
                          <input
                            id="workshop_address"
                            v-model="v$.newItem.direccion.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.direccion.$error }"
                          >
                          <div
                            v-if="v$.newItem.direccion.required.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div
                            v-else-if="v$.newItem.direccion.minLength.$invalid || v$.newItem.direccion.maxLength.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.longitud') }}
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <label for="workshop_phone" class="form-label">{{ $t('branch.taller.celular') }}</label>
                        <div class="input-group col-sm-10 has-validation">
                          <input
                            id="workshop_phone"
                            v-model="v$.newItem.celular.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.celular.$error }"
                          >
                          <div
                            v-if="v$.newItem.celular.required.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div
                            v-else-if="v$.newItem.celular.minLength.$invalid || v$.newItem.direccion.maxLength.$invalid"
                          >
                            {{ $t('branch.forms.validations.longitud') }}
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <label for="workshop_email" class="form-label">{{ $t('branch.taller.email') }}</label>
                        <div class="input-group col-sm-10 has-validation">
                          <input
                            id="workshop_email"
                            v-model="v$.newItem.email.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.email.$error }"
                          >
                          <div
                            v-if="v$.newItem.email.required.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div
                            v-else-if="v$.newItem.email.email.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.email') }}
                          </div>
                          <div
                            v-else-if="v$.newItem.email.minLength.$invalid || v$.newItem.email.maxLength.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.longitud') }}
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <label for="workshop_logo" class="form-label">{{ $t('branch.taller.logo') }}</label>
                        <div class="input-group col-sm-10 has-validation">
                          <input
                            id="workshop_logo"
                            v-model="v$.newItem.urlLogo.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.urlLogo.$error }"
                          >
                          <div
                            v-if="v$.newItem.urlLogo.required.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div
                            v-else-if="v$.newItem.urlLogo.url.$invalid"
                            class="invalid-feedback"
                          >
                            {{ $t('branch.forms.validations.url') }}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="hideModal('modalAddTaller')"
                      >
                        {{ $t('pages.cancel') }}
                      </button>
                      <button type="submit" class="btn btn-primary">
                        {{ $t('forms.submit') }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <piaf-breadcrumb />
          <div class="mb-2 mt-2">
            <button
              class="btn pt-0 pl-0 d-inline-block d-md-none"
              data-bs-toggle="collapse"
              data-bs-target="#displayOptions"
              aria-expanded="false" 
              aria-controls="displayOptions"
            >
              {{ $t('pages.display-options') }}
              <i class="simple-icon-arrow-down align-middle" />
            </button>
          </div>
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
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  minLength,
  maxLength,
  email,
  helpers,
  url
} from "@vuelidate/validators";

import ServicesCore from "../../../services/service";

import TallerListItem from "../../../components/Listing/TallerListItem";

const alpha = helpers.regex("alpha", /(^[0-9]+-{1}[0-9]{1})/);

export default {
  components: {
    "taller-list-item": TallerListItem
  },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      isLoad: false,
      sort: {
        column: "nombre",
        label: "Nombre taller"
      },
      sortOptions: [
        {
          column: "nombre",
          label: "Nombre taller"
        }
      ],
      page: 1,
      perPage: 4,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      pageSizes: [4, 8, 12],
      selectedItems: [],
      categories: [
        {
          label: "Cakes",
          value: "Cakes"
        },
        {
          label: "Cupcakes",
          value: "Cupcakes"
        },
        {
          label: "Desserts",
          value: "Desserts"
        }
      ],
      statuses: [
        {
          text: "ON HOLD",
          value: "ON HOLD"
        },
        {
          text: "PROCESSED",
          value: "PROCESSED"
        }
      ],
      newItem: {
        nombre: "",
        identificacion: "",
        direccion: "",
        celular: "",
        email: "",
        urlLogo: ""
      }
    };
  },
  validations: {
    newItem: {
      nombre: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(2)
      },
      identificacion: {
        required,
        alpha,
        maxLength: maxLength(16),
        minLength: minLength(8)
      },
      direccion: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(8)
      },
      celular: {
        required,
        maxLength: maxLength(10),
        minLength: minLength(10)
      },
      email: {
        required,
        email
      },
      urlLogo: {
        required,
        url
      }
    }
  },
  computed: {
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isAnyItemSelected() {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      );
    }
  },
  watch: {
    search() {
      this.page = 1;
    }
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
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    changePageSize(perPage) {
      this.perPage = perPage;
    },
    changeOrderBy(sort) {
      this.sort = sort;
    },
    selectAll(isToggle) {
      if (this.selectedItems.length >= this.items.length) {
        if (isToggle) this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map(x => x.id);
      }
    },
    keymap(event) {
      switch (event.srcKey) {
        case "select":
          this.selectAll(false);
          break;
        case "undo":
          this.selectedItems = [];
          break;
      }
    },
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },
    toggleItem(event, itemId) {
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.items;
        var start = this.getIndex(itemId, itemsForToggle, "id");
        var end = this.getIndex(
          this.selectedItems[this.selectedItems.length - 1],
          itemsForToggle,
          "id"
        );
        itemsForToggle = itemsForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );
        this.selectedItems.push(
          ...itemsForToggle.map(item => {
            return item.id;
          })
        );
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId);
        } else this.selectedItems.push(itemId);
      }
    },
    handleContextmenu(vnode) {
      if (!this.selectedItems.includes(vnode.key)) {
        this.selectedItems = [vnode.key];
      }
    },
    onContextCopy() {
      console.log(
        "context menu item clicked - Copy Items: ",
        this.selectedItems
      );
    },
    onContextArchive() {
      console.log(
        "context menu item clicked - Move to Archive Items: ",
        this.selectedItems
      );
    },
    onContextDelete() {
      console.log(
        "context menu item clicked - Delete Items: ",
        this.selectedItems
      );
    },
    linkGen(pageNum) {
      return "#page-" + pageNum;
    },
    onValitadeFormSubmit() {
      this.v$.$touch();
      var taller = {
        nombre: this.newItem.nombre,
        identificacion: this.newItem.identificacion,
        direccion: this.newItem.direccion,
        celular: this.newItem.celular,
        email: this.newItem.email,
        logo: this.newItem.urlLogo
      };
      // if its still pending or an error is returned do not submit
      if (this.v$.newItem.$pending || this.v$.newItem.$error) return;

      console.log(JSON.stringify(taller));
      ServicesCore.createTaller(taller).then(response => {
        if (response.status == 200) {
          this.loadItems();
          this.hideModal("modalAddTaller");
        } 
      });
    }
  }
};
</script>
