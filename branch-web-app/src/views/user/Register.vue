<template>
  <div class="row h-100">
    <div class="col col-12 col-md-10 mx-auto my-auto">
      <div class="card auth-card">
        <div class="position-relative image-side">
          <p class="text-white h2">
            {{ $t('branch.frase') }}
          </p>
          <p class="mb-0">
            Por favor llene los datos para crear una cuenta
            <br>Si ya está registrado puede
            <router-link to="/user/login">
              iniciar sesión
            </router-link>
          </p>
        </div>
        <div class="form-side">
          <router-link v-slot="{ navigate }" to="/" custom>
            <span role="link" class="logo-single" @click="navigate" @keypress.enter="navigate" />
          </router-link>
          <h6 class="mb-4">
            {{ $t('user.register') }}
          </h6>
          <form novalidate @submit.prevent="formSubmit">
            <div class="has-float-label mb-4">
              <label for="register_name" class="form-label">{{ $t('user.fullname') }}</label>
              <div class="input-group has-validation">
                <input
                  id="register_name"
                  v-model="v$.form.fullname.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.form.fullname.$error }"
                >
                <div v-if="v$.form.fullname.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.form.fullname.minLength.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.longitud') }}
                </div>
              </div>
            </div>
            <div class="has-float-label mb-4">
              <label for="register_identification" class="form-label">{{ $t('user.identificacion') }}</label>
              <div class="input-group has-validation">
                <input
                  id="register_identification"
                  v-model="v$.form.identificacion.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.form.identificacion.$error }"
                >
                <div v-if="v$.form.identificacion.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.form.identificacion.minLength.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.longitud') }}
                </div>
              </div>
            </div>
            <div class="has-float-label mb-4">
              <label for="register_email" class="form-label">{{ $t('user.email') }}</label>
              <div class="input-group has-validation">
                <input
                  id="register_email"
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
                  {{ $t('branch.forms.validations.longitug') }}
                </div>
              </div>
            </div>
            <div class="has-float-label mb-4">
              <label for="register_password" class="form-label">{{ $t('user.password') }}</label>
              <div class="input-group has-validation">
                <input
                  id="register_password"
                  v-model="v$.form.password.$model"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': v$.form.password.$error }"
                >
                <div v-if="v$.form.password.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.form.password.minLength.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.longitud') }}
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end align-items-center">
              <button
                class="btn btn-primary btn-lg btn-shadow"
                type="submit"
                variant="primary"
              >
                {{ $t('user.register-button') }}
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
    async formSubmit() {

      const isFormCorrect = await this.v$.$validate()

      if (!isFormCorrect) return

      this.register({
        firstName: this.form.fullname,
        identificacion: this.form.identificacion,
        email: this.form.email,
        password: this.form.password
      });
    }
  }
};
</script>
