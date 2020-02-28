<template>
  <b-card class="mb-4 flex-row">
    <b-form @submit.prevent="onValitadeAddOrden" v-if="!data.etapa">
      <vue-dropzone ref="myVueDropzone" id="dropzone"></vue-dropzone>
      <b-button type="submit" variant="primary">{{ $t('forms.submit') }}</b-button>
    </b-form>
    <div v-else>
      <b-row>
        <b-colxx xxs="3">
          <p class="text-muted text-small mb-2">{{$t('branch.orden.fechaIngreso')}}</p>
          <p class="mb-3">{{data.etapa.createdAt}}</p>
        </b-colxx>
        <b-colxx xxs="3">
          <p class="text-muted text-small mb-2">{{$t('branch.orden.mecanico')}}</p>
          <p class="mb-3">{{data.etapa.mecanico.identificacion}} {{data.etapa.mecanico.firstName}}</p>
        </b-colxx>
        <b-colxx>
          <p class="text-muted text-small mb-2">{{$t('branch.orden.observaciones')}}</p>
          <p class="mb-3">{{data.etapa.Observaciones}}</p>
        </b-colxx>
      </b-row>
    </div>
  </b-card>
</template>
<script>
import VueDropzone from 'vue2-dropzone'
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import ServicesCore from "./../../services/service";

export default {
  props: ["clickedNext", "currentStep", "data"],
  components: {
    'vue-dropzone': VueDropzone,
  },
  mixins: [validationMixin],
  data() {
    return {
      newOrden: {
        mecanico: null,
        observacion: ""
      },
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailHeight: 160,
        maxFilesize: 2,
        previewTemplate: this.dropzoneTemplate(),
        headers: {
          "My-Awesome-Header": "header value"
        }
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
    /*$v: {
      handler: function(val) {
        if (!val.$invalid) {
          this.$emit("can-continue", { value: true });
          
        } else {
          this.$emit("can-continue", { value: false });
        }
      },
      deep: true
    },*/
    clickedNext(val) {
      //console.log("Clicked second step next :::>", val);
      if (val === true) {
        //console.log("Orden a crearDB ::::>", this.orden);
        //this.$v.newOrden.$touch();
      }
    }
  },
  methods: {
    onValitadeAddOrden() {
      this.$v.$touch();
      // if its still pending or an error is returned do not submit
      if (this.$v.newOrden.$pending || this.$v.newOrden.$error) return;

      let orden = {
        CodigoOrden: this.data.CodigoOrden,
        IdCita: this.data.IdCita,
        kilometraje: this.data.kilometraje,
        mecanico: this.newOrden.mecanico,
        IdTaller: this.data.IdTaller,
        IdEtapa: 3,
        Observaciones: this.newOrden.observacion
      };

      console.log("Orden a enviar al servicio::>", orden);

      ServicesCore.createOrden(orden)
        .then(response => {
          if (response.status == 200) {
            //this.loadItems();
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
            this.$emit("can-continue", { value: true });
          }
        })
        .catch(error => {
          this.$emit("can-continue", { value: false });
          this.$notify("error filled", "ERROR", error.response.data.error, {
            duration: 3000,
            permanent: false
          });
        });
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