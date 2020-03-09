<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{ $t('menu.taller') }} {{ $route.params.IdTaller}}</h1>
        <div class="top-right-button-container">
          <b-button
            v-b-modal.modalAddMecanico
            variant="primary"
            size="lg"
            class="top-right-button"
          >{{ $t('pages.branch.add-new-mecanico') }}</b-button>
          <modal-add-mecanico :taller="taller"></modal-add-mecanico>
        </div>
        <piaf-breadcrumb />
        <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
          <b-tab :title="$t('pages.details')">
            <b-row>
              <b-colxx xl="12" lg="12" class="mb-4">
                <b-card class="mb-4 detalle-taller">
                  <div class="position-absolute card-top-buttons">
                    <b-button variant="outline-white" class="icon-button">
                      <i class="simple-icon-pencil" />
                    </b-button>
                  </div>
                  <b-row>
                    <b-colxx class="logo-taller">
                      <img
                        :alt="taller.email"
                        :src="taller.logo || '/assets/img/preload.gif' "
                        class="card-img-top-2"
                      />
                      <!-- <img
                        :alt="taller.email"
                        :src="taller.logo"
                        class="card-img-top-2"
                      /> -->
                    </b-colxx>
                    <b-colxx>
                      <p
                        class="text-muted font-weight-medium mb-2"
                      >{{ $t('branch.taller.nombreTaller') }}</p>
                      <p class="mb-3">{{taller.nombre}}</p>
                      <p
                        class="text-muted font-weight-medium mb-2"
                      >{{ $t('branch.taller.identificacion') }}</p>
                      <div class="mb-3">{{taller.identificacion}}</div>
                      <p
                        class="text-muted font-weight-medium mb-2"
                      >{{ $t('branch.taller.celular') }}</p>
                      <p class="mb-3">{{taller.celular}}</p>
                    </b-colxx>
                    <b-colxx>
                      <p class="text-muted font-weight-medium mb-2">{{ $t('branch.taller.email') }}</p>
                      <div class="mb-3">{{taller.email}}</div>
                      <p
                        class="text-muted font-weight-medium mb-2"
                      >{{ $t('branch.taller.direccion') }}</p>
                      <div class="mb-3">{{taller.direccion}}</div>
                    </b-colxx>
                  </b-row>
                </b-card>
              </b-colxx>
            </b-row>
            <b-row>
              <b-colxx xl="12" lg="12" class="mb-4">
                <b-card :title="$t('dashboards.calendar')">
                  <modal-add-cita
                    :taller="taller"
                    :cita="cita"
                    @loadcitastalleres="loadCitasTaller"
                  ></modal-add-cita>
                  <modal-add-orden
                    :taller="taller"
                    :cita="cita"
                    @loadcitastalleres="loadCitasTaller"
                    @loadordenestalleres="loadOrdenesTaller"
                  ></modal-add-orden>
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
                      <div
                        :id="`event-${eventProps.event.originalEvent.citaObject.IdCita}`"
                        :title="eventProps.event.title"
                        :class="`cv-event ${eventProps.event.classes[0]} ${eventProps.event.classes[1]} ${eventProps.event.classes[2]}`"
                        :style="`top: calc(1.4em + ${eventProps.event.eventRow}*7em + ${eventProps.event.eventRow}*2px);`"
                        @click.ctrl="eventProps.event.originalEvent.estado == 'Solicitada' || eventProps.event.originalEvent.estado == 'Confirmada' ? onCtrlClickEvent(eventProps.event.originalEvent.citaObject) : ''"
                        @click.exact="eventProps.event.originalEvent.estado == 'Confirmada' ? onClickEvent(eventProps.event) : ''"
                      >
                        <h4 class="startTime">
                          {{new Date(eventProps.event.originalEvent.startDate).toLocaleString("en-US", {timeZone: "UTC"}) | moment("hh:mm A")}}
                        </h4>
                        <!-- <p>
                          {{eventProps.event.originalEvent.citaObject.servicio}}
                        </p>
                        <p>
                          {{eventProps.event.originalEvent.citaObject.vehiculo.marca.marca}}
                        </p>
                        <p>
                          {{eventProps.event.originalEvent.citaObject.vehiculo.marca.referencia}}
                        </p> -->
                        <b-popover
                          :target="`event-${eventProps.event.originalEvent.citaObject.IdCita}`"
                          triggers="hover"
                          id="calendar-tooltip">
                          <template v-slot:title>{{eventProps.event.originalEvent.citaObject.vehiculo.marca.marca}} {{eventProps.event.originalEvent.citaObject.vehiculo.marca.referencia}}</template>
                          {{eventProps.event.originalEvent.citaObject.horaCita}} <br />
                          {{eventProps.event.originalEvent.citaObject.vehiculo.usuario.firstName}}
                          {{eventProps.event.originalEvent.citaObject.vehiculo.marca.marca}} {{eventProps.event.originalEvent.citaObject.vehiculo.placa}}
                          {{eventProps.event.originalEvent.citaObject.servicio}}
                          Recibe: {{eventProps.event.originalEvent.citaObject.mecanico.fullName}}

                        </b-popover>
                        
                        <!-- <p>
                        {{eventProps.event}}
                        </p> -->
                        
                      </div>
                    </template>
                  </calendar-view>
                </b-card>
              </b-colxx>
            </b-row>
          </b-tab>

          <b-tab :title="$t('pages.branch.mecanicos')">
            <b-row>
              <b-colxx>
                <mecanicos-items
                  v-for="(mecanico,index) in taller.mecanicos"
                  :key="index"
                  :data="mecanico"
                />
              </b-colxx>
            </b-row>
          </b-tab>
          <b-tab :title="$t('pages.branch.ordentrabajo')">
            <b-row>
              <b-colxx
                xxs="12"
                class="mb-3"
                v-for="(orden,ordenIndex) in ordenes"
                :key="`orden_${ordenIndex}`"
              >
                <orden-card :data="orden" :mecanicos="taller.mecanicos" />
              </b-colxx>
            </b-row>
          </b-tab>
        </b-tabs>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin
} from "vue-simple-calendar";
import MecanicosItem from "../../../components/Listing/MecanicosListItem";
import OrdenCard from "../../../components/Cards/OrdenCard";
import ModalAddCita from "../../../components/Modals/addcitamodal";
import ModalAddOrden from "../../../components/Modals/addordenmodal";
import ModalAddMecanico from "../../../components/Modals/addmecanicomodal";
import ServicesCore from "../../../services/service";

