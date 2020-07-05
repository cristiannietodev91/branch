<template>
  <b-card>
    <b-form
      @submit.prevent="uploadFiles"
      v-if="!data.etapa || data.etapa.estado=='Rechazado'"
    >
      <info-cotizacion :data="data" v-if="data.etapa && data.etapa.estado=='Rechazado'" />
      <b-form-group :label="$t('branch.orden.mecanico')">
        <v-select
          :options="data.mecanicos"
          v-model="newOrden.mecanico"
          label="firstName"
          :reduce="mecanico => mecanico.IdMecanico"
        >
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!newOrden.mecanico"
              v-bind="attributes"
              v-on="events"
            />
          </template>
          <template
            v-slot:option="option"
          >{{ option.firstName }} {{ option.lastName }} - {{option.identificacion}}</template>
        </v-select>
      </b-form-group>
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        :awss3="awss3"
        :options="dropzoneOptions"
        v-on:vdropzone-complete="complete"
        v-on:vdropzone-removed-file="removeFile"
      ></vue-dropzone>
      <div class="btn-icon">
        <b-button type="submit" variant="primary" class="mt-4" size="lg">
          <i class="iconsminds-upload-1"></i>
          Cargar Cotización
          <!-- {{ $t('forms.submit') }} -->
        </b-button>
      </div>
    </b-form>
    <info-cotizacion :data="data" v-else />
  </b-card>
</template>
<script>
import GlideComponent from "../Carousel/GlideComponent";
import IconCard from "../Cards/IconCard";
import vSelect from "vue-select";
import moment from "moment-timezone";
import "vue-select/dist/vue-select.css";
import vue2Dropzone from "vue2-dropzone";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import ServicesCore from "./../../services/service";
import InfoCotizacion from "./InfoCotizacion";

export default {
  props: ["clickedNext", "currentStep", "data"],
  components: {
    "vue-dropzone": vue2Dropzone,
    "v-select": vSelect,
    "glide-component": GlideComponent,
    "icon-card": IconCard,
    "info-cotizacion": InfoCotizacion
  },
  mixins: [validationMixin],
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
  validations: {
    newOrden: {
      observacion: {
        required
      }
    }
  },
  watch: {
    clickedNext(val) {
      //console.log("Clicked second step next :::>", val);
      if (val === true) {
        //console.log("Orden a crearDB ::::>", this.orden);
        //this.$v.newOrden.$touch();
      }
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
    removeFile(file, error, xhr) {
      this.filesEtapa = this.filesEtapa.filter(value => {
        value.key != file.s3Signature.key;
      });
      console.log("Se removio el file ::::>", this.filesEtapa);
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
          Observaciones: this.newOrden.observacion,
          documentos: this.filesEtapa,
          estado: "Pendiente"
        };
        console.log("Se va a agregar la siguiente orden ::>", orden);

        ServicesCore.createOrden(orden)
          .then(response => {
            if (response.status == 200) {
              //this.loadItems();

              ServicesCore.getOrdenById(response.data.orden.IdOrdenTrabajo)
                .then(response => {
                  if (response.status == 200) {
                    this.newOrden = {
                      mecanico: null,
                      observacion: null
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
                    console.log("Data geto orden By Id :::>", response.data);
                    this.data.etapa = response.data;
                    this.$emit("can-continue", { value: true });
                    this.$forceUpdate();
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
  },
  mounted() {
    console.log("Data :::>", this.data);
    if (this.data.etapa) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  }
};
</script>
