<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <p class="text-white h2">
            {{ $t('branch.frase') }}
          </p>
          <p class="mb-0">
            Por favor llene los datos para crear una cuenta
            <br>Si ya está registrado puede
            <router-link tag="a" to="/user/login" class>
              iniciar sesión
            </router-link>.
          </p>
        </div>
        <div class="form-side">
          <router-link tag="a" to="/">
            <span class="logo-single" />
          </router-link>
          <h6 class="mb-4">
            {{ $t('user.register') }}
          </h6>
          <b-form class="av-tooltip tooltip-label-bottom" @submit.prevent="formSubmit">
            <b-form-group :label="$t('user.fullname')" class="has-float-label mb-4">
              <b-form-input
                v-model="v$.form.fullname.$model"
                type="text"
                :state="!v$.form.fullname.$error"
              />
              <b-form-invalid-feedback v-if="!v$.form.fullname.required">
                {{ $t('branch.forms.validations.required') }}
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!v$.form.fullname.minLength">
                {{ $t('branch.forms.validations.longitud') }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group :label="$t('user.identificacion')" class="has-float-label mb-4">
              <b-form-input
                v-model="v$.form.identificacion.$model"
                type="text"
                :state="!v$.form.identificacion.$error"
              />
              <b-form-invalid-feedback v-if="!v$.form.identificacion.required">
                {{ $t('branch.forms.validations.required') }}
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!v$.form.identificacion.minLength">
                {{ $t('branch.forms.validations.longitud') }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
              <b-form-input
                v-model="v$.form.email.$model"
                type="text"
                :state="!v$.form.email.$error"
              />
              <b-form-invalid-feedback v-if="!v$.form.email.required">
                {{ $t('branch.forms.validations.required') }}
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!v$.form.email.email">
                {{ $t('branch.forms.validations.email') }}
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!v$.form.email.minLength">
                {{ $t('branch.forms.validations.longitug') }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group :label="$t('user.password')" class="has-float-label mb-4">
              <b-form-input
                v-model="v$.form.password.$model"
                type="password"
                :state="!v$.form.password.$error"
              />
              <b-form-invalid-feedback v-if="!v$.form.password.required">
                {{ $t('branch.forms.validations.required') }}
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!v$.form.password.minLength">
                {{ $t('branch.forms.validations.longitud') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <div class="d-flex justify-content-end align-items-center">
              <b-button
                type="submit"
                variant="primary"
                size="lg"
                class="btn-shadow"
              >
                {{ $t('user.register-button') }}
              </b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import { useVuelidate } from '@vuelidate/core';
import { mapGetters, mapActions } from "vuex";
import {
  required,
  maxLength,
  minLength,
  email
} from "@vuelidate/validators";

export default {
  name: "register-page",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      form: {
        fullname: "",
        email: "",
        password: "",
        identificacion: ""
      }
    };
  },
  validations: {
    form: {
      fullname: {
        required,
        maxLength: maxLength(40),
        minLength: minLength(4)
      },
      password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(4)
      },
      email: {
        required,
        email,
        minLength: minLength(4)
      },
      identificacion: {
        required,
        maxLength: maxLength(40),
        minLength: minLength(4)
      }
    }
  },
  computed: {
    ...mapGetters(["currentUser", "processing", "loginError"])
  },
  watch: {
    currentUser(val) {
      console.log("Userr wtach ::::>", val);
      if (val && val.uid && val.uid.length > 0) {
        setTimeout(() => {
          this.$router.push("/");
        }, 200);
      }
    },
    loginError(val) {
      if (val != null) {
        this.$notify("error", "Login Error", val, {
          duration: 3000,
          permanent: false
        });
      }
    }
  },
  methods: {
    ...mapActions(["register"]),
    formSubmit() {
      console.log("register");
      this.v$.$touch();
      this.v$.form.$touch();
      if (!this.v$.form.$anyError) {
        this.register({
          firstName: this.form.fullname,
          identificacion: this.form.identificacion,
          email: this.form.email,
          password: this.form.password
        });
      }
      //this.$router.push('/')
    }
  }
};
</script>
