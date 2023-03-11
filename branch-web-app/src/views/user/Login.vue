<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <h1 class="login-brand">
            <router-link to="/">
              <span class="logo-single" />
              <span class="brand-text">Branch - Todo en el mismo lugar</span>
            </router-link>
          </h1>
          <p class="h5">
            {{ $t('branch.frase') }}
          </p>
          <p class="mb-0">
            {{ $t('user.text-credentials') }}
            <br>
            {{ $t('user.text-nomember') }},
            <router-link to="/user/register">
              crea una cuenta
            </router-link>.
          </p>
        </div>
        <div class="form-side">
          <h6 class="mb-4">
            {{ $t('user.login-title') }}
          </h6>

          <b-form class="av-tooltip tooltip-label-bottom" @submit.prevent="formSubmit">
            <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
              <b-form-input
                v-model="v$.form.email.$model"
                type="text"
                :state="!v$.form.email.$error"
              />
              <b-form-invalid-feedback
                v-if="!v$.form.email.required"
              >
                {{ $t('branch.forms.validations.required') }}
              </b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!v$.form.email.email"
              >
                {{ $t('branch.forms.validations.email') }}
              </b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!v$.form.email.minLength"
              >
                {{ $t('branch.forms.validations.longitud') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group :label="$t('user.password')" class="has-float-label mb-4">
              <b-form-input
                v-model="v$.form.password.$model"
                type="password"
                :state="!v$.form.password.$error"
              />
              <b-form-invalid-feedback
                v-if="!v$.form.password.required"
              >
                {{ $t('branch.forms.validations.required') }}
              </b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!v$.form.password.minLength || !v$.form.password.maxLength"
              >
                Su contraseña debe tener al menos 16 caracteres
              </b-form-invalid-feedback>
            </b-form-group>
            <div class="d-flex justify-content-between align-items-center">
              <router-link
                to="/user/forgot-password"
              >
                {{ $t('user.forgot-password-question') }}
              </router-link>
              <b-button
                type="submit"
                variant="primary"
                size="lg"
                :disabled="processing"
                :class="{'btn-multiple-state btn-shadow': true,
                         'show-spinner': processing,
                         'show-success': !processing && loginError===false,
                         'show-fail': !processing && loginError }"
              >
                <span class="spinner d-inline-block">
                  <span class="bounce1" />
                  <span class="bounce2" />
                  <span class="bounce3" />
                </span>
                <span class="icon success">
                  <i class="simple-icon-check" />
                </span>
                <span class="icon fail">
                  <i class="simple-icon-exclamation" />
                </span>
                <span class="label">{{ $t('user.login-button') }}</span>
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
  name: "login-page",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  validations: {
    form: {
      password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(4)
      },
      email: {
        required,
        email,
        minLength: minLength(4)
      }
    }
  },
  computed: {
    ...mapGetters(["currentUser", "processing", "loginError"])
  },
  watch: {
    currentUser(val) {
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
    ...mapActions(["login"]),
    formSubmit() {
      this.v$.$touch();
      this.v$.form.$touch();
      if (!this.v$.form.$anyError) {
        this.login({
          email: this.form.email,
          password: this.form.password
        });
      }
    }
  }
};
</script>
