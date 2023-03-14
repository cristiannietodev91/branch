<template>
  <div class="row h-100">
    <div class="col col-12 col-md-10 mx-auto my-auto">
      <div class="card auth-card">
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
            <router-link to="/register">
              crea una cuenta
            </router-link>.
          </p>
        </div>
        <div class="form-side">
          <h6 class="mb-4">
            {{ $t('user.login-title') }}
          </h6>

          <form novalidate @submit.prevent="formSubmit">
            <div class="has-float-label mb-4">
              <label for="login_email" class="form-label">{{ $t('user.email') }}</label>
              <div class="input-group has-validation">
                <input
                  id="login_email"
                  v-model="v$.form.email.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.form.email.$error }"
                >
                <div v-if="v$.form.email.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.form.email.email.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.email') }}
                </div>
                <div v-else-if="v$.form.email.minLength.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.longitud') }}
                </div>
              </div>
            </div>

            <div class="has-float-label mb-4">
              <label for="login_password" class="form-label">{{ $t('user.password') }}</label>
              <div class="input-group has-validation">
                <input
                  id="login_password"
                  v-model="v$.form.password.$model"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': v$.form.password.$error }"
                >
                <div
                  v-if="v$.form.password.required.$invalid"
                  class="invalid-feedback"
                >
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div
                  v-else-if="v$.form.password.minLength.$invalid || v$.form.password.maxLength.$invalid"
                  class="invalid-feedback"
                >
                  Su contraseña debe tener al menos 16 caracteres
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <router-link
                to="/forgot-password"
              >
                {{ $t('user.forgot-password-question') }}
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
                <span class="label">{{ $t('user.login-button') }}</span>
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
    async formSubmit() {
      const isFormCorrect = await this.v$.$validate()

      if (!isFormCorrect) return
      
      this.login({
          email: this.form.email,
          password: this.form.password
      }); 
      
    }
  }
};
</script>
