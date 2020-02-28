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
          <b-modal
            id="modalAddMecanico"
            ref="modalAddMecanico"
            :title="$t('pages.branch.add-new-mecanico')"
            modal-class="modal-right"
            hide-footer
          >
            <b-form @submit.prevent="onValitadeFormSubmit">
              <b-form-group :label="$t('branch.mecanico.identificacion')">
                <b-form-input
                  v-model="$v.newMecanico.identificacion.$model"
                  :state="!$v.newMecanico.identificacion.$error"
                />
                <b-form-invalid-feedback
                  v-if="!$v.newMecanico.identificacion.required"
                >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else-if="!$v.newMecanico.identificacion.minLength || !$v.newMecanico.identificacion.maxLength"
                >{{$t('branch.forms.validations.longitud')}}</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group :label="$t('branch.mecanico.firstName')">
                <b-form-input
                  v-model="$v.newMecanico.firstName.$model"
                  :state="!$v.newMecanico.firstName.$error"
                />
                <b-form-invalid-feedback
                  v-if="!$v.newMecanico.firstName.required"
                >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group :label="$t('branch.mecanico.lastName')">
                <b-form-input
                  v-model="$v.newMecanico.lastName.$model"
                  :state="!$v.newMecanico.lastName.$error"
                />
                <b-form-invalid-feedback
                  v-if="!$v.newMecanico.lastName.required"
                >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group :label="$t('branch.mecanico.skills')">
                <input-tag
                  v-model="newMecanico.skills"
                  :placeholder="$t('form-components.tags')"
                  :limit="4"
                ></input-tag>
              </b-form-group>
              <b-button
                variant="outline-secondary"
                @click="hideModal('modalAddMecanico')"
              >{{ $t('pages.cancel') }}</b-button>
              <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
            </b-form>
          </b-modal>
        </div>
        <piaf-breadcrumb />
        <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
          <b-tab :title="$t('pages.details')">
            <b-row>
              <b-colxx xl="12" lg="12" class="mb-4">
                <b-card class="mb-4">
                  <div class="position-absolute card-top-buttons">
                    <b-button variant="outline-white" class="icon-button">
                      <i class="simple-icon-pencil" />
                    </b-button>
                  </div>
                  <b-row>
                    <b-colxx>
                      <img
                        :alt="taller.email"
                        :src="taller.logo || '/assets/img/detail.jpg' "
                        class="card-img-top-2"
                      />
                    </b-colxx>
                    <b-colxx>
                      <p class="text-muted font-weight-medium mb-2">{{ $t('branch.taller.nombreTaller') }}</p>
                      <p class="mb-3">{{taller.nombre}}</p>
                      <p class="text-muted font-weight-medium mb-2">{{ $t('branch.taller.identificacion') }}</p>
                      <div class="mb-3">{{taller.identificacion}}</div>
                      <p class="text-muted font-weight-medium mb-2">{{ $t('branch.taller.celular') }}</p>
                      <p class="mb-3">{{taller.celular}}</p>
                    </b-colxx>
                    <b-colxx>
                      <p class="text-muted font-weight-medium mb-2">{{ $t('branch.taller.email') }}</p>
                      <div class="mb-3">{{taller.email}}</div>
                      <p class="text-muted font-weight-medium mb-2">{{ $t('branch.taller.direccion') }}</p>
                      <div class="mb-3">{{taller.direccion}}</div>
                    </b-colxx>
                  </b-row>
                </b-card>
              </b-colxx>
            </b-row>
            <b-row>
              <b-colxx xl="12" lg="12" class="mb-4">
                <b-card :title="$t('dashboards.calendar')">
                  <b-modal
                    id="modalAddCita"
                    ref="modalAddCita"
                    :title="$t('pages.branch.add-new-cita')"
                    modal-class="modal-basic"
                    hide-footer>
                    <b-form @submit.prevent="onValitadeAddCita">
                      <b-form-group :label="$t('branch.cita.placa')">
                        <b-form-input
                          v-model="$v.newCita.placa.$model"
                          :state="!$v.newCita.placa.$error"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.newCita.placa.required"
                        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group :label="$t('branch.cita.mecanico')">
                        <v-select
                          :options="taller.mecanicos"
                          v-model="newCita.mecanico"
                          label="firstName"
                          :reduce="mecanico => mecanico.IdMecanico"
                        >
                          <template
                            v-slot:option="option"
                          >{{ option.firstName }} {{ option.lastName }} - {{option.identificacion}}</template>
                        </v-select>
                      </b-form-group>
                      <b-form-group :label="$t('branch.cita.fechaCita')">
                        <v-date-picker
                          mode="single"
                          v-model="$v.newCita.fechaCita.$model"
                          :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"
                        ></v-date-picker>
                        <b-form-invalid-feedback
                          v-if="!$v.newCita.fechaCita.required"
                        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group :label="$t('branch.cita.horacita')">
                        <b-form-input
                          id="txtHoraCita"
                          v-model="$v.newCita.horaCita.$model"
                          :state="!$v.newCita.horaCita.$error"
                          type="time"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.newCita.horaCita.required"
                        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                      </b-form-group>

                      <b-button
                        variant="outline-secondary"
                        @click="hideModal('modalAddCita')"
                      >{{ $t('pages.cancel') }}</b-button>
                      <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
                    </b-form>
                  </b-modal>
                  <b-modal
                    id="modalIngresarVehiculo"
                    ref="modalIngresarVehiculo"
                    :title="$t('pages.branch.add-orden-vehicle')"
                    modal-class="modal-basic"
                    hide-footer>
                    <b-form @submit.prevent="onValitadeAddOrden">
                      <b-form-group :label="$t('branch.orden.mecanico')">
                        <v-select
                          :options="taller.mecanicos"
                          v-model="newOrden.mecanico"
                          label="firstName"
                          :reduce="mecanico => mecanico.IdMecanico"
                        >
                          <template
                            v-slot:option="option"
                          >{{ option.firstName }} {{ option.lastName }} - {{option.identificacion}}</template>
                        </v-select>
                      </b-form-group>
                      <b-form-group :label="$t('branch.orden.kilometraje')">
                        <b-form-input
                          v-model="$v.newOrden.kilometraje.$model"
                          :state="!$v.newOrden.kilometraje.$error"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.newOrden.kilometraje.required"
                        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group :label="$t('branch.orden.documentos')">
                        <input-tag
                          v-model="newOrden.documentos"
                          :placeholder="$t('form-components.tags')"
                          :limit="4"
                        ></input-tag>
                      </b-form-group>
                      <b-form-group :label="$t('branch.orden.observaciones')">
                        <b-textarea v-model.trim="newOrden.observacion"></b-textarea>
                      </b-form-group>
                      <b-button
                        variant="outline-secondary"
                        @click="hideModal('modalIngresarVehiculo')"
                      >{{ $t('pages.cancel') }}</b-button>
                      <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
                    </b-form>
                  </b-modal>
                  <calendar-view
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
                    @click-event="onClickEvent"
                  >
                    <calendar-view-header
                      slot="header"
                      slot-scope="t"
                      :header-props="t.headerProps"
                      @input="setShowDate"
                    />
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin
} from "vue-simple-calendar";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import MecanicosItem from "../../../components/Listing/MecanicosListItem";
import OrdenCard from "../../../components/Cards/OrdenCard";
import InputTag from "../../../components/Form/InputTag";