export default {
  components: {
    "mecanicos-items": MecanicosItem,
    "calendar-view": CalendarView,
    "calendar-view-header": CalendarViewHeader,
    "orden-card": OrdenCard,
    "modal-add-cita": ModalAddCita,
    "modal-add-orden": ModalAddOrden,
    "modal-add-mecanico": ModalAddMecanico
  },
  mixins: [CalendarMathMixin],
  data() {
    return {
      isLoad: false,
      taller: {},
      cita: {},
      calendar: {
        showDate: this.thisMonth(1),
        events: []
      },
      ordenes: []
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser"
    })
  },
  methods: {
    loadCitasTaller() {
      console.log("Carga lista de citas ::::>", this.currentUser);
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
    loadOrdenesTaller() {
      ServicesCore.getOrdenesByIdTaller(this.currentUser.IdTaller)
        .then(async response => {
          if (response.status == 200) {
            let ordenList = [];
            let codeorden = "";
            let objMyOrden = null;
            for await (const orden of response.data) {
              if (orden.CodigoOrden != codeorden) {
                codeorden = orden.CodigoOrden;
                objMyOrden = {
                  CodigoOrden: orden.CodigoOrden,
                  IdTaller: orden.IdTaller,
                  IdCita: orden.IdCita,
                  IdVehiculo: orden.IdVehiculo,
                  vehiculo: orden.vehiculo,
                  taller: orden.taller,
                  etapas: []
                };
                let etapa = {
                  CodigoOrden: orden.CodigoOrden,
                  IdOrdenTrabajo: orden.IdOrdenTrabajo,
                  IdEtapa: orden.IdEtapa,
                  IdMecanico: orden.IdMecanico,
                  kilometraje: orden.kilometraje,
                  DocumentosDeja: orden.DocumentosDeja,
                  Observaciones: orden.Observaciones,
                  createdAt: orden.createdAt,
                  mecanico: orden.mecanico,
                  etapa: orden.etapa,
                  documentos: orden.documentos
                };
                objMyOrden.etapas.push(etapa);

                ordenList.push(objMyOrden);
              } else {
                //Si es la misma orden agrega la etapa unicamanete
                let etapa = {
                  CodigoOrden: orden.CodigoOrden,
                  IdOrdenTrabajo: orden.IdOrdenTrabajo,
                  IdEtapa: orden.IdEtapa,
                  IdMecanico: orden.IdMecanico,
                  kilometraje: orden.kilometraje,
                  DocumentosDeja: orden.DocumentosDeja,
                  Observaciones: orden.Observaciones,
                  createdAt: orden.createdAt,
                  mecanico: orden.mecanico,
                  etapa: orden.etapa,
                  documentos: orden.documentos
                };
                //objMyOrden.etapas.push(etapa);
                ordenList[ordenList.length - 1].etapas.push(etapa);
              }
            }

            this.ordenes = ordenList;
          }
        })
        .catch(error => {
          this.$notify("error filled", "ERROR", error.response.data.error, {
            duration: 3000,
            permanent: false
          });
        });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
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
      console.log(`You clicked: ${d.toLocaleDateString()}`);
      this.cita = {};
      this.$bvModal.show("modalAddCita");
    },
    onClickEvent(e) {
      console.log(`You clicked id Cita: ${e}`);
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
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
    ServicesCore.getTallerById(this.currentUser.IdTaller).then(response => {
      if (response.status == 200) {
        this.taller = response.data;
      }
    });

    this.loadCitasTaller();

    this.loadOrdenesTaller();
  }
};
</script>

<style>
</style>
