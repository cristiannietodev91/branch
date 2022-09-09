<template>
  <b-modal
    id="modalAddMecanico"
    ref="modalAddMecanico"
    :title="$t('pages.branch.add-new-mecanico')"
    modal-class="modal-right"
    hide-footer
  >
    <b-form @submit.prevent="onValitadeFormSubmit">
      <b-form-group :label="$t('branch.mecanico.identificacion')">
        <b-form-input
          v-model="$v.newMecanico.identificacion.$model"
          :state="!$v.newMecanico.identificacion.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.newMecanico.identificacion.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else-if="!$v.newMecanico.identificacion.numeric || !$v.newMecanico.identificacion.numeric"
        >{{$t('branch.forms.validations.numeric')}}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else-if="!$v.newMecanico.identificacion.minLength || !$v.newMecanico.identificacion.maxLength"
        >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.mecanico.firstName')">
        <b-form-input
          v-model="$v.newMecanico.firstName.$model"
          :state="!$v.newMecanico.firstName.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.newMecanico.firstName.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.mecanico.lastName')">
        <b-form-input
          v-model="$v.newMecanico.lastName.$model"
          :state="!$v.newMecanico.lastName.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.newMecanico.lastName.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.mecanico.skills')">
        <input-tag
          v-model="newMecanico.skills"
          :placeholder="$t('form-components.tags')"
          :limit="4"
        ></input-tag>
      </b-form-group>
      <b-button
        variant="outline-secondary"
        @click.once="hideModal('modalAddMecanico')"
      >{{ $t('pages.cancel') }}</b-button>
      <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
    </b-form>
  </b-modal>
</template>

<script>
import InputTag from "../../components/Form/InputTag";
import { required, numeric } from "vuelidate/lib/validators";
import ServicesCore from "../../services/service";

export default {
  props: ["IdTaller", "mecanicoSelected", "visible"],
  components: {
    "input-tag": InputTag
  },
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
      { immediate: true }
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
      this.$v.$touch();

      // if its still pending or an error is returned do not submit
      if (this.$v.newMecanico.$pending || this.$v.newMecanico.$error) return;

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
