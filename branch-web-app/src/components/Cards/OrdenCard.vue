<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col col-12 col-lg-4 col-md-6 col-sm-6">
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.CodigoOrden }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t("branch.orden.codigoOrden") }}
          </p>
        </div>
        <div class="col col-4 col-sm-6 col-lg-2 col-md-6">
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.vehiculo.placa }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t("branch.orden.placa") }}
          </p>
        </div>
        <div class="col col-4 col-sm-6 col-md-6 col-lg-2">
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.vehiculo.marca.marca }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t("branch.orden.marca") }}
          </p>
        </div>
        <div class="col col-4 col-sm-6 col-md-6 col-lg-2">
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.vehiculo.usuario.firstName }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t("branch.vehiculo.dueno") }}
          </p>
        </div>
        <div class="col col-4 col-sm-6 col-md-6 col-lg-2">
          <button
            class="btn btn-primary btn-xs top-right-button"
            :aria-controls="`sidebar${data.CodigoOrden}`"
            @click="openChat"
          >
            <!-- <i class="iconsminds-speach-bubble-8"></i> -->
            {{ $t("chat.send") }}
            <span
              v-if="newmessages > 0"
              class="badge text-bg-light"
            >
              {{ newmessages }}
            </span>
          </button>
          <div
            :id="`sidebar${data.CodigoOrden}`"
            class="modal shadow"
          >
            <modal-open-chat
              :conversacion="infoconversacion"
              @hide="openChat"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showQualify"
      class="row rating-container"
    >
      <h6>Por favor califica al cliente de este servicio</h6>
      <!--
      <b-form-rating
        id="rating-sm-no-border"
        v-model="qualyfyCita"
        size="sm"
        show-value
        :readonly="readOnlyQualify"
        @change="qualifyClient"
      />
      -->
    </div>
    <horizontal-stepper
      locale="es"
      :keep-alive="false"
      :steps="steps"
      @completed-step="completeStep"
      @active-step="isStepActive"
      @stepper-finished="alert"
    />
  </div>
</template>
<script>
import { shallowRef } from 'vue'
import { mapGetters } from "vuex";
import HorizontalStepper from "./../Steps/Steeper";
import Ingreso from "./../Steps/Ingreso";
import Diagnostico from "./../Steps/Diagnostico";
import Cotizacion from "./../Steps/Cotizacion";
import Aprobacion from "./../Steps/Aprobacion";
import Reparacion from "./../Steps/Reparacion";
import Entrega from "./../Steps/Entrega";
import ModalOpenChat from "../Modals/chatmodal";
import ServicesCore from "./../../services/service";

