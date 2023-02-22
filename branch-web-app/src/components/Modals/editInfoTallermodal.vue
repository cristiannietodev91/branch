<template>
  <b-modal
    id="modalEditTaller"
    ref="modalEditTaller"
    :title="$t('branch.taller.editTaller')"
    modal-class="modal-right"
    hide-footer
  >
    <b-form @submit.prevent="onValitadeFormSubmit">
      <b-form-group :label="$t('branch.taller.nombreTaller')">
        <b-form-input v-model="$v.editTaller.nombre.$model" :state="!$v.editTaller.nombre.$error" />
        <b-form-invalid-feedback
          v-if="!$v.editTaller.nombre.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.taller.logo')">
        <b-form-input v-model="$v.editTaller.logo.$model" :state="!$v.editTaller.logo.$error" />
        <b-form-invalid-feedback
          v-if="!$v.editTaller.logo.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-if="!$v.editTaller.logo.url"
        >{{$t('branch.forms.validations.url')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.taller.identificacion')">
        <b-form-input
          v-model="$v.editTaller.identificacion.$model"
          :state="!$v.editTaller.identificacion.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.editTaller.identificacion.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-if="!$v.editTaller.identificacion.numeric"
        >{{$t('branch.forms.validations.numeric')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.taller.email')">
        <b-form-input v-model="$v.editTaller.email.$model" :state="!$v.editTaller.email.$error" />
        <b-form-invalid-feedback
          v-if="!$v.editTaller.email.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-if="!$v.editTaller.email.email"
        >{{$t('branch.forms.validations.email')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.taller.celular')">
        <b-form-input
          v-model="$v.editTaller.celular.$model"
          :state="!$v.editTaller.celular.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.editTaller.celular.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-if="!$v.editTaller.celular.numeric"
        >{{$t('branch.forms.validations.numeric')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else-if="!$v.editTaller.celular.minLength || !$v.editTaller.celular.maxLength"
        >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.taller.direccion')">
        <b-form-input
          v-model="$v.editTaller.direccion.$model"
          :state="!$v.editTaller.direccion.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.editTaller.direccion.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.taller.latitude')">
        <b-form-input
          v-model="$v.editTaller.latitude.$model"
          :state="!$v.editTaller.latitude.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.editTaller.latitude.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-if="!$v.editTaller.latitude.decimal"
        >{{$t('branch.forms.validations.decimal')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.taller.longitud')">
        <b-form-input
          v-model="$v.editTaller.longitud.$model"
          :state="!$v.editTaller.longitud.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.editTaller.longitud.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-if="!$v.editTaller.longitud.decimal"
        >{{$t('branch.forms.validations.decimal')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-button
        variant="outline-secondary"
        @click.once="hideModal('modalEditTaller')"
      >{{ $t('pages.cancel') }}</b-button>
      <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
    </b-form>
  </b-modal>
</template>

<script>
import {
  required,
  numeric,
  url,
  email,
  maxLength,
  minLength,
  decimal
} from "vuelidate/lib/validators";
import ServicesCore from "../../services/service";

export default {
  props: ["taller"],
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
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    onValitadeFormSubmit() {
      this.$v.$touch();

      // if its still pending or an error is returned do not submit
      if (this.$v.editTaller.$pending || this.$v.editTaller.$error) return;

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
            this.$notify("error filled", "ERROR", error.response.data.error, {
              duration: 3000,
              permanent: false
            });
          } else {
            this.$notify("error filled", "ERROR", error.message, {
              duration: 3000,
              permanent: false
            });
          }
        });
    }
  },
  mounted() {
    console.log("Mouned");
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
  }
};
</script>

<style>
</style>
