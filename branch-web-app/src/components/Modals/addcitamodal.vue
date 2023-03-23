<template>
  <div
    id="modalAddCita"
    class="modal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          {{ newCita.IdCita ? $t('pages.branch.title-edit-cita') : $t('pages.branch.add-new-cita') }}
        </div>
        <div class="modal-body">
          <form novalidate @submit.prevent="onValitadeAddCita">
            <div class="has-float-label">
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
            
            <div class="has-float-label">
              <label for="appointment_date" class="form-label">{{ $t('branch.cita.fechaCita') }}</label>
              <div class="input-group has-validation">
                <!-- <v-date-picker
                  v-model="newCita.fechaCita"
                  :is-required="true"
                  :min-date="new Date()"
                  mode="single"
                  :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"
                /> -->
              </div>
            </div>
            <div class="has-float-label">
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
            <div class="has-float-label">
              <label for="appointment_mechanic" class="form-label">{{ $t('branch.cita.mecanico') }}</label>
              <v-select
                v-model="newCita.mecanico"
                :options="taller.mecanicos"
                label="fullName"
                :reduce="mecanico => mecanico.IdMecanico"
              >
                <template #option="option">
                  {{ option.fullName }} - {{ option.identificacion }}
                </template>
              </v-select>
            </div>
            <div class="has-float-label">
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
            <div v-if="newCita.IdCita" class="has-float-label">
              <label for="appointment_state" class="form-label">{{ $t('branch.cita.estado') }}</label>
              <v-select v-model="newCita.estado" :options="estados">
                <template #search="{attributes, events}">
                  <input v-bind="attributes" class="vs__search" :required="!newCita.estado" v-on="events">
                </template>
              </v-select>
            </div>
            <div
              class="btn btn-outline-secondary"
              @click="hideModal('modalAddCita')"
            >
              {{ $t('pages.cancel') }}
            </div>
            <div class="btn btn-primary" type="submit">
              {{ $t('forms.submit') }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { useVuelidate } from '@vuelidate/core'
import { required } from "@vuelidate/validators";
import ServicesCore from "../../services/service";

export default {
  name: 'add-cita-modal',
  components: {
    "v-select": vSelect
  },
  props: ["taller", "cita"],
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
  mounted() {
    this.$watch(
      "cita",
      () => {
        if (this.cita.vehiculo) {
          this.newCita.placa = this.cita.vehiculo.placa;
          this.newCita.IdCita = this.cita.IdCita;
          this.newCita.mecanico = this.cita.IdMecanico;
          this.newCita.fechaCita = new Date(this.cita.fechaCita);
          this.newCita.horaCita = this.cita.horaCita;
          this.newCita.servicio = this.cita.servicio;
          this.newCita.estado = this.cita.estado;
        }
        this.$forceUpdate();
      },
      { immediate: true, deep: true }
    );
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
      this.newCita = {
        IdCita: null,
        placa: null,
        mecanico: null,
        fechaCita: null,
        horaCita: null,
        servicio: null,
        estado: null
      };
    },
    onValitadeAddCita() {
      this.v$.$touch();
      // if its still pending or an error is returned do not submit
      if (this.v$.newCita.$pending || this.v$.newCita.$error) return;

      var citaCreate = {
        IdCita: this.newCita.IdCita,
        placa: this.newCita.placa,
        mecanico: this.newCita.mecanico,
        fechaCita: this.$moment(this.newCita.fechaCita).format("DD/MM/YYYY"),
        taller: this.taller.IdTaller,
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
              this.$notify("error filled", "ERROR", "Error al crear cita", {
                duration: 3000,
                permanent: false
              });
            }
          })
          .catch(error => {
            //this.hideModal("modalAddCita");
            //console.error("Error al crear cita :::>",error);
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
        ServicesCore.updateCita(citaCreate)
          .then(response => {
            if (response.status == 202) {
              //this.loadItems();
              this.hideModal("modalAddCita");

              this.$emit("loadcitastalleres");
              //this.loadTalleres();

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
              this.$notify(
                "error filled",
                "ERROR",
                "Error al actualizar cita",
                {
                  duration: 3000,
                  permanent: false
                }
              );
            }
          })
          .catch(error => {
            //this.hideModal("modalAddCita");
            console.error("Error al crear cita :::>", error);
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
