<template>
  <div class="card">
    <div class="card-body">
      <form v-if="!data.etapa" novalidate @submit.prevent="onValitadeAddOrden">
        <div>
          <label for="mechanic_id" class="form-label">{{ $t('branch.orden.mecanico') }}</label>
          <v-select
            id="mechanic_id"
            v-model="newOrden.mecanico"
            :options="data.mecanicos"
            label="fullName"
            :reduce="mecanico => mecanico.IdMecanico"
          >
            <template #search="{attributes, events}">
              <input
                v-bind="attributes"
                class="vs__search"
                :required="!newOrden.mecanico"
                v-on="events"
              >
            </template>
            <template #option="option">
              {{ option.fullName }} - {{ option.identificacion }}
            </template>
          </v-select>
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
        <vue-dropzone
          id="dropzone"
          ref="myVueDropzone"
          :awss3="awss3"
          :options="dropzoneOptions"
          @vdropzone-complete="complete"
          @vdropzone-removed-file="removeFile"
        />
        <div class="btn-icon">
          <button type="submit" class="btn btn-primary btn-lg mt-4">
            <i class="iconsminds-upload-1" />
            Cargar Diagnóstico
          </button>
        </div>
      </form>
      <div v-else>
        <div class="row">
          <div class="col col-3">
            <p class="text-muted text-small mb-2">
              {{ $t('branch.orden.fechaIngreso') }}
            </p>
            <h5
              class="mb-1 card-subtitle truncate"
            >
              {{ dateTime(data.etapa.createdAt) }}
            </h5>
          </div>
          <div v-if="data.etapa.mecanico" class="col col-3">
            <p class="text-muted text-small mb-2">
              {{ $t('branch.orden.mecanico') }}
            </p>
            <h5
              class="mb-1 card-subtitle truncate"
            >
              {{ data.etapa.mecanico.identificacion }} {{ data.etapa.mecanico.firstName }}
            </h5>
          </div>
          <div class="col">
            <p class="text-muted text-small mb-2">
              {{ $t('branch.orden.observaciones') }}
            </p>
            <h5 class="mb-1 card-subtitle truncate">
              {{ data.etapa.Observaciones }}
            </h5>
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
                    :thumb="documento.url"
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
              Ver fotos del diagnóstico
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
import vueDropzone from "dropzone-vue3";
import { useVuelidate } from '@vuelidate/core'
import momentTZ from "moment-timezone";
import moment from "moment";
import { required } from "@vuelidate/validators";
import SingleLightbox from "../Pages/SingleLightbox";
import ServicesCore from "./../../services/service";

export default {
  name: 'diagnostico-step',
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
        acceptedFiles: "image/*",
        thumbnailHeight: 160,
        maxFilesize: 4,
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
  validations: {
    newOrden: {
      observacion: {
        required
      }
    }
  },
  watch: {
    clickedNext() {
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

      if (this.filesEtapa.length > 0) {
        let orden = {
          CodigoOrden: this.data.CodigoOrden,
          IdCita: this.data.IdCita,
          kilometraje: this.data.kilometraje,
          IdMecanico: this.newOrden.mecanico,
          IdTaller: this.data.IdTaller,
          IdEtapa: 3,
          Observaciones: this.newOrden.observacion,
          documentos: this.filesEtapa,
          estado: "Aceptado"
        };

        console.log("Orden a enviar al servicio::>", orden);

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
                    console.log("Data get orden By Id :::>", response.data);
                    // TODO: Fix issue to mutate received data
                    // this.data.etapa = response.data;
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
          text: 'You should update photos to the diagnostic.'
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

