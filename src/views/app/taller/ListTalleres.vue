<template>
  <b-row>
    <b-colxx class="disable-text-selection">
      <b-row>
        <b-colxx xxs="12">
          <h1>{{ $t('branch.taller.listaTalleres') }}</h1>
          <div class="top-right-button-container">
            <b-button
              v-b-modal.modalAddTaller
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
              id="modalAddTaller"
              ref="modalAddTaller"
              :title="$t('branch.taller.add-new-taller-title')"
              hide-footer>
              <b-form @submit.prevent="onValitadeFormSubmit" class="av-tooltip tooltip-label-right">
                <b-form-group label-cols="2" horizontal :label="$t('branch.taller.nombreTaller')">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.nombre.$model"
                    :state="!$v.newItem.nombre.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.nombre.required"
                  >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.newItem.nombre.minLength || !$v.newItem.nombre.maxLength"
                  >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('branch.taller.identificacion')">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.identificacion.$model"
                    :state="!$v.newItem.identificacion.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.identificacion.required"
                  >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.identificacion.alpha"
                  >{{$t('branch.forms.validations.nit')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.newItem.nombre.minLength || !$v.newItem.nombre.maxLength"
                  >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label-cols="2" horizontal :label="$t('branch.taller.direccion')">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.direccion.$model"
                    :state="!$v.newItem.direccion.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.direccion.required"
                  >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.newItem.direccion.minLength || !$v.newItem.direccion.maxLength"
                  >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label-cols="2" horizontal :label="$t('branch.taller.celular')">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.celular.$model"
                    :state="!$v.newItem.celular.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.celular.required"
                  >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.newItem.celular.minLength || !$v.newItem.direccion.maxLength"
                  >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label-cols="2" horizontal :label="$t('branch.taller.email')">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.email.$model"
                    :state="!$v.newItem.email.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.email.required"
                  >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.newItem.email.email"
                  >{{$t('branch.forms.validations.email')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.newItem.email.minLength || !$v.newItem.email.maxLength"
                  >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('branch.taller.logo')">
                  <b-form-input
                    type="text"
                    v-model="$v.newItem.urlLogo.$model"
                    :state="!$v.newItem.urlLogo.$error"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.newItem.urlLogo.required"
                  >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.newItem.urlLogo.url"
                  >{{$t('branch.forms.validations.url')}}</b-form-invalid-feedback>
                </b-form-group>
                <b-button
                  variant="outline-secondary"
                  @click="hideModal('modalAddTaller')"
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
              v-b-toggle.displayOptions>
              {{ $t('pages.display-options') }}
              <i class="simple-icon-arrow-down align-middle" />
            </b-button>
            <b-collapse id="displayOptions" class="d-md-block">
              <div class="d-block d-md-inline-block pt-1">
                <b-dropdown
                  id="ddown1"
                  :text="`${$t('pages.orderby')} ${sort.label}`"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xs"
                >
                  <b-dropdown-item
                    v-for="(order,index) in sortOptions"
                    :key="index"
                    @click="changeOrderBy(order)"
                  >{{ order.label }}</b-dropdown-item>
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
        
        <b-row >
          <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
            <taller-list-item
              :key="item.id"
              :data="item"
              :selected-items="selectedItems"
              @toggle-item="toggleItem"
              v-contextmenu:contextmenu
            />
          </b-colxx>
        </b-row>
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
import {
  required,
  minLength,
  maxLength,
  email,
  helpers,
  url
} from "vuelidate/lib/validators";

import {
  DataListIcon,
  ThumbListIcon,
  ImageListIcon
} from "../../../components/Svg";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ServicesCore from "../../../services/service";

import ImageListItem from "../../../components/Listing/ImageListItem";
import ThumbListItem from "../../../components/Listing/ThumbListItem";
import TallerListItem from "../../../components/Listing/TallerListItem";

const alpha = helpers.regex('alpha', /(^[0-9]+-{1}[0-9]{1})/)

export default {
  components: {
    "data-list-icon": DataListIcon,
    "thumb-list-icon": ThumbListIcon,
    "image-list-icon": ImageListIcon,
    "v-select": vSelect,
    "image-list-item": ImageListItem,
    "thumb-list-item": ThumbListItem,
    "taller-list-item": TallerListItem
  },
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
      urlLogo:{
        required,
        url
      }
    }
  },
  methods: {
    loadItems() {
      this.isLoad = false;
      ServicesCore.getAllTalleres().then(response => {
        console.debug("Resultado lista de talleres ::::>", response.data);
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
      this.$v.$touch();
      var taller = {
        nombre: this.newItem.nombre,
        identificacion: this.newItem.identificacion,
        direccion: this.newItem.direccion,
        celular: this.newItem.celular,
        email: this.newItem.email,
        logo: this.newItem.urlLogo
      };
      // if its still pending or an error is returned do not submit
      if (this.$v.newItem.$pending || this.$v.newItem.$error) return;

      console.log(JSON.stringify(taller));
      ServicesCore.createTaller(taller).then(response => {
        if (response.status == 200) {
          this.loadItems();
          this.hideModal("modalAddTaller");
        } else {
        }
      });
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
  }
};
</script>
