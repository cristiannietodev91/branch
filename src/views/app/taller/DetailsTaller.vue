<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{ $t('menu.branch.taller') }} {{ $route.params.IdTaller}}</h1>
        <div class="top-right-button-container">
          <b-button
            v-b-modal.modalAddMecanico
            variant="primary"
            size="lg"
            class="top-right-button"
          >{{ $t('pages.add-new') }}</b-button>
          <b-modal
            id="modalAddMecanico"
            ref="modalAddMecanico"
            :title="$t('pages.branch.add-new-mecanico')"
            modal-class="modal-right"
            hide-footer
          >
            <b-form @submit.prevent="onValitadeFormSubmit">
              <b-form-group :label="$t('branch.mecanico.identificacion')">
                <b-form-input
                  v-model="$v.newMecanico.identificacion.$model"
                  :state="!$v.newMecanico.identificacion.$error"
                />
                <b-form-invalid-feedback
                  v-if="!$v.newMecanico.identificacion.required"
                >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else-if="!$v.newMecanico.identificacion.minLength || !$v.newMecanico.identificacion.maxLength"
                >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group :label="$t('branch.mecanico.firstName')">
                <b-form-input
                  v-model="$v.newMecanico.firstName.$model"
                  :state="!$v.newMecanico.firstName.$error"
                />
                <b-form-invalid-feedback
                  v-if="!$v.newMecanico.firstName.required"
                >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group :label="$t('branch.mecanico.lastName')">
                <b-form-input
                  v-model="$v.newMecanico.lastName.$model"
                  :state="!$v.newMecanico.lastName.$error"
                />
                <b-form-invalid-feedback
                  v-if="!$v.newMecanico.lastName.required"
                >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group :label="$t('branch.mecanico.skills')">
                <input-tag
                  v-model="newMecanico.skills"
                  :placeholder="$t('form-components.tags')"
                  :limit="4"
                ></input-tag>
              </b-form-group>
              <b-button
                variant="outline-secondary"
                @click="hideModal('modalAddMecanico')"
              >{{ $t('pages.cancel') }}</b-button>
              <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
            </b-form>
          </b-modal>
        </div>
        <piaf-breadcrumb />
        <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
          <b-tab :title="$t('pages.details')">
            <b-card class="mb-4" no-body>
              <div class="position-absolute card-top-buttons">
                <b-button variant="outline-white" class="icon-button">
                  <i class="simple-icon-pencil" />
                </b-button>
              </div>
              <img
                :alt="taller.email"
                :src="taller.logo || '/assets/img/detail.jpg' "
                class="card-img-top-2"
              />
              <b-card-body>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.nombreTaller') }}</p>
                <p class="mb-3">{{taller.nombre}}</p>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.identificacion') }}</p>
                <div class="mb-3">{{taller.identificacion}}</div>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.celular') }}</p>
                <p class="mb-3">{{taller.celular}}</p>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.email') }}</p>
                <div class="mb-3">{{taller.email}}</div>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.direccion') }}</p>
                <div class="mb-3">{{taller.direccion}}</div>
              </b-card-body>
            </b-card>
          </b-tab>

          <b-tab :title="$t('pages.branch.mecanicos')">
            <b-row>
              <b-colxx>
                <mecanicos-items
                  v-for="(mecanico,index) in taller.Mecanicos"
                  :key="index"
                  :data="mecanico"                  
                />
              </b-colxx>
            </b-row>
          </b-tab>
        </b-tabs>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import MecanicosItem from "../../../components/Listing/MecanicosListItem";
import InputTag from "../../../components/Form/InputTag";

import ServicesCore from "../../../services/service";

export default {
  components: {
    "input-tag": InputTag,
    "mecanicos-items": MecanicosItem
  },
  data() {
    return {
      isLoad: false,
      taller: {},
      newMecanico: {
        identificacion: "",
        firstName: "",
        lastName: "",
        skills: []
      }
    };
  },
  validations: {
    newMecanico: {
      identificacion: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(2)
      },
      firstName: {
        required
      },
      lastName: {
        required
      },
      skills: {
        required
      }
    }
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    onValitadeFormSubmit() {
      this.$v.$touch();
      var myJsonString = JSON.stringify(this.newMecanico.skills);
      var mecanico = {
        identificacion: this.newMecanico.identificacion,
        firstName: this.newMecanico.firstName,
        lastName: this.newMecanico.lastName,
        skills: myJsonString,
        taller: this.taller
      };
      // if its still pending or an error is returned do not submit
      if (this.$v.newMecanico.$pending || this.$v.newMecanico.$error) return;

      console.log(JSON.stringify(mecanico));
      ServicesCore.createMecanico(mecanico).then(response => {
        if (response.status == 200) {
          //this.loadItems();
          this.hideModal("modalAddMecanico");
          this.newMecanico = {
            identificacion: "",
            firstName: "",
            lastName: "",
            skills: []
          };
        } else {
        }
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
    ServicesCore.getTallerById(this.$route.params.IdTaller).then(response => {
      if (response.status == 200 || response.status == 304) {
        this.taller = response.data;
        console.log('Taller :::>',this.taller);
      }
    });
  }
};
</script>
