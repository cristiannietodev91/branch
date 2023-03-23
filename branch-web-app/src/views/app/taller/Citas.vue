<template>
  <div class="row">
    <div class="col col-12 mb-4">
      <div class="card">
        <h5 class="card-title">
          {{ $t('dashboards.calendar') }}
        </h5>
        <modal-add-cita :taller="taller" :cita="cita" @loadcitastalleres="loadCitasTaller" />
        <modal-add-orden :taller="taller" :cita="cita" @loadcitastalleres="loadCitasTaller" />
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
          <template #header="t">
            <calendar-view-header
              :header-props="t.headerProps"
              @input="setShowDate"
            />
          </template>

          <template #event="eventProps">
            <div
              :id="`event-${eventProps.event.originalEvent.citaObject.IdCita}`"
              :title="eventProps.event.title"
              :class="`cv-event ${eventProps.event.classes[0]} ${eventProps.event.classes[1]} ${eventProps.event.classes[2]}`"
              :style="`top: calc(6.4em + ${eventProps.event.eventRow}*24em + ${eventProps.event.eventRow}*2px);`"
            >
              <h4 class="startTime">
                {{ dateTime(new Date(eventProps.event.originalEvent.startDate)) }}
              </h4>
              <p>{{ eventProps.event.originalEvent.estado }}</p>
              <div
                class="btn btn-primary btn-xs mb-2 editar-cita"
                @click="eventProps.event.originalEvent.estado == 'Solicitada' || eventProps.event.originalEvent.estado == 'Confirmada' ? onCtrlClickEvent(eventProps.event.originalEvent.citaObject) : ''"
              >
                <small :class="'glyph-icon simple-icon-pencil'" />
                <span>Editar</span>
              </div>
              <div
                class="btn btn-primary btn-xs mb-2 ingresar-moto"
                @click.exact="eventProps.event.originalEvent.estado == 'Confirmada' ? onClickEvent(eventProps.event) : ''"
              >
                <small :class="'glyph-icon simple-icon-arrow-right'" />
                <span>Ingresar</span>
              </div>
              
              <!-- <b-popover
                id="calendar-tooltip"
                :target="`event-${eventProps.event.originalEvent.citaObject.IdCita}`"
                triggers="hover"
              >
                <template
                  #title
                >
                  {{ eventProps.event.originalEvent.citaObject.vehiculo.marca.marca }} {{ eventProps.event.originalEvent.citaObject.vehiculo.marca.referencia }}
                </template>
                {{ eventProps.event.originalEvent.citaObject.horaCita }}
                <br>

                {{ eventProps.event.originalEvent.citaObject.vehiculo.usuario?.firstName || '' }}
                {{ eventProps.event.originalEvent.citaObject.vehiculo.marca.marca }} {{ eventProps.event.originalEvent.citaObject.vehiculo.placa }}
                {{ eventProps.event.originalEvent.citaObject.servicio }}
                Recibe: {{ eventProps.event.originalEvent.citaObject.mecanico ? eventProps.event.originalEvent.citaObject.mecanico.fullName : 'Sin mecanico asignado' }}
              </b-popover> -->
            </div>
          </template>
        </calendar-view>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
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
  name: "citas-workshop",
  components: {
    "modal-add-cita": ModalAddCita,
    "modal-add-orden": ModalAddOrden,
    "calendar-view": CalendarView,
    "calendar-view-header": CalendarViewHeader
  },
  mixins: [CalendarMathMixin],
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
  computed: {
    ...mapGetters({ currentUser: "currentUser" })
  },
  created() {
    ServicesCore.getTallerById(this.currentUser.IdTaller).then(response => {
      if (response.status == 200) {
        this.taller = response.data;
      }
    });
    this.loadCitasTaller();
  },
  methods: {
    dateTime(value) {
        return moment(value).format('hh:mm A');
    },
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
    thisMonth(_, h, m) {
      const t = new Date();
      return new Date(
        t.getFullYear(),
        t.getMonth(),
        t.getUTCDate(),
        h || 0,
        m || 0
      );
    },
    onClickDay() {
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
  }
};
</script>

<style>
</style>
