<template>
  <b-row>
    <b-colxx xl="12" lg="12" class="mb-4">
      <b-card :title="$t('dashboards.calendar')">
        <modal-add-cita :taller="taller" :cita="cita" @loadcitastalleres="loadCitasTaller"></modal-add-cita>
        <modal-add-orden :taller="taller" :cita="cita" @loadcitastalleres="loadCitasTaller"></modal-add-orden>
        <calendar-view
          :is-expanded="true"
          class="theme-default holiday-us-traditional holiday-us-official"
          style="min-height:500px"
          :events="calendar.events"
          :show-date="calendar.showDate"
          :time-format-options="{hour: 'numeric', minute:'2-digit'}"
          :enable-drag-drop="false"
          :show-event-times="true"
          display-period-uom="week"
          :starting-day-of-week="1"
          current-period-label="Today"
          @drop-on-date="onDropDate"
          @click-date="onClickDay"
        >
          <calendar-view-header
            slot="header"
            slot-scope="t"
            :header-props="t.headerProps"
            @input="setShowDate"
          />

          <template slot="event" slot-scope="eventProps">
            <!-- <div
              :id="`event-${eventProps.event.originalEvent.citaObject.IdCita}`"
              :title="eventProps.event.title"
              :class="`cv-event ${eventProps.event.classes[0]} ${eventProps.event.classes[1]} ${eventProps.event.classes[2]}`"
              :style="`top: calc(1.4em + ${eventProps.event.eventRow}*10em + ${eventProps.event.eventRow}*2px);`"
              @click.alt="eventProps.event.originalEvent.estado == 'Solicitada' || eventProps.event.originalEvent.estado == 'Confirmada' ? onCtrlClickEvent(eventProps.event.originalEvent.citaObject) : ''"
              @click.exact="eventProps.event.originalEvent.estado == 'Confirmada' ? onClickEvent(eventProps.event) : ''"
            > -->
            <div
              :id="`event-${eventProps.event.originalEvent.citaObject.IdCita}`"
              :title="eventProps.event.title"
              :class="`cv-event ${eventProps.event.classes[0]} ${eventProps.event.classes[1]} ${eventProps.event.classes[2]}`"
              :style="`top: calc(1.4em + ${eventProps.event.eventRow}*10em + ${eventProps.event.eventRow}*2px);`"
            >
              <h4 class="startTime">
                {{new Date(eventProps.event.originalEvent.startDate) | moment("hh:mm A")}}
              </h4>
              <p>{{eventProps.event.originalEvent.estado}}</p>
              <b-button
                class="mb-2 editar-cita"
                size="xs"
                variant="primary"
                @click="eventProps.event.originalEvent.estado == 'Solicitada' || eventProps.event.originalEvent.estado == 'Confirmada' ? onCtrlClickEvent(eventProps.event.originalEvent.citaObject) : ''"
              >
                Editar Cita
              </b-button>
              <b-button
                class="mb-2 ingresar-moto"
                size="xs"
                variant="primary"
                @click.exact="eventProps.event.originalEvent.estado == 'Confirmada' ? onClickEvent(eventProps.event) : ''"
              >
                Ingresar Moto
              </b-button>
              
              <b-popover
                :target="`event-${eventProps.event.originalEvent.citaObject.IdCita}`"
                triggers="hover"
                id="calendar-tooltip"
              >
                <template
                  v-slot:title
                >{{eventProps.event.originalEvent.citaObject.vehiculo.marca.marca}} {{eventProps.event.originalEvent.citaObject.vehiculo.marca.referencia}}</template>
                {{eventProps.event.originalEvent.citaObject.horaCita}}
                <br />

                {{eventProps.event.originalEvent.citaObject.vehiculo.usuario.firstName}}
                {{eventProps.event.originalEvent.citaObject.vehiculo.marca.marca}} {{eventProps.event.originalEvent.citaObject.vehiculo.placa}}
                {{eventProps.event.originalEvent.citaObject.servicio}}
                Recibe: {{eventProps.event.originalEvent.citaObject.mecanico ? eventProps.event.originalEvent.citaObject.mecanico.fullName : 'Sin mecanico asignado'}}
              </b-popover>
            </div>
          </template>
        </calendar-view>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import ServicesCore from "../../../services/service";
import ModalAddCita from "../../../components/Modals/addcitamodal";
import ModalAddOrden from "../../../components/Modals/addordenmodal";

import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin
} from "vue-simple-calendar";

export default {
  components: {
    "modal-add-cita": ModalAddCita,
    "modal-add-orden": ModalAddOrden,
    "calendar-view": CalendarView,
    "calendar-view-header": CalendarViewHeader
  },
  data() {
    return {
      calendar: {
        showDate: this.thisMonth(1),
        events: []
      },
      taller: {},
      cita: {}
    };
  },
  mixins: [CalendarMathMixin],
  computed: {
    ...mapGetters({ currentUser: "currentUser" })
  },
  methods: {
    loadCitasTaller() {
      ServicesCore.getCitasByIdTaller(this.currentUser.IdTaller)
        .then(response => {
          if (response.status == 200) {
            this.cita = {};
            this.calendar.events = response.data;
          }
        })
        .catch(error => {
          this.$notify("error filled", "ERROR", error.response.data.error, {
            duration: 3000,
            permanent: false
          });
        });
    },
    thisMonth(d, h, m) {
      const t = new Date();
      return new Date(
        t.getFullYear(),
        t.getMonth(),
        t.getUTCDate(),
        h || 0,
        m || 0
      );
    },
    onClickDay(d) {
      this.cita = {};
      this.$bvModal.show("modalAddCita");
    },
    onClickEvent(e) {
      this.cita = e;
      this.$bvModal.show("modalAddOrden");
      //console.log(`You clicked id Placa: ${e.placa}`);
    },
    onDropDate(event, date) {
      console.log(`You dropped ${event.id} on ${date.toLocaleDateString()}`);

      const eLength = this.dayDiff(event.startDate, date);
      event.originalEvent.startDate = this.addDays(event.startDate, eLength);
      event.originalEvent.endDate = this.addDays(event.endDate, eLength);
    },
    onCtrlClickEvent(event) {
      this.cita = event;
      this.$bvModal.show("modalAddCita");
    },
    setShowDate(d) {
      this.calendar.showDate = d;
    }
  },
  created() {
    ServicesCore.getTallerById(this.currentUser.IdTaller).then(response => {
      if (response.status == 200) {
        this.taller = response.data;
      }
    });
    this.loadCitasTaller();
  }
};
</script>

<style>
</style>
