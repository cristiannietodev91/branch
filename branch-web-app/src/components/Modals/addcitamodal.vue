<template>
  <v-modal
    id="modalAddCita"
    ref="modalAddCita"
    class="modal-right"
    :title="newCita.IdCita ? $t('pages.branch.title-edit-cita') : $t('pages.branch.add-new-cita')"
    :show="open"
    @close="hideModal('modalAddCita')"
  >
    <form novalidate @submit.prevent="onValitadeAddCita">
      <div class="has-float-label mb-4">
        <label for="vehicle_plate" class="form-label">{{ $t('branch.cita.placa') }}</label>
        <div class="input-group has-validation">
          <input
            id="vehicle_plate"
            v-model="v$.newCita.placa.$model"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.newCita.placa.$error }"
            :readonly="newCita.IdCita ? true : false"
          >
          <div v-if="v$.newCita.placa.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
        </div>
      </div>
            
      <div class="has-float-label mb-4">
        <label for="appointment_date" class="form-label">{{ $t('branch.cita.fechaCita') }}</label>
        <div class="input-group has-validation">
          <input
            id="appointment_date"
            v-model="v$.newCita.fechaCita.$model"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': v$.newCita.fechaCita.$error }"
          >
          <div v-if="v$.newCita.fechaCita.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
        </div>
      </div>
      <div class="has-float-label mb-4">
        <label for="appointment_time" class="form-label">{{ $t('branch.cita.horacita') }}</label>
        <div class="input-group has-validation">
          <input 
            id="appointment_time"
            v-model="v$.newCita.horaCita.$model"
            type="time"
            class="form-control"
            :class="{ 'is-invalid': v$.newCita.horaCita.$error }"
          >
          <div v-if="v$.newCita.horaCita.required.$invalid" class="invalid-feedback">
            {{ $t('branch.forms.validations.required') }}
          </div>
        </div>
      </div>
      <div class="has-float-label mb-4">
        <label for="appointment_mechanic" class="form-label">{{ $t('branch.cita.mecanico') }}</label>
        <v-select
          v-model="newCita.mecanico"
          :options="mecanicos"
          label="fullName"
          :reduce="mecanico => mecanico.IdMecanico"
        >
          <template #option="option">
            {{ option.fullName }} - {{ option.identificacion }}
          </template>
        </v-select>
      </div>
      <div class="has-float-label mb-4">
        <label for="appointment_service" class="form-label">{{ $t('branch.cita.servicio') }}</label>
        <v-select v-model="newCita.servicio" :options="servicios">
          <template #search="{attributes, events}">
            <input
              v-bind="attributes"
              class="vs__search"
              :required="!newCita.servicio"
              v-on="events"
            >
          </template>
        </v-select>
      </div>    
      <div v-if="newCita.IdCita" class="has-float-label mb-4">
        <label for="appointment_state" class="form-label">{{ $t('branch.cita.estado') }}</label>
        <v-select v-model="newCita.estado" :options="estados" :reduce="estado => estado.key">
          <template #search="{attributes, events}">
            <input v-bind="attributes" class="vs__search" :required="!newCita.estado" v-on="events">
          </template>
        </v-select>
      </div>
      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="hideModal('modalAddCita')"
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
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { useVuelidate } from '@vuelidate/core'
import { required } from "@vuelidate/validators";
import ServicesCore from "../../services/service";
import Modal from "./SharedModal.vue";
import moment from "moment";

const initialAppointmentState = {
  placa: null,
  mecanico: null,
  fechaCita: null,
  horaCita: null,
  servicio: null,
  estado: null
}

