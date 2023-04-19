<template>
  <div
    id="modalEditTaller" ref="modalEditTaller" class="modal modal-right"
    tabindex="-1" aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="modalEditTallerLabel" class="modal-title fs-5">
            {{ $t('branch.taller.editTaller') }}
          </h1>
        </div>
        <div class="modal-body">
          <form novalidate @submit.prevent="onValitadeFormSubmit">
            <div>
              <label for="workshop_name" class="form-label">{{ $t('branch.taller.nombreTaller') }}</label>
              <div class="input-group has-validation">
                <input
                  id="workshop_name"
                  v-model="v$.editTaller.nombre.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.editTaller.nombre.$error }"
                >
                <div v-if="v$.editTaller.nombre.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
              </div>
            </div>
            <div>
              <label for="workshop_logo" class="form-label">{{ $t('branch.taller.logo') }}</label>
              <div class="input-group has-validation">
                <input
                  id="workshop_logo"
                  v-model="v$.editTaller.logo.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.editTaller.logo.$error }"
                >
                <div v-if="v$.editTaller.logo.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.editTaller.logo.url.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.url') }}
                </div>
              </div>
            </div>
            <div>
              <label for="workshop_id" class="form-label">{{ $t('branch.taller.logo') }}</label>
              <div class="input-group has-validation">
                <input
                  id="workshop_id"
                  v-model="v$.editTaller.identificacion.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.editTaller.identificacion.$error }"
                >
                <div v-if="v$.editTaller.identificacion.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.editTaller.identificacion.numeric.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.numeric') }}
                </div>
              </div>
            </div>
            <div>
              <label for="workshop_email" class="form-label">{{ $t('branch.taller.email') }}</label>
              <div class="input-group has-validation">
                <input
                  id="workshop_email"
                  v-model="v$.editTaller.email.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.editTaller.email.$error }"
                >
                <div v-if="v$.editTaller.email.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.editTaller.email.email.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.email') }}
                </div>
              </div>
            </div>
            <div>
              <label for="workshop_cel_phone" class="form-label">{{ $t('branch.taller.celular') }}</label>
              <div class="input-group has-validation">
                <input
                  id="workshop_cel_phone"
                  v-model="v$.editTaller.celular.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.editTaller.celular.$error }"
                >
                <div v-if="v$.editTaller.celular.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.editTaller.celular.numeric.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.numeric') }}
                </div>
                <div
                  v-else-if="v$.editTaller.celular.minLength.$invalid || v$.editTaller.celular.maxLength.$invalid" 
                  class="invalid-feedback"
                >
                  {{ $t('branch.forms.validations.longitud') }}
                </div>
              </div>
            </div>
            <div>
              <label for="workshop_address" class="form-label">{{ $t('branch.taller.direccion') }}</label>
              <div class="input-group has-validation">
                <input
                  id="workshop_address"
                  v-model="v$.editTaller.direccion.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.editTaller.direccion.$error }"
                >
                <div v-if="v$.editTaller.direccion.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
              </div>
            </div>
            <div>
              <label for="workshop_latitude" class="form-label">{{ $t('branch.taller.latitude') }}</label>
              <div class="input-group has-validation">
                <input
                  id="workshop_latitude"
                  v-model="v$.editTaller.latitude.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.editTaller.latitude.$error }"
                >
                <div v-if="v$.editTaller.latitude.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.editTaller.latitude.decimal.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.decimal') }}
                </div>
              </div>
            </div>
            <div>
              <label for="workshop_longitude" class="form-label">{{ $t('branch.taller.longitud') }}</label>
              <div class="input-group has-validation">
                <input
                  id="workshop_longitude"
                  v-model="v$.editTaller.longitud.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.editTaller.longitud.$error }"
                >
                <div v-if="v$.editTaller.longitud.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.editTaller.longitud.decimal.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.decimal') }}
                </div>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click.once="hideModal('modalEditTaller')"
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
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  numeric,
  url,
  email,
  maxLength,
  minLength,
  decimal
} from "@vuelidate/validators";
import ServicesCore from "../../services/service";

export default {
  props: ["taller"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      editTaller: {
        logo: "",
        nombre: "",
        identificacion: "",
        email: "",
        celular: "",
        direccion: "",
        latitude: "",
        longitud: ""
      }
    };
  },
  validations: {
    editTaller: {
      logo: {
        required,
        url
      },
      nombre: {
        required
      },
      identificacion: {
        required,
        numeric
      },
      email: {
        required,
        email
      },
      celular: {
        required,
        numeric,
        maxLength: maxLength(10),
        minLength: minLength(10)
      },
      direccion: {
        required
      },
      latitude: {
        required,
        decimal
      },
      longitud: {
        required,
        decimal
      }
    }
  },
  mounted() {
    this.editTaller = {
      logo: this.taller.logo,
      nombre: this.taller.nombre,
      identificacion: this.taller.identificacion,
      email: this.taller.email,
      celular: this.taller.celular,
      direccion: this.taller.direccion,
      latitude: this.taller.latitude,
      longitud: this.taller.longitud
    };
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    onValitadeFormSubmit() {
      this.v$.$touch();

      // if its still pending or an error is returned do not submit
      if (this.v$.editTaller.$pending || this.v$.editTaller.$error) return;

      const taller = {
        IdTaller: this.taller.IdTaller,
        logo: this.editTaller.logo,
        nombre: this.editTaller.nombre,
        identificacion: this.editTaller.identificacion,
        email: this.editTaller.email,
        celular: this.editTaller.celular,
        direccion: this.editTaller.direccion,
        latitude: this.editTaller.latitude,
        longitud: this.editTaller.longitud
      };

      ServicesCore.updateTaller(taller)
        .then(response => {
          if (response.status == 202) {
            //this.loadItems();
            this.hideModal("modalEditTaller");

            this.$emit("loadInfoTaller");

            this.$notify(
              "success",
              "Resultado",
              "Se actualizo el taller correctamente",
              {
                duration: 3000,
                permanent: false
              }
            );
          }
        })
        .catch(error => {
          if (error.response) {
            this.$notify({
              title: "ERROR",
              type: "error",
              duration: 3000,
              permanent: false,
              text: error.response.data.error
            });
          } else {
            this.$notify({
              title: "ERROR",
              type: "error",
              duration: 3000,
              permanent: false,
              text: error.message
            });
          }
        });
    }
  }
};
</script>

<style>
</style>
