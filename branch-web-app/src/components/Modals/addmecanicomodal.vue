<template>
  <div
    id="modalAddMecanico"
    class="modal modal-right"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          {{ $t('pages.branch.add-new-mecanico') }}
        </div>
        <div class="modal-body">
          <form novalidate @submit.prevent="onValitadeFormSubmit">
            <div>
              <label for="mechanic_id" class="form-label">{{ $t('branch.mecanico.identificacion') }}</label>
              <div class="input-group has-validation">
                <input
                  id="mechanic_id"
                  v-model="v$.newMecanico.identificacion.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.newMecanico.identificacion.$error }"
                >
                <div v-if="v$.newMecanico.identificacion.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
                <div v-else-if="v$.newMecanico.identificacion.numeric.$invalid || v$.newMecanico.identificacion.numeric.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.numeric') }}
                </div>
                <div
                  v-else-if="v$.newMecanico.identificacion.minLength.$invalid || v$.newMecanico.identificacion.maxLength.$invalid"
                  class="invalid-feedback"
                >
                  {{ $t('branch.forms.validations.longitud') }}
                </div>
              </div>
            </div>
            <div>
              <label for="mechanic_name" class="form-label">{{ $t('branch.mecanico.firstName') }}</label>
              <div class="input-group has-validation">
                <input
                  id="mechanic_name"
                  v-model="v$.newMecanico.firstName.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.newMecanico.firstName.$error }"
                >
                <div v-if="v$.newMecanico.firstName.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
              </div>
            </div>
            <div>
              <label for="mechanic_last_name" class="form-label">{{ $t('branch.mecanico.lastName') }}</label>
              <div class="input-group has-validation">
                <input
                  id="mechanic_last_name"
                  v-model="v$.newMecanico.lastName.$model"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.newMecanico.lastName.$error }"
                >
                <div v-if="v$.newMecanico.lastName.required.$invalid" class="invalid-feedback">
                  {{ $t('branch.forms.validations.required') }}
                </div>
              </div>
            </div>
            <div>
              <label for="mechanic_last_name" class="form-label">{{ $t('branch.mecanico.lastName') }}</label>
              <div class="input-group has-validation">
                <!-- <input-tag
                  :modelValue="newMecanico.skills"
                  :placeholder="$t('form-components.tags')"
                  :limit="4"
                /> -->
              </div>
            </div>
            <button 
              type="button"
              class="btn btn-outline-secondary"
              @click.once="hideModal('modalAddMecanico')"
            >
              {{ $t('pages.cancel') }}
            </button>
            <button class="btn btn-primary" type="submit">
              {{ $t('forms.submit') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, numeric } from "@vuelidate/validators";
import ServicesCore from "../../services/service";

export default {
  name: 'add-mecanico-modal',
  props: ["idTaller", "mecanicoSelected", "visible"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      newMecanico: {
        identificacion: "",
        firstName: "",
        lastName: "",
        skills: []
      }
    };
  },
  validations: {
    newMecanico: {
      identificacion: {
        required,
        numeric
      },
      firstName: {
        required
      },
      lastName: {
        required
      },
      skills: {
        required
      }
    }
  },
  mounted() {
    this.$watch(
      "mecanicoSelected",
      () => {
        if (this.mecanicoSelected && this.mecanicoSelected.IdMecanico) {
          const myskills = JSON.parse(this.mecanicoSelected.skills);

          this.newMecanico = {
            identificacion: this.mecanicoSelected.identificacion,
            firstName: this.mecanicoSelected.firstName,
            lastName: this.mecanicoSelected.lastName,
            skills: myskills
          };
        }
        this.$forceUpdate();
      },
      { immediate: true , deep: true }
    );
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
      this.newMecanico = {
        identificacion: "",
        firstName: "",
        lastName: "",
        skills: []
      };
    },
    onValitadeFormSubmit() {
      this.v$.$touch();

      // if its still pending or an error is returned do not submit
      if (this.v$.newMecanico.$pending || this.v$.newMecanico.$error) return;

      var myJsonString = JSON.stringify(this.newMecanico.skills);
      const mecanico = {
        IdMecanico: this.mecanicoSelected.IdMecanico,
        identificacion: this.newMecanico.identificacion,
        firstName: this.newMecanico.firstName,
        lastName: this.newMecanico.lastName,
        skills: myJsonString,
        taller: this.IdTaller,
        estado: "Activo"
      };

      if (!this.mecanicoSelected.IdMecanico) {
        ServicesCore.createMecanico(mecanico)
          .then(response => {
            if (response.status == 200) {
              //this.loadItems();
              this.hideModal("modalAddMecanico");

              this.$emit("loadInfoTaller");
              this.newMecanico = {
                identificacion: "",
                firstName: "",
                lastName: "",
                skills: []
              };
              this.$notify(
                "success",
                "Resultado",
                "Se creo el mecanico correctamente",
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
      } else {
        ServicesCore.updateMecanico(mecanico)
          .then(response => {
            if (response.status == 202) {
              //this.loadItems();
              this.hideModal("modalAddMecanico");

              this.$emit("loadInfoTaller");
              this.newMecanico = {
                identificacion: "",
                firstName: "",
                lastName: "",
                skills: []
              };
              this.$notify(
                "success",
                "Resultado",
                "Se actualizo el mecanico correctamente",
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
    }
  }
};
</script>

<style>
</style>