import ServicesCore from "../../../services/service";

export default {
  components: {
    "input-tag": InputTag,
    "mecanicos-items": MecanicosItem,
    "calendar-view": CalendarView,
    "calendar-view-header": CalendarViewHeader,
    "v-select": vSelect,
    "orden-card": OrdenCard
  },
  mixins: [CalendarMathMixin],
  data() {
    return {
      isLoad: false,
      taller: {},
      newMecanico: {
        identificacion: "",
        firstName: "",
        lastName: "",
        skills: []
      },
      newCita: {
        placa: "",
        mecanico: null,
        fechaCita: null,
        horaCita: null
      },
      newOrden: {
        IdCita: null,
        mecanico: null,
        kilometraje: null,
        documentos: [],
        observacion: null
      },
      calendar: {
        showDate: this.thisMonth(1),
        events: []
      },
      ordenes: []
    };
  },
  validations: {
    newMecanico: {
      identificacion: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(2)
      },
      firstName: {
        required
      },
      lastName: {
        required
      },
      skills: {
        required
      }
    },
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
    },
    newOrden: {
      kilometraje: {
        required
      }
    }
  },
  methods: {
    loadCitasTaller() {
      ServicesCore.getCitasByIdTaller(this.$route.params.IdTaller)
        .then(response => {
          if (response.status == 200) {
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
      ServicesCore.getOrdenesByIdTaller(this.$route.params.IdTaller)
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
                  etapa: orden.etapa
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
                  etapa: orden.etapa
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
    onValitadeFormSubmit() {
      this.$v.$touch();
      var myJsonString = JSON.stringify(this.newMecanico.skills);
      var mecanico = {
        identificacion: this.newMecanico.identificacion,
        firstName: this.newMecanico.firstName,
        lastName: this.newMecanico.lastName,
        skills: myJsonString,
        taller: this.taller
      };
      // if its still pending or an error is returned do not submit
      if (this.$v.newMecanico.$pending || this.$v.newMecanico.$error) return;

      ServicesCore.createMecanico(mecanico)
        .then(response => {
          if (response.status == 200) {
            //this.loadItems();
            this.hideModal("modalAddMecanico");
            this.newMecanico = {
              identificacion: "",
              firstName: "",
              lastName: "",
              skills: []
            };
            this.$notify(
              "success",
              "Resultado",
              "Se creo el mecanico correctamente",
              {
                duration: 3000,
                permanent: false
              }
            );
          }
        })
        .catch(error => {
          this.$notify("error filled", "ERROR", error.response.data.error, {
            duration: 3000,
            permanent: false
          });
        });
    },
    onValitadeAddOrden() {
      this.$v.$touch();
      // if its still pending or an error is returned do not submit
      if (this.$v.newOrden.$pending || this.$v.newOrden.$error) return;

      let myJsonDocumentos = JSON.stringify(this.newOrden.documentos);
      let orden = {
        IdCita: this.newOrden.IdCita,
        kilometraje: this.newOrden.kilometraje,
        mecanico: this.newOrden.mecanico,
        documentos: myJsonDocumentos,
        IdTaller: this.taller.IdTaller,
        IdEtapa: 2,
        Observaciones: this.newOrden.observacion
      };

      ServicesCore.createOrden(orden)
        .then(response => {
          if (response.status == 200) {
            //this.loadItems();
            this.hideModal("modalIngresarVehiculo");
            this.newOrden = {
              IdCita: null,
              mecanico: null,
              kilometraje: null,
              documentos: [],
              observacion: null
            };
            this.loadCitasTaller();
            this.$notify(
              "success",
              "Resultado",
              "Se creo la orden de trabajo",
              {
                duration: 3000,
                permanent: false
              }
            );
          }
        })
        .catch(error => {
          this.$notify(
            "error filled",
            "ERROR",
            error.response.data.error.message,
            {
              duration: 3000,
              permanent: false
            }
          );
        });
    },
    onValitadeAddCita() {
      this.$v.$touch();
      // if its still pending or an error is returned do not submit
      if (this.$v.newCita.$pending || this.$v.newCita.$error) return;

      console.log(JSON.stringify(this.newCita));

      var citaCreate = {
        placa: this.newCita.placa,
        mecanico: this.newCita.mecanico,
        fechaCita: this.newCita.fechaCita,
        taller: this.taller.IdTaller,
        horaCita: this.newCita.horaCita
      };

      ServicesCore.createCita(citaCreate)
        .then(response => {
          if (response.status == 200) {
            //this.loadItems();
            this.hideModal("modalAddCita");
            this.newCita = {
              placa: "",
              mecanico: null,
              fechaCita: null,
              horaCita: null
            };

            this.loadCitasTaller();

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
      console.log(`You clicked: ${d.toLocaleDateString()}`);
      this.newCita.fechaCita = d;
      this.$bvModal.show("modalAddCita");
    },
    onClickEvent(e) {
      console.log(`You clicked id Cita: ${e.id}`);
      this.newOrden.IdCita = e.id;
      this.$bvModal.show("modalIngresarVehiculo");
      //console.log(`You clicked id Placa: ${e.placa}`);
    },
    onDropDate(event, date) {
      console.log(`You dropped ${event.id} on ${date.toLocaleDateString()}`);

      const eLength = this.dayDiff(event.startDate, date);
      event.originalEvent.startDate = this.addDays(event.startDate, eLength);
      event.originalEvent.endDate = this.addDays(event.endDate, eLength);
    },
    setShowDate(d) {
      this.calendar.showDate = d;
    }
  },
  mounted() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
    ServicesCore.getTallerById(this.$route.params.IdTaller).then(response => {
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
