<template>
  <div class="card">
    <div class="card-body">
      <form v-if="!data.etapa" novalidate @submit.prevent="onValitadeAddOrden">
        <div>
          <label for="mechanic_id" class="form-label">{{ $t('branch.orden.mecanico') }}</label>
          <div class="input-group has-validation">
            <v-select
              id="mechanic_id"
              v-model="newOrden.mecanico"
              :options="mecanicos"
              label="fullName"
              :reduce="mecanico => mecanico.IdMecanico"
              class="w-100"
              :class="{ 'is-invalid': v$.newOrden.mecanico.$error }"
            >
              <template #search="{attributes, events}">
                <input
                  v-bind="attributes"
                  class="vs__search"
                  v-on="events"
                >
              </template>
              <template #option="option">
                {{ option.fullName }} - {{ option.identificacion }}
              </template>
            </v-select>
            <div
              v-if="v$.newOrden.mecanico.required.$invalid"
              class="invalid-feedback"
            >
              {{ $t('branch.forms.validations.required') }}
            </div>
          </div>
        </div>
        <div>
          <label for="order_observation" class="form-label">{{ $t('branch.orden.observaciones') }}</label>
          <div class="input-group has-validation">
            <textarea
              v-model.trim="v$.newOrden.observacion.$model"
              class="form-control"
              :class="{ 'is-invalid': v$.newOrden.observacion.$error }"
            />
            <div
              v-if="v$.newOrden.observacion.required.$invalid"
              class="invalid-feedback"
            >
              {{ $t('branch.forms.validations.required') }}
            </div>
          </div>
        </div>
        <div>
          <label for="dropzone" class="form-label">{{ $t('branch.forms.labels.files') }}</label>
          <vue-dropzone
            id="dropzone"
            ref="myVueDropzone"
            :awss3="awss3"
            :options="dropzoneOptions"
            @vdropzone-complete="complete"
            @vdropzone-removed-file="removeFile"
          />
        </div>
        <button type="submit" class="btn btn-primary btn-lg mt-4">
          {{ $t('forms.submit') }}
        </button>
      </form>
      <div v-else>
        <div class="row">
          <div class="col col-3">
            <p class="text-muted text-small mb-2">
              {{ $t('branch.orden.fechaIngreso') }}
            </p>
            <p class="mb-3">
              {{ dateTime(data.etapa.createdAt) }}
            </p>
          </div>
          <div v-if="data.etapa.mecanico" class="col col-3">
            <p class="text-muted text-small mb-2">
              {{ $t('branch.orden.mecanico') }}
            </p>
            <p class="mb-3">
              {{ data.etapa.mecanico.identificacion }} {{ data.etapa.mecanico.fullName }}
            </p>
          </div>
          <div class="col">
            <p class="text-muted text-small mb-2">
              {{ $t('branch.orden.observaciones') }}
            </p>
            <p class="mb-3">
              {{ data.etapa.Observaciones }}
            </p>
          </div>
        </div>
        <div class="icon-cards-row">
          <div v-if="data.etapa.documentos" class="branch-gallery">
            <div id="collapse-diagnostico" class="collapse">
              <div
                v-for="(documento,index) in data.etapa.documentos"
                :key="`contact${index}`"
                class="branch-image"
              >
                <div class="card">
                  <single-lightbox
                    :thumb="documento.url.replace('branchmedia','branchmedia-resized')"
                    :large="documento.url"
                    class-name="responsive"
                  />
                  <p class="card-text">
                    {{ dateTime(documento.date) }}
                  </p>
                </div>
              </div>
            </div>
            <button
              class="btn btn-primary m-1" type="button" data-bs-toggle="collapse" 
              data-bs-target="#collapse-diagnostico" aria-expanded="false" aria-controls="collapse-diagnostico"
            >
              Ver fotos de la entrega
            </button>
          </div>
          <div v-else class="pl-2 d-flex flex-grow-1 min-width-zero">
            <div class="card-body align-self-center d-flex min-width-zero">
              <p class="text-muted text-small mb-0 font-weight-light">
                Sin documentos asociados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import vueDropzone from "dropzone-vue3";
import SingleLightbox from "../Pages/SingleLightbox";
import { useVuelidate } from '@vuelidate/core'
import momentTZ from "moment-timezone";
import moment from "moment";
import { required } from "@vuelidate/validators";
import ServicesCore from "./../../services/service";

