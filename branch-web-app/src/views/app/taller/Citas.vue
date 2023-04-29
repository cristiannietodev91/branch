<template>
  <div class="row">
    <div class="col col-12 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">
            {{ $t('dashboards.calendar') }}
          </h5>
          <modal-add-cita
            :cita="cita" :open="isOpenModalAppointment" @loadcitastalleres="loadCitasTaller"
            @close="() => { 
              isOpenModalAppointment = false
              cita = {}
            }"
          />
          <modal-add-orden
            :cita="cita" :open="isOpenModalOrder" @loadcitastalleres="loadCitasTaller" 
            @close="() => { 
              isOpenModalOrder = false
              cita = {}
            }"
          />
          <calendar-view
            :is-expanded="true"
            class="theme-default holiday-us-traditional holiday-us-official"
            style="min-height:500px"
            :items="calendar.items"
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
            <template #header="{ headerProps }">
              <calendar-view-header
                :header-props="headerProps"
                @input="setShowDate"
              />
            </template>

            <template #item="{ value: item }">
              <div
                :id="`event-${item.originalItem.citaObject.IdCita}`"
                :title="item.title"
                :class="`cv-item ${item.classes.join(' ')}`"
                :style="`top: calc(6.4em + ${item.itemRow}*24em + ${item.itemRow}*2px);`"
              >
                <h4 class="startTime">
                  {{ dateTime(new Date(item.originalItem.startDate)) }}
                </h4>
                <p>{{ item.originalItem.estado }}</p>
                <div
                  v-if="item.originalItem.estado === 'Solicitada' || item.originalItem.estado === 'Confirmada'"
                  class="btn btn-primary btn-xs mb-2 editar-cita"
                  @click="onCtrlClickEvent(item.originalItem.citaObject)"
                >
                  <small :class="'glyph-icon simple-icon-pencil'" />
                  <span>Editar</span>
                </div>
                <div
                  v-if="item.originalItem.estado === 'Confirmada'"
                  class="btn btn-primary btn-xs mb-2 ingresar-moto"
                  @click.exact="onClickEvent(item)"
                >
                  <small :class="'glyph-icon simple-icon-arrow-right'" />
                  <span>Ingresar</span>
                </div>
              </div>
            </template>
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
          </calendar-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import ServicesCore from "../../../services/service";
import ModalAddCita from "../../../components/Modals/addcitamodal";
import ModalAddOrden from "../../../components/Modals/addordenmodal";

import {
  CalendarView,
  CalendarViewHeader,
} from "vue-simple-calendar";

import "../../../../node_modules/vue-simple-calendar/dist/style.css"

export default {
  name: "citas-workshop",
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
        items: []
      },
      cita: {},
      isOpenModalAppointment: false,
      isOpenModalOrder: false,
    };
  },
  computed: {
    ...mapGetters({ currentUser: "currentUser" })
  },
  created() {
    this.loadCitasTaller();
  },
  mounted(){
    this.loadWorkshop();
  },
  methods: {
    ...mapActions(["loadWorkshop"]),
    dateTime(value) {
        return moment(value).format('hh:mm A');
    },
    loadCitasTaller() {
      ServicesCore.getCitasByIdTaller(this.currentUser.IdTaller)
        .then(response => {
          if (response.status == 200) {
            this.cita = {};
            this.calendar.items = response.data;
          }
        })
        .catch(error => {
          this.$notify({
            title: "ERROR",
            type: "error",
            duration: 3000,
            permanent: false,
            text: error.response.data.error
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
      this.isOpenModalAppointment = true;
    },
    onClickEvent(e) {
      this.cita = e;
      this.isOpenModalOrder = true;
    },
    onDropDate(event, date) {
      console.log(`You dropped ${event.id} on ${date.toLocaleDateString()}`);

      const eLength = this.dayDiff(event.startDate, date);
      event.originalEvent.startDate = this.addDays(event.startDate, eLength);
      event.originalEvent.endDate = this.addDays(event.endDate, eLength);
    },
    onCtrlClickEvent(event) {
      this.cita = event;
      this.isOpenModalAppointment = true;
    },
    setShowDate(d) {
      this.calendar.showDate = d;
    },
  }
};
</script>

<style>
</style>
