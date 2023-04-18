<template>
  <b-modal
    id="modalAddCita"
    ref="modalAddCita"
    :title="newCita.IdCita ? $t('pages.branch.title-edit-cita') : $t('pages.branch.add-new-cita')"
    modal-class="modal-basic"
    hide-footer
  >
    <b-form @submit.prevent="onValitadeAddCita">
      <b-form-group :label="$t('branch.cita.placa')" class="has-float-label">
        <b-form-input
          v-model="$v.newCita.placa.$model"
          :state="!$v.newCita.placa.$error"
          :readonly="newCita.IdCita ? true : false"
        />
        <b-form-invalid-feedback
          v-if="!$v.newCita.placa.required"
        >
          {{ $t('branch.forms.validations.required') }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.cita.fechaCita')" class="has-float-label">
        <v-date-picker
          v-model="newCita.fechaCita"
          :is-required="true"
          :min-date="new Date()"
          mode="single"
          :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"
        />
      </b-form-group>
      <b-form-group :label="$t('branch.cita.horacita')" class="has-float-label">
        <b-form-input
          id="txtHoraCita"
          v-model="$v.newCita.horaCita.$model"
          :state="!$v.newCita.horaCita.$error"
          type="time"
        />
        <b-form-invalid-feedback
          v-if="!$v.newCita.horaCita.required"
        >
          {{ $t('branch.forms.validations.required') }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('branch.cita.mecanico')" class="has-float-label">
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
      </b-form-group>
      <b-form-group :label="$t('branch.cita.servicio')" class="has-float-label">
        <v-select v-model="newCita.servicio" :options="servicios">
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!newCita.servicio"
              v-bind="attributes"
              v-on="events"
            >
          </template>
        </v-select>
      </b-form-group>
      <b-form-group v-if="newCita.IdCita" :label="$t('branch.cita.estado')" class="has-float-label">
        <v-select v-model="newCita.estado" :options="estados" :reduce="estado => estado.key">
          <template #search="{attributes, events}">
            <input class="vs__search" :required="!newCita.estado" v-bind="attributes" v-on="events">
          </template>
        </v-select>
      </b-form-group>

      <b-button
        variant="outline-secondary"
        @click="hideModal('modalAddCita')"
      >
        {{ $t('pages.cancel') }}
      </b-button>
      <b-button type="submit" variant="primary">
        {{ $t('forms.submit') }}
      </b-button>
    </b-form>
  </b-modal>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { required } from "vuelidate/lib/validators";
import ServicesCore from "../../services/service";

export default {
  name: 'add-cita-modal',
  components: {
    "v-select": vSelect
  },
  props: ["taller", "cita"],
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
          this.newCita.fechaCita = this.$moment(this.cita.fechaCita).toDate();
          this.newCita.horaCita = this.cita.horaCita;
          this.newCita.servicio = this.cita.servicio;
          this.newCita.estado = this.cita.estado;
        }
        this.$forceUpdate();
      },
      { immediate: true }
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
      this.$v.$touch();
      // if its still pending or an error is returned do not submit
      if (this.$v.newCita.$pending || this.$v.newCita.$error) return;

      const citaCreate = {
        IdCita: this.newCita.IdCita,
        placa: this.newCita.placa,
        mecanico: this.newCita.mecanico,
        fechaCita: this.$moment(this.newCita.fechaCita).format("YYYY/MM/DD"),
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