export default {
  name: "entrega-step",
  components: {
    "single-lightbox": SingleLightbox,
    vueDropzone,
  },
  props: ["clickedNext", "currentStep", "data"],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      newOrden: {
        mecanico: null,
        observacion: ""
      },
      filesEtapa: [],
      dropzoneOptions: {
        url: process.env.VUE_APP_URLBACKSERVICES + `file/sendFile`,
        method: "post",
        autoProcessQueue: true,
        acceptedFiles: "application/pdf",
        thumbnailHeight: 160,
        maxFilesize: 4,
        maxFiles: 1,
        previewTemplate: this.dropzoneTemplate()
      },
      awss3: {
        signingURL: f => {
          // The server REST endpoint we setup earlier
          const key =
            process.env.VUE_APP_URLBACKSERVICES +
            `file/signed?filename=${f.name}`;
          // Save this for later use
          return key;
        },
        headers: {},
        params: {},
        sendFileToServer: false
      },
      glideBasicOption: {
        gap: 1,
        perView: this.data.etapa ? this.data.etapa.documentos.length : 3,
        type: "carousel"
      }
    };
  },
  computed: {
    ...mapGetters({
      mecanicos: "workshopMechanics",
    })
  },
  validations: {
    newOrden: {
      observacion: {
        required
      },
      mecanico: {
        required
      } 
    }
  },
  mounted() {
    if (this.data.etapa) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  },
  methods: {
    ...mapMutations(["addWorkOrder"]),
    dateTime(value) {
      return moment(value).format('D MMMM YYYY hh:mm A');
    },
    complete(response) {
      if (response.status == "success") {
        let dateCreated = momentTZ()
          .tz("UTC")
          .format();

        let documento = {
          nombrearchivo: response.name,
          url: response.s3Url + "/" + response.s3Signature.key,
          type: response.type,
          date: dateCreated,
          size: response.size,
          key: response.s3Signature.key
        };
        this.filesEtapa.push(documento);
      }
    },
    removeFile(file) {
      this.filesEtapa = this.filesEtapa.filter(value => {
        value.key != file.s3Signature.key;
      });
    },
    async onValitadeAddOrden() {
      const isFormCorrect = await this.v$.$validate()

      if (!isFormCorrect) return

      const { workOrder } = this.data;

      if (workOrder && this.filesEtapa.length > 0) {
        let orden = {
          CodigoOrden: workOrder.CodigoOrden,
          IdCita: workOrder.IdCita,
          kilometraje: workOrder.kilometraje,
          IdMecanico: this.newOrden.mecanico,
          IdTaller: workOrder.IdTaller,
          IdEtapa: 7,
          Observaciones: this.newOrden.observacion,
          documentos: this.filesEtapa,
          estado: "Aceptado"
        };
        
        ServicesCore.createOrden(orden)
          .then(response => {
            if (response.status == 200) {
              //this.loadItems();

              ServicesCore.getOrdenById(response.data.orden.IdOrdenTrabajo)
                .then(response => {
                  if (response.status == 200) {
                    this.newOrden = {
                      mecanico: null,
                      observacion: ""
                    };
                    this.$notify(
                      "success",
                      "Resultado",
                      "Se creo la orden de trabajo",
                      {
                        duration: 3000,
                        permanent: false
                      }
                    );

                    this.addWorkOrder(response.data);
                    this.$emit("can-continue", { value: true });
                    this.$emit("success-step");
                  }
                })
                .catch(error => {
                  this.$emit("can-continue", { value: false });
                  if (error.response) {
                    this.$notify({
                      title: "ERROR",
                      type: "error",
                      duration: 3000,
                      permanent: false,
                      text: error.response.data.error
                    });
                  } else {
                    this.$notify({
                      title: "ERROR",
                      type: "error",
                      duration: 3000,
                      permanent: false,
                      text: error
                    });
                  }
                });
            }
          })
          .catch(error => {
            this.$emit("can-continue", { value: false });
            if (error.response) {
              this.$notify({
                title: "ERROR",
                type: "error",
                duration: 3000,
                permanent: false,
                text: error.response.data.error
              });
            } else {
              this.$notify({
                title: "ERROR",
                type: "error",
                duration: 3000,
                permanent: false,
                text: error
              });
            }
          });
      } else {
        this.$notify({
          title: "ERROR",
          type: "error",
          duration: 3000,
          permanent: false,
          text: 'You should upload photos to the vehicle diagnostic'
        });
      }
    },
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `;
    }
  }
};
</script>
