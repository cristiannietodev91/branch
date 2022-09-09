<template>
  <b-modal
    id="modalAddOrden"
    ref="modalAddOrden"
    :title="$t('pages.branch.add-orden-vehicle')"
    modal-class="modal-basic"
    hide-footer
  >
    <b-form @submit.prevent="onValitadeAddOrden">
      <b-form-group :label="$t('branch.orden.mecanico')">
        <v-select
          :options="taller.mecanicos"
          v-model="newOrden.mecanico"
          label="fullName"
          :reduce="mecanico => mecanico.IdMecanico"
        >
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!newOrden.mecanico"
              v-bind="attributes"
              v-on="events"
            />
          </template>
          <template v-slot:option="option">{{ option.fullName }} - {{option.identificacion}}</template>
        </v-select>
      </b-form-group>
      <b-form-group :label="$t('branch.orden.kilometraje')">
        <b-form-input
          v-model="$v.newOrden.kilometraje.$model"
          :state="!$v.newOrden.kilometraje.$error"
        />
        <b-form-invalid-feedback
          v-if="!$v.newOrden.kilometraje.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.orden.documentos')">
        <b-form-checkbox-group
          id="checkbox-documentos"
          v-model="newOrden.documentos"
          :state="state"
          name="docuementos"
        >
          <b-form-checkbox value="soat">SOAT</b-form-checkbox>
          <b-form-checkbox value="tecnomecanica">Tecnico Mecanica</b-form-checkbox>
        </b-form-checkbox-group>
        <b-form-invalid-feedback :state="state">{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.orden.observaciones')">
        <b-textarea v-model.trim="newOrden.observacion"></b-textarea>
      </b-form-group>
      <b-button
        variant="outline-secondary"
        @click.once="hideModal('modalAddOrden')"
      >{{ $t('pages.cancel') }}</b-button>
      <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
    </b-form>
  </b-modal>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import InputTag from "../../components/Form/InputTag";
import { required } from "vuelidate/lib/validators";
import ServicesCore from "../../services/service";

export default {
  props: ["taller", "cita"],
  components: {
    "input-tag": InputTag,
    "v-select": vSelect
  },
  data() {
    return {
      newOrden: {
        IdCita: null,
        mecanico: null,
        kilometraje: null,
        documentos: [],
        observacion: null
      }
    };
  },
  validations: {
    newOrden: {
      kilometraje: {
        required
      }
    }
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    onValitadeAddOrden() {
      this.$v.$touch();
      // if its still pending or an error is returned do not submit
      if (this.$v.newOrden.$pending || this.$v.newOrden.$error) return;

      if (this.cita) {
        let myJsonDocumentos = JSON.stringify(this.newOrden.documentos);
        let orden = {
          IdCita: this.cita.id,
          kilometraje: this.newOrden.kilometraje,
          IdMecanico: this.newOrden.mecanico,
          documentosDeja: myJsonDocumentos,
          IdTaller: this.taller.IdTaller,
          IdEtapa: 2,
          Observaciones: this.newOrden.observacion,
          estado: "Aceptado"
        };

        ServicesCore.createOrden(orden)
          .then(response => {
            if (response.status == 200) {
              //this.loadItems();
              this.hideModal("modalAddOrden");
              this.newOrden = {
                IdCita: null,
                mecanico: null,
                kilometraje: null,
                documentos: [],
                observacion: null
              };
              this.$emit("loadcitastalleres");
              this.$emit("loadordenestalleres");

              this.$notify(
                "success",
                "Resultado",
                "Se creo la orden de trabajo",
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
  },
  computed: {
    state() {
      return this.newOrden.documentos.length >= 1;
    }
  },
  mounted() {
    this.$watch(
      "cita",
      () => {
        //console.log(`Cita recibida:::>`, this.cita);
        this.$forceUpdate();
      },
      { immediate: true }
    );
  }
};
</script>

<style>
</style>
