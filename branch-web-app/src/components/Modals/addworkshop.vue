<template>
  <v-modal
    id="modalAddTaller" ref="modalAddTaller" class="fade" :title="$t('branch.taller.add-new-taller-title')"
    :show="open"
    @close="hideModal('modalAddTaller')"
  >
    <form novalidate @submit.prevent="onValitadeFormSubmit">
      <div class="row">
        <label for="workshop_name" class="form-label">{{ $t('branch.taller.nombreTaller') }}</label>
        <div class="input-group col-sm-10 has-validation">
          <input
            id="workshop_name" v-model="v$.newItem.nombre.$model" type="text"
            class="form-control" :class="{ 'is-invalid': v$.newItem.nombre.$error }"
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
            id="workshop_id" v-model="v$.newItem.identificacion.$model" type="text"
            class="form-control" :class="{ 'is-invalid': v$.newItem.identificacion.$error }"
          >
          <div v-if="v$.newItem.identificacion.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
          <div
            v-else-if="v$.newItem.identificacion.minLength.$invalid || v$.newItem.identificacion.maxLength.$invalid"
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
            id="workshop_address" v-model="v$.newItem.direccion.$model" type="text"
            class="form-control" :class="{ 'is-invalid': v$.newItem.direccion.$error }"
          >
          <div v-if="v$.newItem.direccion.required.$invalid" class="invalid-feedback">
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
            id="workshop_phone" v-model="v$.newItem.celular.$model" type="text"
            class="form-control" :class="{ 'is-invalid': v$.newItem.celular.$error }"
          >
          <div v-if="v$.newItem.celular.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
          <div
            v-else-if="v$.newItem.celular.minLength.$invalid || v$.newItem.direccion.maxLength.$invalid"
            class="invalid-feedback"
          >
            {{ $t('branch.forms.validations.longitud') }}
          </div>
        </div>
      </div>
      <div class="row">
        <label for="workshop_email" class="form-label">{{ $t('branch.taller.email') }}</label>
        <div class="input-group col-sm-10 has-validation">
          <input
            id="workshop_email" v-model="v$.newItem.email.$model" type="text"
            class="form-control" :class="{ 'is-invalid': v$.newItem.email.$error }"
          >
          <div v-if="v$.newItem.email.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
          <div v-else-if="v$.newItem.email.email.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.email') }}
          </div>
        </div>
      </div>
      <div class="row">
        <label for="workshop_logo" class="form-label">{{ $t('branch.taller.logo') }}</label>
        <div class="input-group col-sm-10 has-validation">
          <input
            id="workshop_logo" v-model="v$.newItem.urlLogo.$model" type="text"
            class="form-control" :class="{ 'is-invalid': v$.newItem.urlLogo.$error }"
          >
          <div v-if="v$.newItem.urlLogo.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
          <div v-else-if="v$.newItem.urlLogo.url.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.url') }}
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-outline-secondary" @click="hideModal('modalAddTaller')">
        {{ $t('pages.cancel') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ $t('forms.submit') }}
      </button>
    </form>
  </v-modal>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import {
    required,
    minLength,
    maxLength,
    email,
    url
} from "@vuelidate/validators";
import ServicesCore from "../../services/service"
import Modal from "./SharedModal.vue";

export default {
    name: "modal-add-workskop",
    components: {
        "v-modal": Modal,
    },
    props: {
        open: {
            type: Boolean,
            default: true,
        }
    },
    emits: ['loadItems', 'close'],
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            newItem: {
                nombre: "",
                identificacion: "",
                direccion: "",
                celular: "",
                email: "",
                urlLogo: ""
            }
        }
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
    methods: {
        hideModal(refname) {
            if(this.$refs[refname] && this.$refs[refname].open){
                this.$refs[refname].hide();
            }
            this.$emit('close')
        },
        async onValitadeFormSubmit() {
            const isFormCorrect = await this.v$.$validate()

            if (!isFormCorrect) return

            const taller = {
                nombre: this.newItem.nombre,
                identificacion: this.newItem.identificacion,
                direccion: this.newItem.direccion,
                celular: this.newItem.celular,
                email: this.newItem.email,
                logo: this.newItem.urlLogo
            };

            console.log(JSON.stringify(taller));
            ServicesCore.createTaller(taller).then(response => {
                if (response.status == 200) {
                    this.$emit('loadItems')
                    this.hideModal("modalAddTaller");
                }
            });
        }
    }
}
</script>