<template>
  <div class="row">
    <div class="col disable-text-selection">
      <div class="row">
        <div class="col col-12">
          <div class="top-right-button-container">
            <button
              type="button"
              data-bs-toggle="modal" data-bs-target="#modaladdvehiculo"
              class="btn btn-primary btn-lg top-right-button"
            >
              {{ $t("pages.add-new") }}
            </button>
            <div
              id="modaladdvehiculo"
              ref="modaladdvehiculo"
              class="modal fade"
              tabindex="-1"
              aria-hidden="true"
              aria-labelledby="modaladdvehiculoLabel"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 id="modaladdvehiculoLabel" class="modal-title fs-5">
                      {{ $t('pages.branch.add-new-vehiculo') }}
                    </h1>
                  </div>
                  <div class="modal-body">
                    <form novalidate class="av-tooltip" @submit.prevent="onValitadeFormSubmit">
                      <div>
                        <label for="vehicle_plate" class="form-label">{{ $t('branch.vehiculo.placa') }}</label>
                        <div class="input-group has-validation">
                          <input
                            id="vehicle_plate"
                            v-model="v$.newItem.placa.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.placa.$error }"
                          >
                          <div v-if="v$.newItem.placa.required.$invalid" class="invalid-feedback">
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div v-else-if="v$.newItem.placa.placaValidate.$invalid" class="invalid-feedback">
                            {{ $t("branch.forms.validations.formatPlaca") }}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label for="client_phone" class="form-label">{{ $t('branch.vehiculo.celular') }}</label>
                        <div class="input-group has-validation">
                          <input
                            id="client_phone"
                            v-model="v$.newItem.celular.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.celular.$error }"
                          >
                          <div v-if="v$.newItem.celular.required.$invalid" class="invalid-feedback">
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div v-else-if="v$.newItem.celular.numeric.$invalid" class="invalid-feedback">
                            {{ $t("branch.forms.validations.formatPlaca") }}
                          </div>
                          <div v-else-if="v$.newItem.celular.minLength.$invalid || v$.newItem.celular.maxLength.$invalid" class="invalid-feedback">
                            {{ $t("branch.forms.validations.longitud") }}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label for="client_phone" class="form-label">{{ $t('branch.vehiculo.celular') }}</label>
                        <div class="input-group has-validation">
                          <input
                            id="client_phone"
                            v-model="v$.newItem.celular.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.celular.$error }"
                          >
                          <div v-if="v$.newItem.celular.required.$invalid" class="invalid-feedback">
                            {{ $t('branch.forms.validations.required') }}
                          </div>
                          <div v-else-if="v$.newItem.celular.numeric.$invalid" class="invalid-feedback">
                            {{ $t("branch.forms.validations.formatPlaca") }}
                          </div>
                          <div v-else-if="v$.newItem.celular.minLength.$invalid || v$.newItem.celular.maxLength.$invalid" class="invalid-feedback">
                            {{ $t("branch.forms.validations.longitud") }}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label for="client_email" class="form-label">{{ $t('branch.vehiculo.email') }}</label>
                        <div class="input-group has-validation">
                          <input
                            id="client_email"
                            v-model="v$.newItem.email.$model"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': v$.newItem.email.$error }"
                          >
                          <div v-if="v$.newItem.email.email.$invalid" class="invalid-feedback">
                            {{ $t("branch.forms.validations.email") }}
                          </div>
                        </div>
                      </div>
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="hideModal('modaladdvehiculo')"
                      >
                        {{ $t("pages.cancel") }}
                      </button>
                      <button type="submit" class="btn btn-primary">
                        {{
                          $t("forms.submit")
                        }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
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
import {
  required,
  requiredIf,
  minLength,
  maxLength,
  email,
  helpers,
  numeric,
} from "@vuelidate/validators";

const placaValidate = helpers.regex(
  "placa",
  /^[a-zA-Z]{3}[0-9]{2}[a-zA-Z0-9]$/
);

import "vue-select/dist/vue-select.css";
import ServicesCore from "../../../services/service";

import VehiculoListItem from "../../../components/Listing/VehiculoListItem";

export default {
  components: {
    "vehiculo-list-item": VehiculoListItem,
  },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      isLoad: false,
      filter: {
        column: "placa",
        label: "Placa",
      },
      filterOptions: [
        {
          column: "placa",
          label: "Placa",
        },
        {
          column: "firstName",
          label: "Nombre cliente",
        },
        {
          column: "identificacion",
          label: "Identificación",
        },
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
      newItem: {
        placa: "",
        celular: "",
        email: "",
      },
    };
  },
  validations: {
    newItem: {
      placa: {
        required,
        placaValidate,
      },
      celular: {
        required: requiredIf(function () {
          return !this.newItem.email;
        }),
        numeric,
        maxLength: maxLength(10),
        minLength: minLength(10),
      },
      email: {
        required: requiredIf(function () {
          return !this.newItem.celular;
        }),
        email,
      },
    },
  },
  computed: {
    ...mapGetters(["currentUser"]),
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isAnyItemSelected() {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      );
    },
  },
  watch: {
    search() {
      this.page = 1;
      this.loadItems(this.page, this.perPage, this.filter.column, this.search);
    },
    page() {
      this.loadItems(this.page, this.perPage, this.filter.column, this.search);
    },
  },
  mounted() {
    this.loadItems(this.page, this.perPage, this.filter.column, this.search);
  },
  methods: {
    loadItems(page, perPage, columnFilter, filter) {
      this.isLoad = false;
      ServicesCore.getPaginateVehiculosByIdTaller(
        this.currentUser.IdTaller,
        page,
        perPage,
        columnFilter,
        filter
      ).then((response) => {
        if (response.status == 200) {
          this.items = response.data.rows;
          this.total = response.data.count;
          this.lastPage = response.data.count;
          this.to = page * perPage;
          if (this.to > this.total) {
            this.to = this.total;
          }
          this.from = this.to - (this.items.length - 1);
          this.selectedItems = [];
          this.isLoad = true;
        }
      });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    changePageSize(perPage) {
      this.perPage = perPage;
    },
    changeFilterBy(filter) {
      this.filter = filter;
    },
    selectAll(isToggle) {
      if (this.selectedItems.length >= this.items.length) {
        if (isToggle) this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map((x) => x.IdVehiculo);
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
        var start = this.getIndex(itemId, itemsForToggle, "IdVehiculo");
        var end = this.getIndex(
          this.selectedItems[this.selectedItems.length - 1],
          itemsForToggle,
          "IdVehiculo"
        );
        itemsForToggle = itemsForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );
        this.selectedItems.push(
          ...itemsForToggle.map((item) => {
            return item.id;
          })
        );
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter((x) => x !== itemId);
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
      //console.log('PageNum ::>',pageNum);
      return "#page-" + pageNum;
    },
    onValitadeFormSubmit() {
      this.v$.$touch();
      var vehiculo = {
        placa: this.newItem.placa,
        celular: this.newItem.celular,
        usuario: { email: this.newItem.email },
        IdTaller: this.currentUser.IdTaller,
      };
      // if its still pending or an error is returned do not submit
      if (this.v$.newItem.$pending || this.v$.newItem.$error) return;

      ServicesCore.createVehiculo(vehiculo)
        .then((response) => {
          if (response.status == 200) {
            this.newItem = {
              placa: "",
              celular: "",
              email: "",
            };
            this.$notify(
              "success",
              "Resultado",
              "Se creo el vehiculo correctamente",
              {
                duration: 3000,
                permanent: false,
              }
            );
            this.hideModal("modaladdvehiculo");
            this.loadItems(
              this.page,
              this.perPage,
              this.filter.column,
              this.search
            );
          }
        })
        .catch((error) => {
          console.log("Error al registrar cliente :::>", error);
          this.$notify({
            title: "ERROR",
            type: "error",
            duration: 3000,
            permanent: false,
            text: "Error creating client"
          });
        });
    },
  },
  
};
</script>
