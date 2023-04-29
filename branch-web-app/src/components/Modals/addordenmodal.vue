<template>
  <v-modal
    id="modalAddOrden"
    ref="modalAddOrden"
    class="modal-right"
    :title="$t('pages.branch.add-orden-vehicle')"
    :show="open"
    @close="hideModal('modalAddCita')"
  >
    <form novalidate @submit.prevent="onValitadeAddOrden">
      <div class="has-float-label mb-4">
        <label for="select_mechanic" class="form-label">{{ $t('branch.orden.mecanico') }}</label>
        <div class="input-group has-validation">
          <v-select
            v-model="newOrden.mecanico"
            :options="mecanicos"
            label="fullName"
            :reduce="mecanico => mecanico.IdMecanico"
            class="w-100"
            :class="{ 'is-invalid': v$.newOrden.mecanico.$error }"
          >
            <template #search="{attributes, events}">
              <input
                v-bind="attributes"
                class="vs__search"
                :required="!newOrden.mecanico"
                v-on="events"
              >
            </template>
            <template #option="option">
              {{ option.fullName }} - {{ option.identificacion }}
            </template>
          </v-select>
          <div v-if="v$.newOrden.mecanico.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
        </div>
      </div>
      <div class="has-float-label mb-4">
        <label for="vehicle_kilometers" class="form-label">{{ $t('branch.orden.kilometraje') }}</label>
        <div class="input-group has-validation">
          <input
            id="vehicle_kilometers"
            v-model="v$.newOrden.kilometraje.$model"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.newOrden.kilometraje.$error }"
          >
          <div v-if="v$.newOrden.kilometraje.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
        </div>
      </div>
      <div>
        <div class="form-check form-check-inline">
          <input
            id="inlineCheckbox1" v-model="newOrden.documentos" class="form-check-input" type="checkbox"
            value="soat"
          >
          <label class="form-check-label" for="inlineCheckbox1">SOAT</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            id="inlineCheckbox1" v-model="newOrden.documentos" class="form-check-input" type="checkbox"
            value="tecno"
          >
          <label class="form-check-label" for="inlineCheckbox1">Tecno</label>
        </div>
      </div>
      <div class="has-float-label mb-4">
        <label for="vehicle_kilometers" class="form-label">{{ $t('branch.orden.observaciones') }}</label>
        <div class="input-group has-validation">
          <textarea v-model.trim="newOrden.observacion" class="form-control" />
        </div>
      </div>  
      <button
        class="btn btn-outline-secondary"
        @click="hideModal('modalAddOrden')"
      >
        {{ $t('pages.cancel') }}
      </button>
      <button class="btn btn-primary" type="submit">
        {{ $t('forms.submit') }}
      </button>
    </form>
  </v-modal>
</template>

<script>
import { mapGetters } from "vuex";
import { useVuelidate } from '@vuelidate/core'
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { required } from "@vuelidate/validators";
import ServicesCore from "../../services/service";
import Modal from "./SharedModal.vue";

export default {
  name: 'add-order-modal',
  components: {
    "v-select": vSelect,
    "v-modal": Modal,
  },
  props: ["cita", "open"],
  setup: () => ({ v$: useVuelidate() }),
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
      },
      mecanico: {
        required
      }
    }
  },
  computed: {
    ...mapGetters({
      mecanicos: "workshopMechanics",
      workshopInfo: "workshopInfo"
    }),
    state() {
      return this.newOrden.documentos.length >= 1;
    }
  },
  methods: {
    hideModal(refname) {
      if(this.$refs[refname] && this.$refs[refname].open){
        console.log('Hidding');
        this.$refs[refname].hide();
      }
      this.$emit('close')
    },
    async onValitadeAddOrden() {
      const isFormCorrect = await this.v$.$validate()

      if (!isFormCorrect) return

      if (this.cita) {
        let myJsonDocumentos = JSON.stringify(this.newOrden.documentos);
        let orden = {
          IdCita: this.cita.id,
          kilometraje: this.newOrden.kilometraje,
          IdMecanico: this.newOrden.mecanico,
          documentosDeja: myJsonDocumentos,
          IdTaller: this.workshopInfo.IdTaller,
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
              this.$notify({
                title: "ERROR",
                type: "error",
                duration: 3000,
                permanent: false,
                text: error.response.data.error
              });
            } else {
              this.$notify({
                title: "ERROR",
                type: "error",
                duration: 3000,
                permanent: false,
                text: error.message
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
