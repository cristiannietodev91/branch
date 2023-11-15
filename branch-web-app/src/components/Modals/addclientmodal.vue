<template>
  <v-modal
    id="modalAddClient" ref="modalAddClient" :title="$t('pages.branch.add-new-vehiculo')" :show="open"
    @close="hideModal('modalAddClient')"
  >
    <form novalidate class="av-tooltip" @submit.prevent="onValitadeFormSubmit">
      <div>
        <label for="vehicle_plate" class="form-label">{{ $t('branch.vehiculo.placa') }}</label>
        <div class="input-group has-validation">
          <input
            id="vehicle_plate" v-model="v$.newItem.placa.$model" type="text" class="form-control"
            :class="{ 'is-invalid': v$.newItem.placa.$error }"
          >
          <div v-if="v$.newItem.placa.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
          <div v-else-if="v$.newItem.placa.placaValidate.$invalid" class="invalid-feedback">
            {{ $t("branch.forms.validations.formatPlaca") }}
          </div>
        </div>
      </div>
      <div>
        <label for="client_phone" class="form-label">{{ $t('branch.vehiculo.celular') }}</label>
        <div class="input-group has-validation">
          <input
            id="client_phone" v-model="v$.newItem.celular.$model" type="text" class="form-control"
            :class="{ 'is-invalid': v$.newItem.celular.$error }"
          >
          <div v-if="v$.newItem.celular.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
          <div v-else-if="v$.newItem.celular.numeric.$invalid" class="invalid-feedback">
            {{ $t("branch.forms.validations.formatPlaca") }}
          </div>
          <div
            v-else-if="v$.newItem.celular.minLength.$invalid || v$.newItem.celular.maxLength.$invalid"
            class="invalid-feedback"
          >
            {{ $t("branch.forms.validations.longitud") }}
          </div>
        </div>
      </div>
      <div>
        <label for="client_email" class="form-label">{{ $t('branch.vehiculo.email') }}</label>
        <div class="input-group has-validation">
          <input
            id="client_email" v-model="v$.newItem.email.$model" type="text" class="form-control"
            :class="{ 'is-invalid': v$.newItem.email.$error }"
          >
          <div v-if="v$.newItem.email.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
          <div v-if="v$.newItem.email.email.$invalid" class="invalid-feedback">
            {{ $t("branch.forms.validations.email") }}
          </div>
        </div>
      </div>
      <button class="btn btn-outline-secondary" type="button" @click="hideModal('modalAddClient')">
        {{ $t("pages.cancel") }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{
          $t("forms.submit")
        }}
      </button>
    </form>
  </v-modal>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { mapGetters } from "vuex";
import Modal from "./SharedModal.vue";
import {
    required,
    requiredIf,
    minLength,
    maxLength,
    email,
    helpers,
    numeric,
} from "@vuelidate/validators";
import ServicesCore from "../../services/service";

const placaValidate = helpers.regex(
    /^[a-zA-Z]{3}[0-9]{2}[a-zA-Z0-9]$/
);

const initialClientState = {
    placa: "",
    celular: "",
    email: "",
}

export default {
    name: 'add-client-modal',
    components: {
        "v-modal": Modal,
    },
    props: {
        open: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['loadClients', 'close'],
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            newItem: {
                placa: "",
                celular: "",
                email: "",
            },
        }
    },
    computed: {
        ...mapGetters(["currentUser", "messages"])
    },
    validations: {
        newItem: {
            placa: {
                required,
                placaValidate,
            },
            celular: {
                required: requiredIf(function () {
                    return !this.newItem.email;
                }),
                numeric,
                maxLength: maxLength(10),
                minLength: minLength(10),
            },
            email: {
                required,
                email,
            },
        },
    },
    methods: {
        hideModal(refname) {
            if (this.$refs[refname] && this.$refs[refname].open) {
                this.$refs[refname].hide();
            }
            this.$emit('close')
            this.newItem = {
                ...initialClientState
            }
        },
        async onValitadeFormSubmit() {
            const isFormCorrect = await this.v$.$validate();

            if (!isFormCorrect) return

            const vehiculo = {
                placa: this.newItem.placa,
                celular: this.newItem.celular,
                usuario: { email: this.newItem.email },
                IdTaller: this.currentUser.IdTaller,
            };

            ServicesCore.createVehiculo(vehiculo)
                .then((response) => {
                    if (response.status == 200) {
                        this.newItem = {
                            placa: "",
                            celular: "",
                            email: "",
                        };
                        this.$notify(
                            "success",
                            "Resultado",
                            "Se creo el vehiculo correctamente",
                            {
                                duration: 3000,
                                permanent: false,
                            }
                        );
                        this.$emit("loadClients");
                    } else {
                        this.$notify({
                            title: "ERROR",
                            type: "error",
                            duration: 3000,
                            permanent: false,
                            text: 'Error creating client.'
                        });
                    }
                })
                .catch((error) => {
                    console.log("Error al registrar cliente :::>", error);
                    this.$notify({
                        title: "ERROR",
                        type: "error",
                        duration: 3000,
                        permanent: false,
                        text: error.message
                    });
                }).finally(() => {
                    this.hideModal("modalAddClient");
                });
        },
    }
}
</script>