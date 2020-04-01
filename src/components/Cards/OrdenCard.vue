<template>
  <b-card >
    <b-row>
      <b-colxx md="6" sm="6" lg="4" xxs="12">
        <h5 class="mb-1 card-subtitle truncate">{{data.CodigoOrden}}</h5>
        <p class="text-muted text-small mb-2">{{$t('branch.orden.codigoOrden')}}</p>
      </b-colxx>
      <b-colxx md="6" sm="6" lg="2" xxs="4">
        <h5 class="mb-1 card-subtitle truncate">{{data.vehiculo.placa}}</h5>
        <p class="text-muted text-small mb-2">{{$t('branch.orden.placa')}}</p>
      </b-colxx>
      <b-colxx md="6" sm="6" lg="2" xxs="4">
        <h5 class="mb-1 card-subtitle truncate">{{data.vehiculo.marca.marca}}</h5>
        <p class="text-muted text-small mb-2">{{$t('branch.orden.marca')}}</p>
      </b-colxx>
      <!--
      <b-colxx md="6" sm="6" lg="4" xxs="4" class="btn-icon">
        <b-button
            @click="openModal"
            variant="primary"
            size="lg"
            class="top-right-button"
          >
          <i class="iconsminds-speach-bubble-8"></i>
          {{ $t('Enviar mensaje') }}
        </b-button>
          <modal-add-chat :data="data" :currentUser="currentUser"></modal-add-chat>
      </b-colxx>
      -->
    </b-row>
    <horizontal-stepper
      locale="es"
      :keep-alive="false"
      :steps="demoSteps"
      @completed-step="completeStep"
      @active-step="isStepActive"
      @stepper-finished="alert"
    ></horizontal-stepper>
    <!--
        <div class="min-width-zero">
          <router-link :to="link || '#'">
            <b-card-sub-title class="truncate mb-1">{{data.CodigoOrden}}</b-card-sub-title>
          </router-link>
          <b-card-text class="text-muted text-small mb-2">{{data.kilometraje}}</b-card-text>
          <b-card-text class="text-muted text-small mb-2">{{data.vehiculo.tipoVehiculo}}</b-card-text>
          <b-card-text class="text-muted text-small mb-2">{{data.vehiculo.marca.marca}}</b-card-text>
          <b-card-text class="text-muted text-small mb-2">{{data.vehiculo.color}}</b-card-text>
          <b-card-text class="text-muted text-small mb-2">{{data.vehiculo.placa}}</b-card-text>
          <b-card-text class="text-muted text-small mb-2">{{data.vehiculo.modelo}}</b-card-text>
          <b-card-text class="text-muted text-small mb-2">{{data.etapa.NombreEtapa}}</b-card-text>
          <b-card-text class="text-muted text-small mb-2">{{data.createdAt}}</b-card-text>
        </div>
    -->
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


export default {
  props: ["link", "data", "mecanicos"],
  components: {
    ThumbnailImage,
    HorizontalStepper
  },
  data() {
    return {
      demoSteps: []      
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser"
    })
  },
  methods: {
    openModal(){
      this.$bvModal.show("ModalChat"+data.codigoOrden);
    },
    // Executed when @completed-step event is triggered
    completeStep(payload) {
      if (payload.index) {
        //console.debug("Valid complete step :::>", payload);
        this.demoSteps.forEach(step => {
          //console.debug("Valid steps :::>", step);
          if (step.name === payload.name) {
            step.completed = true;
          }
        });
      }
    },
    // Executed when @active-step event is triggered
    isStepActive(payload) {
      //console.debug('Valid if step is active :::>',payload);
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
    }
  },
  created() {

    var idxIngreso = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 2) {
        return true;
      }
    });

    console.log("Indice Ingreso :::>", idxIngreso);

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

    console.log("Indice Diagnostico :::>", idxDiagnostico);

    let etapaDiagnostico = idxDiagnostico > -1 ? this.data.etapas[idxDiagnostico] : null;

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
      title: "Diagnóstico",
      component: Diagnostico,
      data: dataDiagnostico,
      completed: idxDiagnostico > -1
    });

    let idxCotizacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 4) {
        return true;
      }
    });

    console.log("Indice Cotizacion :::>", idxCotizacion);

    let etapaCotizacion =
      idxDiagnostico > -1 ? this.data.etapas[idxCotizacion] : null;

    let dataCotizacion = {
      IdCita: this.data.IdCita,
      IdTaller: this.data.IdTaller,
      CodigoOrden: this.data.CodigoOrden,
      IdVehiculo: this.data.IdVehiculo,
      kilometraje: this.data.kilometraje,
      etapa: etapaCotizacion,
      mecanicos: this.mecanicos
    };

    this.demoSteps.push({
      icon: "help",
      name: "cotizacion",
      title: "Cotización",
      component: Cotizacion,
      data: dataCotizacion,
      completed: idxCotizacion > -1
    });

    let idxAprobacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 5) {
        return true;
      }
    });

    console.log("Indice Aprobacion :::>", idxAprobacion);

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
      title: "Aprobación",
      component: Aprobacion,
      data: dataAprobacion,
      completed: idxAprobacion > -1
    });

    let idxReparacion = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 6) {
        return true;
      }
    });

    console.log("Indice Reparacion :::>", idxReparacion);

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
      title: "Reparación",
      component: Reparacion,
      data: dataReparacion,
      completed: idxReparacion > -1
    });

    let idxEntrega = this.data.etapas.findIndex(element => {
      if (element.IdEtapa == 7) {
        return true;
      }
    });

    console.log("Indice Entrega :::>", idxEntrega);

    let etapaEntrega =
      idxEntrega > -1 ? this.data.etapas[idxEntrega] : null;

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


  }
};
</script>
