<template>
  <b-card>
    <b-row>
      <b-colxx md="6" sm="6" lg="4" xxs="12">
        <h5 class="mb-1 card-subtitle truncate">{{ data.CodigoOrden }}</h5>
        <p class="text-muted text-small mb-2">{{ $t("branch.orden.codigoOrden") }}</p>
      </b-colxx>
      <b-colxx md="6" sm="6" lg="2" xxs="4">
        <h5 class="mb-1 card-subtitle truncate">{{ data.vehiculo.placa }}</h5>
        <p class="text-muted text-small mb-2">{{ $t("branch.orden.placa") }}</p>
      </b-colxx>
      <b-colxx md="6" sm="6" lg="2" xxs="4">
        <h5 class="mb-1 card-subtitle truncate">{{ data.vehiculo.marca.marca }}</h5>
        <p class="text-muted text-small mb-2">{{ $t("branch.orden.marca") }}</p>
      </b-colxx>
      <b-colxx md="6" sm="6" lg="2" xxs="4">
        <h5 class="mb-1 card-subtitle truncate">{{ data.vehiculo.usuario.firstName }}</h5>
        <p class="text-muted text-small mb-2">{{ $t("branch.vehiculo.dueno") }}</p>
      </b-colxx>
      <b-colxx md="6" sm="6" lg="2" xxs="4">
        <b-button
          @click="openChat"
          variant="primary"
          class="top-right-button"
          size="xs"
          :aria-controls="`sidebar${data.CodigoOrden}`"
          :aria-expanded="showModal"
        >
          <!-- <i class="iconsminds-speach-bubble-8"></i> -->
          {{ $t("chat.send") }}
          <b-badge variant="light" v-if="newmessages > 0">{{ newmessages }}</b-badge>
        </b-button>
        <b-modal :id="`sidebar${data.CodigoOrden}`" right shadow v-model="showModal" no-header>
          <modal-open-chat :conversacion="infoconversacion" @hide="openChat"></modal-open-chat>
        </b-modal>
      </b-colxx>
    </b-row>
    <b-row v-if="showQualify" class="rating-container">
      <h6>Por favor califica al cliente de este servicio</h6>
      <b-form-rating
        id="rating-sm-no-border"
        v-model="qualyfyCita"
        size="sm"
        show-value
        @change="qualifyClient"
        :readonly="readOnlyQualify"
      ></b-form-rating>
    </b-row>
    <horizontal-stepper
      locale="es"
      :keep-alive="false"
      :steps="demoSteps"
      @completed-step="completeStep"
      @active-step="isStepActive"
      @stepper-finished="alert"
    ></horizontal-stepper>
  </b-card>
</template>
<script>
import { mapGetters } from "vuex";
import HorizontalStepper from "./../Steps/Steeper";
import ThumbnailImage from "./ThumbnailImage";
import Ingreso from "./../Steps/Ingreso";
import Diagnostico from "./../Steps/Diagnostico";
import Cotizacion from "./../Steps/Cotizacion";
import Aprobacion from "./../Steps/Aprobacion";
import Reparacion from "./../Steps/Reparacion";
import Entrega from "./../Steps/Entrega";
import ModalOpenChat from "../Modals/chatmodal";
import ServicesCore from "./../../services/service";