export default {
  name: 'add-cita-modal',
  components: {
    "v-select": vSelect,
    "v-modal": Modal,
  },
  props: ["cita", "open"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      newCita: {
        placa: null,
        mecanico: null,
        fechaCita: null,
        horaCita: null,
        servicio: null,
        estado: null
      },
      estados: [
        { key: "cancelada", label: "Cancelada" },
        { key: "confirmada", label: "Confirmada" },
        { key: "incumplida", label: "Incumplida" }
      ],
      servicios: [
        { key: "prev 500 km", label: "Mantenimiento preventivo 500 KM" },
        { key: "prev 1000 km", label: "Mantenimiento preventivo 1000 KM" },
        { key: "prev 5000 km", label: "Mantenimiento preventivo 5000 KM" },
        { key: "prev 10000 km", label: "Mantenimiento preventivo 10000 KM" },
        { key: "prev 15000 km", label: "Mantenimiento preventivo 15000 KM" },
        { key: "prev 20000 km", label: "Mantenimiento preventivo 20000 KM" },
        {
          key: "prev mayor 2000 km",
          label: "Mantenimiento preventivo mas de 20000 KM"
        },
        { key: "reparacion", label: "Reparacion" },
        { key: "peritaje", label: "Peritaje" },
        { key: "instainsumos", label: "Instalacion insumos" },
        { key: "alistamientoviaje", label: "Alistamiento viaje" }
      ]
    };
  },
  validations: {
    newCita: {
      placa: {
        required
      },
      fechaCita: {
        required
      },
      horaCita: {
        required
      }
    }
  },
  computed: {
    ...mapGetters({
      mecanicos: "workshopMechanics",
      workshopInfo: "workshopInfo"
    })
  },
  watch: {
    cita: {
      handler(cita) {
        if (cita.vehiculo) {
            this.newCita.placa = cita.vehiculo.placa;
            this.newCita.IdCita = cita.IdCita;
            this.newCita.mecanico = cita.IdMecanico;
            this.newCita.fechaCita = moment(cita.fechaCita).format("YYYY-MM-DD");
            this.newCita.horaCita = cita.horaCita;
            this.newCita.servicio = cita.servicio;
            this.newCita.estado = cita.estado;
        }
      },
    },
  },
  methods: {
    hideModal(refname) {
      if(this.$refs[refname] && this.$refs[refname].open){
        this.$refs[refname].hide();
      }
      this.newCita = {
        ...initialAppointmentState
      };
      this.$emit('close')
    },
    async onValitadeAddCita() {
      const isFormCorrect = await this.v$.$validate()

      if (!isFormCorrect) return

      const citaCreate = {
        IdCita: this.newCita.IdCita,
        placa: this.newCita.placa,
        mecanico: this.newCita.mecanico,
        fechaCita: moment(this.newCita.fechaCita).format("YYYY/MM/DD"),
        taller: this.workshopInfo.IdTaller,
        horaCita: this.newCita.horaCita,
        servicio: this.newCita.servicio.label,
        estado: this.newCita.estado ? this.newCita.estado : "Confirmada"
      };

      if (!this.newCita.IdCita) {
        ServicesCore.createCita(citaCreate)
          .then(response => {
            if (response.status == 200) {
              //this.loadItems();
              this.hideModal("modalAddCita");

              this.$emit("loadcitastalleres");
              //this.loadTalleres();

              this.$notify(
                "success",
                "Resultado",
                "Se creo la cita correctamente",
                {
                  duration: 3000,
                  permanent: false
                }
              );
            } else {
              this.hideModal("modalAddCita");
              this.$notify({
                title: "ERROR",
                type: "error",
                duration: 3000,
                permanent: false,
                text: 'Error creating appointment'
              });
            }
          })
          .catch(error => {
            //this.hideModal("modalAddCita");
            //console.error("Error al crear cita :::>",error);
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
      } else {
        ServicesCore.updateCita(citaCreate)
          .then(response => {
            if (response.status == 202) {
              this.hideModal("modalAddCita");

              this.$emit("loadcitastalleres");

              this.$notify(
                "success",
                "Resultado",
                "Se actualizo la cita correctamente",
                {
                  duration: 3000,
                  permanent: false
                }
              );
            } else {
              this.hideModal("modalAddCita");
              this.$notify({
                title: "ERROR",
                type: "error",
                duration: 3000,
                permanent: false,
                text: "Error updating appointment"
              });
            }
          })
          .catch(error => {
            //this.hideModal("modalAddCita");
            console.error("Error al crear cita :::>", error);
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
