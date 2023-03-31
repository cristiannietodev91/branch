<template>
  <div class="row h-100">
    <div class="col col-12 col-md-10 mx-auto my-auto">
      <div class="card auth-card">
        <div class="position-relative image-side">
          <p class="h4">
            Reset password
          </p>
          <p class="mb-0">
            Use su email para recuperar su contraseña
            <br>Si no tiene una cuenta, puede crear una 
            <router-link to="/user/register">
              aquí
            </router-link>.
          </p>
        </div>
        <div class="form-side">
          <router-link to="/">
            <span class="logo-single" />
          </router-link>
          <h6 class="mb-4">
            {{ $t('user.forgot-password') }}
          </h6>
          <form novalidate @submit.prevent="formSubmit">
            <div class="has-float-label mb-4">
              <label for="login_email" class="form-label">{{ $t('user.email') }}</label>
              <div class="input-group has-validation">
                <input
                  id="login_email" v-model="v$.form.email.$model" type="text" class="form-control"
                  :class="{ 'is-invalid': v$.form.email.$error }"
                >
                <div v-if="v$.form.email.required.$invalid" class="invalid-feedback">
                  Ingrese su email
                </div>
                <div v-else-if="v$.form.email.email.$invalid" class="invalid-feedback">
                  Ingrese un email válido
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <router-link to="/user/login">
                {{ $t('user.login-title') }}
              </router-link>
              <button
                class="btn btn-primary btn-lg"
                type="submit" 
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
                <span class="label">{{ $t('user.reset-password-button') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import {
    mapGetters,
    mapActions
} from "vuex";
import {
    required,
    email
} from "@vuelidate/validators";

export default {
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            form: {
                email: ""
            }
        };
    },
    validations: {
        form: {
            email: {
                required,
                email,
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
        async formSubmit() {
            const isFormCorrect = await this.v$.$validate()

            if (!isFormCorrect) return
            
            this.forgotPassword({
                email: this.form.email
            });
            
        }
    },
};
</script>
