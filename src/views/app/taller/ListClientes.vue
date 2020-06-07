<template>
  <b-row>
    <b-colxx class="disable-text-selection">
      <b-row>
        <b-colxx xxs="12">
          <h1>{{ $t('branch.clientes.listaClientes') }}</h1>
          <div class="top-right-button-container">
            <b-button
              v-b-modal.modaladdvehiculo
              variant="primary"
              size="lg"
              class="top-right-button"
            >{{ $t('pages.add-new') }}</b-button>
            <b-button-group>
              <b-dropdown
                split
                right
                @click="selectAll(true)"
                class="check-button"
                variant="primary"
              >
                <label
                  class="custom-control custom-checkbox pl-4 mb-0 d-inline-block"
                  slot="button-content"
                >
                  <input
                    class="custom-control-input"
                    type="checkbox"
                    :checked="isSelectedAll"
                    v-shortkey="{select: ['ctrl','a'], undo: ['ctrl','d']}"
                    @shortkey="keymap"
                  />
                  <span
                    :class="{
                'custom-control-label' :true,
                'indeterminate' : isAnyItemSelected
                }"
                  >&nbsp;</span>
                </label>
                <b-dropdown-item>{{$t('pages.delete')}}</b-dropdown-item>
                <b-dropdown-item>{{$t('pages.another-action')}}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
            <b-modal
              id="modaladdvehiculo"
              ref="modaladdvehiculo"
              :title="$t('pages.branch.add-new-vehiculo')"
              hide-footer
            >
              <b-form @submit.prevent="onValitadeFormSubmit" class="av-tooltip">
                <b-form-group :label="$t('branch.vehiculo.placa')">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.placa.$model"
                    :state="!$v.newItem.placa.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.placa.required"
                  >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group :label="$t('branch.vehiculo.celular')">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.celular.$model"
                    :state="!$v.newItem.celular.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.celular.required"
                  >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.newItem.celular.minLength || !$v.newItem.celular.maxLength"
                  >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group :label="$t('branch.vehiculo.email')" class="tooltip-left-bottom">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.email.$model"
                    :state="!$v.newItem.email.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.email.email"
                  >{{$t('branch.forms.validations.email')}}</b-form-invalid-feedback>
                </b-form-group>
                <b-button
                  variant="outline-secondary"
                  @click="hideModal('modaladdvehiculo')"
                >{{ $t('pages.cancel') }}</b-button>
                <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
              </b-form>
            </b-modal>
          </div>
          <piaf-breadcrumb />
          <div class="mb-2 mt-2">
            <b-button
              variant="empty"
              class="pt-0 pl-0 d-inline-block d-md-none"
              v-b-toggle.displayOptions
            >
              {{ $t('pages.display-options') }}
              <i class="simple-icon-arrow-down align-middle" />
            </b-button>
            <b-collapse id="displayOptions" class="d-md-block">
              <div class="d-block d-md-inline-block pt-1">
                <b-dropdown
                  id="ddown1"
                  :text="`${$t('pages.filterby')} ${filter.label}`"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xs"
                >
                  <b-dropdown-item
                    v-for="(filter,index) in filterOptions"
                    :key="index"
                    @click="changeFilterBy(filter)"
                  >{{ filter.label }}</b-dropdown-item>
                </b-dropdown>

                <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                  <b-input :placeholder="$t('menu.search')" v-model="search" />
                </div>
              </div>
              <div class="float-md-right pt-1">
                <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
                <b-dropdown
                  id="ddown2"
                  right
                  :text="`${perPage}`"
                  variant="outline-dark"
                  class="d-inline-block"
                  size="xs"
                >
                  <b-dropdown-item
                    v-for="(size,index) in pageSizes"
                    :key="index"
                    @click="changePageSize(size)"
                  >{{ size }}</b-dropdown-item>
                </b-dropdown>
              </div>
            </b-collapse>
          </div>
          <div class="separator mb-5" />
        </b-colxx>
      </b-row>
      <template v-if="isLoad">
        <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
          <vehiculo-list-item
            :key="item.id"
            :data="item"
            :selected-items="selectedItems"
            @toggle-item="toggleItem"
            v-contextmenu:contextmenu
          />
        </b-colxx>
        <b-row v-if="lastPage>1">
          <b-colxx xxs="12">
            <b-pagination-nav
              :number-of-pages="lastPage"
              :link-gen="linkGen"
              v-model="page"
              :per-page="perPage"
              align="center"
            >
              <template v-slot:next-text>
                <i class="simple-icon-arrow-right" />
              </template>
              <template v-slot:prev-text>
                <i class="simple-icon-arrow-left" />
              </template>
              <template v-slot:first-text>
                <i class="simple-icon-control-start" />
              </template>
              <template v-slot:last-text>
                <i class="simple-icon-control-end" />
              </template>
            </b-pagination-nav>
          </b-colxx>
        </b-row>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
      <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu">
        <v-contextmenu-item @click="onContextCopy()">
          <i class="simple-icon-docs" />
          <span>Copy</span>
        </v-contextmenu-item>
        <v-contextmenu-item @click="onContextArchive()">
          <i class="simple-icon-drawer" />
          <span>Move to archive</span>
        </v-contextmenu-item>
        <v-contextmenu-item @click="onContextDelete()">
          <i class="simple-icon-trash" />
          <span>Delete</span>
        </v-contextmenu-item>
      </v-contextmenu>
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import {
  required,
  requiredIf,
  minLength,
  maxLength,
  email
} from "vuelidate/lib/validators";

