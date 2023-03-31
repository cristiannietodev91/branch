<template>
  <div class="row h-100">
    <div class="col col-12 col-md-10 mx-auto my-auto">
      <div class="card auth-card">
        <div class="position-relative image-side">
          <p class="h2">
            {{ $t('dashboards.magic-is-in-the-details') }}
          </p>
          <p class="mb-0">
            {{ $t('user.text-credentials') }}
            <br>{{ $t('user.text-nomember') }}, 
            <router-link to="/user/register">
              crear mi cuenta
            </router-link>.
          </p>
        </div>
        <div class="form-side">
          <router-link v-slot="{ navigate }" to="/" custom>
            <span role="link" class="logo-single" @click="navigate" @keypress.enter="navigate" />
          </router-link>
          <h6 class="mb-4">
            {{ $t('user.login-title') }}
          </h6>

          <form novalidate class="av-tooltip tooltip-label-bottom" @submit.prevent="formSubmit">
            <div class="has-float-label mb-4">
              <label for="reset_password" class="form-label">{{ $t('user.password') }}</label>
              <div class="input-group has-validation">
                <input
                  id="reset_password" v-model="v$.form.password.$model" type="password" class="form-control"
                  :class="{ 'is-invalid': v$.form.password.$error }"
                >
                <div v-if="v$.form.password.required.$invalid" class="invalid-feedback">
                  Ingrese la nueva contraseña
                </div>
                <div
                  v-else-if="v$.form.password.minLength.$invalid || !v$.form.password.maxLength.$invalid" 
                  class="invalid-feedback"
                >
                  Su contraseña debe tener entre 4 y 16 caracteres
                </div>
              </div>
            </div>
            <div class="has-float-label mb-4">
              <label for="reset_repeat_password" class="form-label">{{ $t('user.password-again') }}</label>
              <div class="input-group has-validation">
                <input
                  id="reset_repeat_password" v-model="v$.form.passwordAgain.$model" type="password" class="form-control"
                  :class="{ 'is-invalid': v$.form.passwordAgain.$error }"
                >
                <div v-if="v$.form.passwordAgain.required.$invalid" class="invalid-feedback">
                  Verifique su nueva contraseña
                </div>
                <div
                  v-else-if="v$.form.passwordAgain.sameAsPassword.$invalid" 
                  class="invalid-feedback"
                >
                  Las contraseñas no coinciden
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <router-link to="/user/forgot-password">
                {{ $t('user.forgot-password-question') }}
              </router-link>
              <button
                type="submit" 
                class="btn btn-primary btn-lg btn-multiple-state btn-shadow"
                variant="primary" size="lg" :disabled="processing"
                :class="{'show-spinner': processing,
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
    maxLength,
    minLength,
    sameAs
} from "@vuelidate/validators";

export default {
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            form: {
                password: "",
                passwordAgain: ""
            },
        };
    },
    validations: {
        form: {
            password: {
                required,
                maxLength: maxLength(16),
                minLength: minLength(4)
            },
            passwordAgain: {
                required,
                sameAsPassword: sameAs('password')

            },
        }
    },
    computed: {
        ...mapGetters(["currentUser", "processing", "loginError", "resetPasswordSuccess"])
    },
    watch: {
        loginError(val) {
            if (val != null) {
                this.$notify("error", "Reset Password Error", val, {
                    duration: 3000,
                    permanent: false
                });

            }
        },
        resetPasswordSuccess(val) {
            if (val) {
                this.$notify(
                    "success",
                    "Reset Password Success",
                    "Reset password success", {
                        duration: 3000,
                        permanent: false
                    }
                );
            }
        }
    },
    methods: {
        ...mapActions(["resetPassword"]),
        async formSubmit() {
            this.v$.form.$touch();

            const isFormCorrect = await this.v$.$validate()

            if (!isFormCorrect) return
            this.resetPassword({
                newPassword: this.form.password,
                resetPasswordCode: this.$route.query.oobCode || ""
            });
            
        }
    },
};
</script>
