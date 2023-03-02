<template>
  <b-card>
    <b-form v-if="!data.etapa || data.etapa.estado=='Rechazado'" @submit.prevent="uploadFiles">
      <info-cotizacion v-if="data.etapa && data.etapa.estado=='Rechazado'" :data="data" />
      <b-form-group :label="$t('branch.orden.mecanico')">
        <v-select
          v-model="newOrden.mecanico"
          :options="data.mecanicos"
          label="firstName"
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
          <template
            #option="option"
          >
            {{ option.firstName }} {{ option.lastName }} - {{ option.identificacion }}
          </template>
        </v-select>
      </b-form-group>
      <vue-dropzone
        id="dropzone"
        ref="myVueDropzone"
        :awss3="awss3"
        :options="dropzoneOptions"
        @vdropzone-complete="complete"
        @vdropzone-removed-file="removeFile"
      />
      <div class="btn-icon">
        <b-button type="submit" variant="primary" class="mt-4" size="lg">
          <i class="iconsminds-upload-1" />
          Cargar Cotización
          <!-- {{ $t('forms.submit') }} -->
        </b-button>
      </div>
    </b-form>
    <info-cotizacion v-else :data="data" />
  </b-card>
</template>
<script>
import vSelect from "vue-select";
import moment from "moment-timezone";
import "vue-select/dist/vue-select.css";
import vue2Dropzone from "vue2-dropzone";

import ServicesCore from "./../../services/service";
import InfoCotizacion from "./InfoCotizacion";

export default {
  name: "cotizacion-step",
  components: {
    "vue-dropzone": vue2Dropzone,
    "v-select": vSelect,
    "info-cotizacion": InfoCotizacion
  },
  props: ["clickedNext", "currentStep", "data"],
  data() {
    return {
      newOrden: {
        mecanico: null
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
  watch: {
    clickedNext(val) {
      if (val === true) {
        //console.log("Orden a crearDB ::::>", this.orden);
        //this.$v.newOrden.$touch();
      }
    }
  },
  mounted() {
    console.log("Data :::>", this.data);
    if (this.data.etapa) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  },
  methods: {
    complete(response) {
      if (response.status == "success") {
        let dateCreated = moment()
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
    uploadFiles() {
      if (this.filesEtapa.length > 0) {
        let orden = {
          CodigoOrden: this.data.CodigoOrden,
          IdCita: this.data.IdCita,
          kilometraje: this.data.kilometraje,
          IdMecanico: this.newOrden.mecanico,
          IdTaller: this.data.IdTaller,
          IdEtapa: 4,
          documentos: this.filesEtapa,
          estado: "Pendiente"
        };

        ServicesCore.createOrden(orden)
          .then(response => {
            if (response.status == 200) {
              //this.loadItems();

              ServicesCore.getOrdenById(response.data.orden.IdOrdenTrabajo)
                .then(response => {
                  if (response.status == 200) {
                    this.newOrden = {
                      mecanico: null
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
                    //this.data.etapa = response.data;
                    this.$emit("can-continue", { value: true });
                    this.$emit("success-step");
                  }
                })
                .catch(error => {
                  this.$emit("can-continue", { value: false });
                  if (error.response) {
                    this.$notify(
                      "error filled",
                      "ERROR",
                      error.response.data.error,
                      {
                        duration: 3000,
                        permanent: false
                      }
                    );
                  } else {
                    this.$notify("error filled", "ERROR", error, {
                      duration: 3000,
                      permanent: false
                    });
                  }
                });
            }
          })
          .catch(error => {
            this.$emit("can-continue", { value: false });
            if (error.response) {
              this.$notify("error filled", "ERROR", error.response.data.error, {
                duration: 3000,
                permanent: false
              });
            } else {
              this.$notify("error filled", "ERROR", error, {
                duration: 3000,
                permanent: false
              });
            }
          });
      } else {
        this.$notify(
          "error filled",
          "ERROR",
          "Debe cargar un archivo a la cotizacion",
          {
            duration: 3000,
            permanent: false
          }
        );
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
