<template>
<b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
        <b-card class="auth-card" no-body>
            <div class="position-relative image-side">
                <p class="h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
                <p class="mb-0">
                    {{ $t('user.text-credentials')}}
                    <br />{{$t('user.text-nomember')}}, 
                    <router-link tag="a" to="/user/register" class="">crear mi cuenta</router-link>.
                </p>
            </div>
            <div class="form-side">
                <router-link tag="a" to="/">
                    <span class="logo-single" />
                </router-link>
                <h6 class="mb-4">{{ $t('user.login-title')}}</h6>

                <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                    <b-form-group :label="$t('user.password')" class="has-float-label mb-4">
                        <b-form-input type="password" v-model="$v.form.password.$model" :state="!$v.form.password.$error" />
                        <b-form-invalid-feedback v-if="!$v.form.password.required">Ingrese la nueva contraseña</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.form.password.minLength || !$v.form.password.maxLength">Su contraseña debe tener entre 4 y 16 caracteres</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group :label="$t('user.password-again')" class="has-float-label mb-4">
                        <b-form-input type="password" v-model="$v.form.passwordAgain.$model" :state="!$v.form.passwordAgain.$error" />
                        <b-form-invalid-feedback v-if="!$v.form.passwordAgain.required">verifique su nueva contraseña</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.form.passwordAgain.sameAsPassword">Las contraseñas no coinciden</b-form-invalid-feedback>

                    </b-form-group>

                    <div class="d-flex justify-content-between align-items-center">
                        <router-link tag="a" to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link>
                        <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                    'show-spinner': processing,
                    'show-success': !processing && loginError===false,
                    'show-fail': !processing && loginError }">
                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                            <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                            <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
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
import {
    mapGetters,
    mapActions
} from "vuex";
import {
    validationMixin
} from "vuelidate";
const {
    required,
    maxLength,
    minLength,
    email,
    sameAs
} = require("vuelidate/lib/validators");

export default {
    data() {
        return {
            form: {
                password: "",
                passwordAgain: ""
            },
        };
    },
    mixins: [validationMixin],
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
    methods: {
        ...mapActions(["resetPassword"]),
        formSubmit() {
            this.$v.form.$touch();
            if (!this.$v.form.$anyError) {
                this.resetPassword({
                    newPassword: this.form.password,
                    resetPasswordCode: this.$route.query.oobCode || ""
                });
            }
        }
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
    }
};
</script>