import {
  DataListIcon,
  ThumbListIcon,
  ImageListIcon
} from "../../../components/Svg";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ServicesCore from "../../../services/service";

import VehiculoListItem from "../../../components/Listing/VehiculoListItem";

export default {
  components: {
    "data-list-icon": DataListIcon,
    "thumb-list-icon": ThumbListIcon,
    "image-list-icon": ImageListIcon,
    "v-select": vSelect,
    "vehiculo-list-item": VehiculoListItem
  },
  data() {
    return {
      isLoad: false,
      filter: {
        column: "placa",
        label: "Placa"
      },
      filterOptions: [
        {
          column: "placa",
          label: "Placa"
        },
        {
          column: "firstName",
          label: "Nombre cliente"
        },
        {
          column: "identificacion",
          label: "Identificacion"
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
      newItem: {
        placa: "",
        celular: "",
        email: ""
      }
    };
  },
  validations: {
    newItem: {
      placa: {
        required
      },
      celular: {
        required: requiredIf(function(celular) {
          return !this.newItem.email;
        }),
        maxLength: maxLength(10),
        minLength: minLength(10)
      },
      email: {
        required: requiredIf(function(email) {
          return !this.newItem.celular;
        }),
        email
      }
    }
  },
  methods: {
    loadItems(page, perPage, columnFilter, filter) {
      this.isLoad = false;
      console.log("Carga lista de clientes ::::>", this.currentUser);
      ServicesCore.getPaginateVehiculosByIdTaller(
        this.currentUser.IdTaller,
        page,
        perPage,
        columnFilter,
        filter
      ).then(response => {
        if (response.status == 200) {
          console.debug("Resultado lista de talleres ::::>", response.data);
          this.items = response.data.docs;
          this.total = response.data.total;
          this.lastPage = response.data.pages;
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
        this.selectedItems = this.items.map(x => x.IdVehiculo);
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
      //console.log('PageNum ::>',pageNum);
      return "#page-" + pageNum;
    },
    onValitadeFormSubmit() {
      this.$v.$touch();
      var vehiculo = {
        placa: this.newItem.placa,
        celular: this.newItem.celular,
        usuario: { email: this.newItem.email },
        IdTaller: this.currentUser.IdTaller
      };
      // if its still pending or an error is returned do not submit
      if (this.$v.newItem.$pending || this.$v.newItem.$error) return;

      ServicesCore.createVehiculo(vehiculo)
        .then(response => {
          if (response.status == 200) {
            this.newItem = {
              placa: "",
              celular: "",
              email: ""
            };
            this.$notify(
              "success",
              "Resultado",
              "Se creo el vehiculo correctamente",
              {
                duration: 3000,
                permanent: false
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
        .catch(error => {
          console.log("Error al registrar cliente :::>", error);
          this.$notify("error filled", "ERROR", "Error al registrar cliente", {
            duration: 3000,
            permanent: false
          });
        });
    }
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
    }
  },
  watch: {
    search() {
      console.log("Value to search ::> ", this.search);
      this.page = 1;
      this.loadItems(this.page, this.perPage, this.filter.column, this.search);
    },
    page() {
      console.log("New Page ::>", this.page);
      this.loadItems(this.page, this.perPage, this.filter.column, this.search);
    }
  },
  mounted() {
    this.loadItems(this.page, this.perPage, this.filter.column, this.search);
  }
};
</script>
