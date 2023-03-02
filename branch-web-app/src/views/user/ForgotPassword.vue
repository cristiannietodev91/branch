<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <p class="h2">
            {{ $t('dashboards.magic-is-in-the-details') }}
          </p>
          <p class="mb-0">
            Use su email para recuperar su contraseña
            <br>Si no tiene una cuenta, puede crear una 
            <router-link tag="a" to="/user/register" class="">
              aquí
            </router-link>.
          </p>
        </div>
        <div class="form-side">
          <router-link tag="a" to="/">
            <span class="logo-single" />
          </router-link>
          <h6 class="mb-4">
            {{ $t('user.forgot-password') }}
          </h6>
          <b-form class="av-tooltip tooltip-label-bottom" @submit.prevent="formSubmit">
            <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
              <b-form-input v-model="v$.form.email.$model" type="text" :state="!v$.form.email.$error" />
              <b-form-invalid-feedback v-if="!v$.form.email.required">
                Ingrese su email
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!v$.form.email.email">
                Ingrese un email válido
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!v$.form.email.minLength">
                Su email debe tener al menos 4 caracteres
              </b-form-invalid-feedback>
            </b-form-group>
            <div class="d-flex justify-content-between align-items-center">
              <router-link tag="a" to="/user/login">
                {{ $t('user.login-title') }}
              </router-link>
              <b-button
                type="submit" variant="primary" size="lg" :disabled="processing" 
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
                <span class="label">{{ $t('user.reset-password-button') }}</span>
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
import {
    mapGetters,
    mapActions
} from "vuex";
import {
    required,
    minLength,
    email
} from "@vuelidate/validators";

export default {
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            form: {
                email: "test@coloredstrategies.com"
            }
        };
    },
    validations: {
        form: {
            email: {
                required,
                email,
                minLength: minLength(4)
            }
        }
    },
    computed: {
        ...mapGetters(["processing", "loginError", "forgotMailSuccess"])
    },
    watch: {
        loginError(val) {
            if (val != null) {
                this.$notify("error", "Forgot Password Error", val, {
                    duration: 3000,
                    permanent: false
                });
            }
        },
        forgotMailSuccess(val) {
            if (val) {
                this.$notify(
                    "success",
                    "Forgot Password Success",
                    "Please check your email.", {
                        duration: 3000,
                        permanent: false
                    }
                );
            }
        }
    },
    methods: {
        ...mapActions(["forgotPassword"]),
        formSubmit() {
            this.v$.form.$touch();
            if (!this.v$.form.$anyError) {
                this.forgotPassword({
                    email: this.form.email
                });
            }
        }
    },
};
</script>