export default {
  props: ["link", "data", "mecanicos"],
  components: {
    ThumbnailImage,
    HorizontalStepper,
    "modal-open-chat": ModalOpenChat
  },
  data() {
    return {
      demoSteps: [],
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
  methods: {
    openChat() {
      this.showModal = !this.showModal;
      this.newmessages = 0;
      //this.$bvModal.show("modalChat_" + this.data.CodigoOrden);
    },
    // Executed when @completed-step event is triggered
    completeStep(payload) {
      if (payload.index) {
        this.demoSteps.forEach(step => {
          if (step.name === payload.name) {
            step.completed = true;
          }
        });
      }
    },
    // Executed when @active-step event is triggered
    isStepActive(payload) {
      this.demoSteps.forEach(step => {
        //console.debug('Valid steps :::>',step);
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = true;
          }
        }
      });
    },
    // Executed when @stepper-finished event is triggered
    alert(payload) {
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
          this.$notify("error filled", "ERROR", "Error al actualizar cita", {
            duration: 3000,
            permanent: false
          });
        });
    }
  },
  mounted() {
    this.sockets.listener.subscribe("sendmessage", newmessage => {
      if (newmessage.cita == this.data.IdCita) {
        if (!this.showModal) {
          this.newmessages += 1;
        }
      }
    });

    this.infoconversacion = {
      IdTaller: this.data.IdTaller,
      nombreTaller: this.data.taller.nombre,
      usuario: this.data.vehiculo.usuario,
      IdConversacionUser: this.data.vehiculo.IdUsuario,
      IdCita: this.data.IdCita,
      CodigoOrden: this.data.CodigoOrden,
      IdOrdenTrabajo: this.data.IdOrdenTrabajo,
      IdEtapa: this.data.IdEtapa
    };
    this.renderModal = true;
  },
  created() {
    var idxIngreso = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 2) {
        return true;
      }
    });

    let etapaIngreso = idxIngreso > -1 ? this.data.etapas[idxIngreso] : null;

    this.demoSteps.push({
      icon: "info",
      name: "ingreso",
      title: "Ingreso",
      component: Ingreso,
      data: this.data.etapas[idxIngreso],
      completed: idxIngreso > -1
    });

    let idxDiagnostico = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 3) {
        return true;
      }
    });

    let etapaDiagnostico =
      idxDiagnostico > -1 ? this.data.etapas[idxDiagnostico] : null;

    let dataDiagnostico = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaDiagnostico,
      mecanicos: this.mecanicos
    };

    this.demoSteps.push({
      icon: "help",
      name: "diagnstico",
      title: "Diagn??stico",
      component: Diagnostico,
      data: dataDiagnostico,
      completed: idxDiagnostico > -1
    });

    let idxCotizacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 4) {
        return true;
      }
    });

    let etapaCotizacion =
      idxDiagnostico > -1 ? this.data.etapas[idxCotizacion] : null;

    let olderCotizaciones =
      idxDiagnostico > -1 ? this.data.olderCotizaciones : null;

    let dataCotizacion = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaCotizacion,
      mecanicos: this.mecanicos,
      olderCotizaciones: olderCotizaciones
    };

    this.demoSteps.push({
      icon: "help",
      name: "cotizacion",
      title: "Cotizaci??n",
      component: Cotizacion,
      data: dataCotizacion,
      completed: idxCotizacion > -1
    });

    let idxAprobacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 5) {
        return true;
      }
    });

    let etapaAprobacion =
      idxAprobacion > -1 ? this.data.etapas[idxAprobacion] : null;

    let dataAprobacion = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaAprobacion,
      mecanicos: this.mecanicos
    };

    this.demoSteps.push({
      icon: "report_problem",
      name: "aprobacion",
      title: "Aprobaci??n",
      component: Aprobacion,
      data: dataAprobacion,
      completed: idxAprobacion > -1
    });

    let idxReparacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 6) {
        return true;
      }
    });

    let etapaReparacion =
      idxReparacion > -1 ? this.data.etapas[idxReparacion] : null;

    let dataReparacion = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaReparacion,
      mecanicos: this.mecanicos
    };

    this.demoSteps.push({
      icon: "report_problem",
      name: "reparacion",
      title: "Reparaci??n",
      component: Reparacion,
      data: dataReparacion,
      completed: idxReparacion > -1
    });

    let idxEntrega = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 7) {
        return true;
      }
    });

    let etapaEntrega = idxEntrega > -1 ? this.data.etapas[idxEntrega] : null;

    let dataEntrega = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaEntrega,
      mecanicos: this.mecanicos
    };

    this.demoSteps.push({
      icon: "report_problem",
      name: "entrega",
      title: "Entrega",
      component: Entrega,
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
  }
};
</script>
