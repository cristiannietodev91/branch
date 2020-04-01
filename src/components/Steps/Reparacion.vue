<template>
  <b-card>
    <b-form @submit.prevent="onValitadeAddOrden" v-if="!data.etapa" class="p-5 w-90 ml-5">
      <b-form-group :label="$t('branch.orden.mecanico')">
        <v-select :options="data.mecanicos" v-model="newOrden.mecanico" label="fullName" :reduce="mecanico => mecanico.IdMecanico">
          <template #search="{attributes, events}">
            <input class="vs__search" :required="!newOrden.mecanico" v-bind="attributes" v-on="events"/>
          </template>
          <template v-slot:option="option">
            {{ option.fullName }} - {{option.identificacion}}
          </template>
        </v-select>
      </b-form-group>
      <b-form-group :label="$t('branch.orden.observaciones')">
        <b-textarea v-model.trim="$v.newOrden.observacion.$model" :state="!$v.newOrden.observacion.$error"></b-textarea>
        <b-form-invalid-feedback v-if="!$v.newOrden.observacion.required">
          {{$t('branch.forms.validations.required')}}
        </b-form-invalid-feedback>
      </b-form-group>
      <vue-dropzone ref="myVueDropzone" id="dropzone" :awss3="awss3" :options="dropzoneOptions" v-on:vdropzone-complete="complete" v-on:vdropzone-removed-file="removeFile"></vue-dropzone>
      <b-button type="submit" variant="primary" class="mt-4" size="lg">
        {{ $t('forms.submit') }}
      </b-button>
    </b-form>
    <div v-else>
      <b-row>
        <b-colxx xxs="3">
          <p class="text-muted text-small mb-2">
            {{$t('branch.orden.fechaIngreso')}}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.etapa.createdAt | moment("D MMMM YYYY hh:mm A") }}
          </h5>
        </b-colxx>
        <b-colxx xxs="3" v-if="data.etapa.mecanico">
          <p class="text-muted text-small mb-2">
            {{$t('branch.orden.mecanico')}}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{data.etapa.mecanico.identificacion}} {{data.etapa.mecanico.fullName}}
          </h5>
        </b-colxx>
        <b-colxx>
          <p class="text-muted text-small mb-2">
            {{$t('branch.orden.observaciones')}}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{data.etapa.Observaciones}}
          </h5>
        </b-colxx>
      </b-row>


      
      <div class="icon-cards-row">
        <div v-if="data.etapa.documentos" class="branch-gallery">
          <b-collapse id="collapse-diagnostico">
            <div class="branch-image" v-for="(documento,index) in data.etapa.documentos" :key="`contact${index}`">
              <b-card no-body>
                <single-lightbox :thumb="documento.url.replace('branchmedia','branchmedia-resized')" :large="documento.url" class-name="responsive" />
                <!-- <p class="list-item-heading mb-1 truncated">
                  {{documento.nombrearchivo}}
                </p> -->
                <b-card-text>
                  {{ documento.date | moment("D MMMM YYYY hh:mm A") }}
                </b-card-text>
              </b-card>
            </div>
          </b-collapse>
          <b-button v-b-toggle="'collapse-diagnostico'" class="m-1">
            Ver fotos de la reparación
          </b-button>
        </div>
        <div class="pl-2 d-flex flex-grow-1 min-width-zero" v-else>
          <b-card-body class="align-self-center d-flex min-width-zero">
            <p class="text-muted text-small mb-0 font-weight-light">Sin documentos asociados</p>
          </b-card-body>
        </div>
      </div>





    </div>
  </b-card>
</template>
<script>
import SingleLightbox from "../Pages/SingleLightbox";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import vue2Dropzone from "vue2-dropzone";
import moment from 'moment-timezone';
import GlideComponent from "../Carousel/GlideComponent";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import ServicesCore from "./../../services/service";


export default {
  props: ["clickedNext", "currentStep", "data"],
  components: {
    "single-lightbox": SingleLightbox,
    "vue-dropzone": vue2Dropzone,
    "v-select": vSelect,
    "glide-component": GlideComponent
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
        acceptedFiles: "image/*",
        thumbnailHeight: 160,
        maxFilesize: 2,
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
      if(response.status == 'success'){
        console.log("Se completo la subida de archivos :::>", response);
        let dateCreated = moment().tz('UTC').format();

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
    removeFile(file, error, xhr){
      this.filesEtapa = this.filesEtapa.filter((value)=> {
        value.key != file.s3Signature.key
      });
      console.log('Se removio el file ::::>',this.filesEtapa);
    },
    onValitadeAddOrden() {
      this.$v.$touch();
      // if its still pending or an error is returned do not submit
      if (this.$v.newOrden.$pending || this.$v.newOrden.$error) return;

      if (this.filesEtapa.length > 0) {
        let orden = {
          CodigoOrden: this.data.CodigoOrden,
          IdCita: this.data.IdCita,
          kilometraje: this.data.kilometraje,
          IdMecanico: this.newOrden.mecanico,
          IdTaller: this.data.IdTaller,
          IdEtapa: 6,
          Observaciones: this.newOrden.observacion,
          documentos: this.filesEtapa,
          estado: 'Aceptado'
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
          "Le recomendamos subir fotos al diagnostico",
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
    if (this.data.etapa) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  }
};
</script>