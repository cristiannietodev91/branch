<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col col-12 col-lg-4 col-md-6 col-sm-6">
          <h5 class="mb-1 card-subtitle truncate">
            {{ workOrderViewed.CodigoOrden }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t("branch.orden.codigoOrden") }}
          </p>
        </div>
        <div class="col col-4 col-sm-6 col-lg-2 col-md-6">
          <h5 class="mb-1 card-subtitle truncate">
            {{ workOrderViewed.vehiculo.placa }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t("branch.orden.placa") }}
          </p>
        </div>
        <div class="col col-4 col-sm-6 col-md-6 col-lg-2">
          <h5 class="mb-1 card-subtitle truncate">
            {{ workOrderViewed.vehiculo.marca.marca }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t("branch.orden.marca") }}
          </p>
        </div>
        <div class="col col-4 col-sm-6 col-md-6 col-lg-2">
          <h5 class="mb-1 card-subtitle truncate">
            {{ workOrderViewed.vehiculo.usuario.firstName }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t("branch.vehiculo.dueno") }}
          </p>
        </div>
        <div class="col col-4 col-sm-6 col-md-6 col-lg-2">
          <button
            class="btn btn-primary btn-xs top-right-button"
            :aria-controls="`sidebar${workOrderViewed.CodigoOrden}`"
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
          
          <modal-open-chat
            :conversacion="infoconversacion"
            :workorder="workOrderViewed.CodigoOrden"
            :open="showModal"
            @close="showModal = false"
          />
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
import { stages } from "../../utils/constants";
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
  props: {
    workOrderCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      steps: [],
      showModal: false,
      newmessages: 0,
      qualyfyCita: null,
      showQualify: false,
      readOnlyQualify: false,
      infoconversacion: {},
      workOrderViewed: null,
    };
  },
  computed: {
    ...mapGetters([
      "currentUser",
      "workOrdersByOrderCodeAndStages",
      "workshopInfo",
    ]),
    workOrder () {
      return this.$store.getters.workOrdersByOrderCode(this.workOrderCode)
    }
  },
  watch: {
    workOrdersByOrderCodeAndStages() {
      this.buildSteps();
    }
  },
  mounted() {
    /*
    this.sockets.subscribe("sendmessage", newmessage => {
      if (newmessage.cita == this.data.IdCita) {
        if (!this.showModal) {
          this.newmessages += 1;
        }
      }
    });
    */
    
  },
  created() {
    this.buildSteps();
    this.infoconversacion = {
      IdTaller: this.workshopInfo.IdTaller,
      nombreTaller: this.workshopInfo.nombre,
      usuario: this.workOrder.vehiculo?.usuario,
      IdConversacionUser: this.workOrder.vehiculo.IdUsuario,
      IdCita: this.workOrder.IdCita,
      CodigoOrden: this.workOrder.CodigoOrden,
    };

    /*
    if (entrega) {
      this.showQualify = true;
      const { cita } = this.data;
      if (cita.calificacion) {
        this.qualyfyCita = cita.calificacion;
        this.readOnlyQualify = true;
      }
    }
    */
  },
  methods: {
    buildSteps() {

      this.steps = [];

      this.workOrderViewed = this.workOrdersByOrderCodeAndStages[this.workOrderCode];

      const ingreso = this.workOrderViewed.etapas[stages.INGRESO];
      const diagnostico = this.workOrderViewed.etapas[stages.DIAGNOSTICO];
      const cotizacion = this.workOrderViewed.etapas[stages.COTIZACION];
      const aprobacion = this.workOrderViewed.etapas[stages.APROBACION];
      const reparacion = this.workOrderViewed.etapas[stages.REPARACION];
      const entrega = this.workOrderViewed.etapas[stages.ENTREGA];

      this.steps.push({
        icon: "info",
        name: "ingreso",
        title: "Ingreso",
        component: shallowRef(Ingreso),
        data: {
          workOrder: this.workOrderViewed,
          etapa: ingreso,
        },
        completed: ingreso ? true : false
      });
      
      this.steps.push({
        icon: "help",
        name: "diagnstico",
        title: "Diagnóstico",
        component: shallowRef(Diagnostico),
        data: {
          workOrder: this.workOrderViewed,
          etapa: diagnostico,
        },
        completed: diagnostico ? true : false
      });

      this.steps.push({
        icon: "help",
        name: "cotizacion",
        title: "Cotización",
        component: shallowRef(Cotizacion),
        data: {
          workOrder: this.workOrderViewed,
          etapa: cotizacion,
        },
        completed: cotizacion ? true : false,
      });

      this.steps.push({
        icon: "report_problem",
        name: "aprobacion",
        title: "Aprobación",
        component: shallowRef(Aprobacion),
        data: {
          workOrder: this.workOrderViewed,
          etapa: aprobacion,
        },
        completed: aprobacion ? true : false,
      });

      this.steps.push({
        icon: "report_problem",
        name: "reparacion",
        title: "Reparación",
        component: shallowRef(Reparacion),
        data: {
          workOrder: this.workOrderViewed,
          etapa: reparacion,
        },
        completed: reparacion ? true : false,
      });

      this.steps.push({
        icon: "report_problem",
        name: "entrega",
        title: "Entrega",
        component: shallowRef(Entrega),
        data: {
          workOrder: this.workOrderViewed,
          etapa: entrega,
        },
        completed: entrega ? true : false,
      });
    },
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