export default {
  components: {
    HorizontalStepper,
    "modal-open-chat": ModalOpenChat
  },
  props: ["link", "data", "mecanicos"],
  data() {
    return {
      steps: [],
      showModal: false,
      newmessages: 0,
      qualyfyCita: null,
      showQualify: false,
      readOnlyQualify: false,
      infoconversacion: {}
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser"
    })
  },
  mounted() {
    this.sockets.subscribe("sendmessage", newmessage => {
      if (newmessage.cita == this.data.IdCita) {
        if (!this.showModal) {
          this.newmessages += 1;
        }
      }
    });

    this.infoconversacion = {
      IdTaller: this.data.IdTaller,
      nombreTaller: this.data.taller.nombre,
      usuario: this.data.vehiculo?.usuario,
      IdConversacionUser: this.data.vehiculo.IdUsuario,
      IdCita: this.data.IdCita,
      CodigoOrden: this.data.CodigoOrden,
      IdOrdenTrabajo: this.data.IdOrdenTrabajo,
      IdEtapa: this.data.IdEtapa
    };
    this.renderModal = true;
  },
  created() {
    const idxIngreso = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 2) {
        return true;
      }
    });

    this.steps.push({
      icon: "info",
      name: "ingreso",
      title: "Ingreso",
      component: shallowRef(Ingreso),
      data: this.data.etapas[idxIngreso],
      completed: idxIngreso > -1
    });

    const idxDiagnostico = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 3) {
        return true;
      }
    });

    const etapaDiagnostico =
      idxDiagnostico > -1 ? this.data.etapas[idxDiagnostico] : null;

    const dataDiagnostico = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaDiagnostico,
      mecanicos: this.mecanicos
    };

    this.steps.push({
      icon: "help",
      name: "diagnstico",
      title: "Diagnóstico",
      component: shallowRef(Diagnostico),
      data: dataDiagnostico,
      completed: idxDiagnostico > -1
    });

    const idxCotizacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 4) {
        return true;
      }
    });

    const etapaCotizacion =
      idxDiagnostico > -1 ? this.data.etapas[idxCotizacion] : null;

    const olderCotizaciones =
      idxDiagnostico > -1 ? this.data.olderCotizaciones : null;

    const dataCotizacion = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaCotizacion,
      mecanicos: this.mecanicos,
      olderCotizaciones: olderCotizaciones
    };

    this.steps.push({
      icon: "help",
      name: "cotizacion",
      title: "Cotización",
      component: shallowRef(Cotizacion),
      data: dataCotizacion,
      completed: idxCotizacion > -1
    });

    const idxAprobacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 5) {
        return true;
      }
    });

    const etapaAprobacion =
      idxAprobacion > -1 ? this.data.etapas[idxAprobacion] : null;

    const dataAprobacion = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaAprobacion,
      mecanicos: this.mecanicos
    };

    this.steps.push({
      icon: "report_problem",
      name: "aprobacion",
      title: "Aprobación",
      component: shallowRef(Aprobacion),
      data: dataAprobacion,
      completed: idxAprobacion > -1
    });

    const idxReparacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 6) {
        return true;
      }
    });

    const etapaReparacion =
      idxReparacion > -1 ? this.data.etapas[idxReparacion] : null;

    const dataReparacion = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaReparacion,
      mecanicos: this.mecanicos
    };

    this.steps.push({
      icon: "report_problem",
      name: "reparacion",
      title: "Reparación",
      component: shallowRef(Reparacion),
      data: dataReparacion,
      completed: idxReparacion > -1
    });

    const idxEntrega = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 7) {
        return true;
      }
    });

    const etapaEntrega = idxEntrega > -1 ? this.data.etapas[idxEntrega] : null;

    const dataEntrega = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaEntrega,
      mecanicos: this.mecanicos
    };

    this.steps.push({
      icon: "report_problem",
      name: "entrega",
      title: "Entrega",
      component: shallowRef(Entrega),
      data: dataEntrega,
      completed: idxEntrega > -1
    });

    if (idxEntrega > -1) {
      this.showQualify = true;
      const { cita } = this.data;
      if (cita.calificacion) {
        this.qualyfyCita = cita.calificacion;
        this.readOnlyQualify = true;
      }
    }
  },
  methods: {
    openChat() {
      this.showModal = !this.showModal;
      this.newmessages = 0;
      //this.$bvModal.show("modalChat_" + this.data.CodigoOrden);
    },
    // Executed when @completed-step event is triggered
    completeStep(payload) {
      if (payload.index) {
        this.steps.forEach(step => {
          if (step.name === payload.name) {
            step.completed = true;
          }
        });
      }
    },
    // Executed when @active-step event is triggered
    isStepActive(payload) {
      this.steps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = true;
          }
        }
      });
    },
    // Executed when @stepper-finished event is triggered
    alert() {
      alert("end");
    },
    qualifyClient(value) {
      const { IdCita } = this.data;

      ServicesCore.calificaCita(IdCita, value)
        .then(response => {
          if (response.status == 202) {
            this.readOnlyQualify = true;
          }
        })
        .catch(error => {
          console.error(
            "Error al actualizar cita para calificarla :::>",
            error
          );
          this.$notify({
            title: "ERROR",
            type: "error",
            duration: 3000,
            permanent: false,
            text: 'Error updating appointment'
          });
        });
    }
  }
};
</script>
