<template>
  <b-card >
    <b-form @submit.prevent="onValitadeAddOrden" v-if="!data.etapa" class="p-5 w-90 ml-5">
      <b-form-group :label="$t('branch.orden.mecanico')" >
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
      <b-form-group :label="$t('branch.orden.observaciones')">
        <b-textarea
          v-model.trim="$v.newOrden.observacion.$model"
          :state="!$v.newOrden.observacion.$error"
        ></b-textarea>
        <b-form-invalid-feedback
          v-if="!$v.newOrden.observacion.required"
        >{{$t('branch.forms.validations.required')}}</b-form-invalid-feedback>
      </b-form-group>
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        :awss3="awss3"
        :options="dropzoneOptions"
        v-on:vdropzone-complete="complete"
      ></vue-dropzone>
      <b-button type="submit" variant="primary" class="mt-4" size="lg">{{ $t('forms.submit') }}</b-button>
    </b-form>
    <div v-else>
      <b-row>
        <b-colxx xxs="3">
          <p class="text-muted text-small mb-2">{{$t('branch.orden.fechaIngreso')}}</p>
          <p class="mb-3">{{data.etapa.createdAt}}</p>
        </b-colxx>
        <b-colxx xxs="3" v-if="data.etapa.mecanico">
          <p class="text-muted text-small mb-2">{{$t('branch.orden.mecanico')}}</p>
          <p class="mb-3">{{data.etapa.mecanico.identificacion}} {{data.etapa.mecanico.firstName}}</p>
        </b-colxx>
        <b-colxx>
          <p class="text-muted text-small mb-2">{{$t('branch.orden.observaciones')}}</p>
          <p class="mb-3">{{data.etapa.Observaciones}}</p>
        </b-colxx>
      </b-row>
      <div class="icon-cards-row">
        <glide-component :settings="glideBasicOption" v-if="data.etapa.documentos">
          <div
            class="pr-3 pl-3 mb-4 glide__slide"
            v-for="(documento,index) in data.etapa.documentos"
            :key="`contact${index}`"
          >
            <b-card class="flex-row" no-body>
              <img alt="Thumbnail" :src="documento.url" class="list-thumbnail responsive border-0" />
              <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                <b-card-body class="align-self-center d-flex min-width-zero">
                  <p class="list-item-heading mb-1 truncated">{{documento.nombrearchivo}}</p>
                  <p
                    class="text-muted text-small mb-0 font-weight-light"
                  >{{ documento.date | moment("D MMMM YYYY hh mm A") }}</p>
                </b-card-body>
              </div>
            </b-card>
          </div>
        </glide-component>
        <div class="pl-2 d-flex flex-grow-1 min-width-zero" v-else>
          <b-card-body class="align-self-center d-flex min-width-zero">
            <p class="text-muted text-small mb-0 font-weight-light"> Sin documentos asociados</p>
          </b-card-body>
        </div>
      </div>
    </div>
  </b-card>
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import GlideComponent from "../Carousel/GlideComponent";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import ServicesCore from "./../../services/service";

export default {
  props: ["clickedNext", "currentStep", "data"],
  components: {
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
        url: "http://localhost:3000/file/send",
        thumbnailWidth: 150,
        autoProcessQueue: true,
        acceptedFiles: "image/*"
      },
      awss3: {
        signingURL: f => {
          // The server REST endpoint we setup earlier
          const key = `http://localhost:3000/file/send?filename=${f.name}`;
          // Save this for later use
          return key;
        },
        headers: {},
        params: {},
        sendFileToServer: true
      },
      glideBasicOption: {
        gap: 5,
        perView: 3,
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
      console.log("Se completo la subida de archivos :::>", response);
      let dateCreated = new Date();

      let documento = {
        nombrearchivo: response.name,
        url: response.s3ObjectLocation,
        type: response.type,
        date: dateCreated,
        size: response.size
      };
      this.filesEtapa.push(documento);
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
          mecanico: this.newOrden.mecanico,
          IdTaller: this.data.IdTaller,
          IdEtapa: 3,
          Observaciones: this.newOrden.observacion,
          documentos: this.filesEtapa
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