<template>
  <b-card class="mb-4 flex-row" no-body>
    <router-link to="?" class="d-flex">
      <div
        src="/assets/img/profile-pic-l.jpg"
        alt="Card image cap"
        class="align-self-center list-thumbnail-letters rounded-circle m-4 small"
      >INGRESO</div>
    </router-link>
    
    <b-colxx xxs="3">
      <p class="text-muted text-small mb-2">{{$t('branch.orden.fechaIngreso')}}</p>
      <p class="mb-3">{{data.createdAt}}</p>
      <p class="text-muted text-small mb-2">{{$t('branch.orden.mecanico')}}</p>
      <p class="mb-3">{{data.mecanico.identificacion}} {{data.mecanico.firstName}}</p>
    </b-colxx>
    <b-colxx xxs="3">
      <p class="text-muted text-small mb-2">{{$t('branch.orden.kilometraje')}}</p>
      <p class="mb-3">{{data.kilometraje}} KM</p>
      <p class="text-muted text-small mb-2">{{$t('branch.orden.documentos')}}</p>
      <p class="mb-3">{{data.DocumentosDeja}}</p>
    </b-colxx>
    <b-colxx>
      <p class="text-muted text-small mb-2">{{$t('branch.orden.observaciones')}}</p>
      <p class="mb-3">{{data.Observaciones}}</p>
    </b-colxx>
  </b-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  props: ["clickedNext", "currentStep", "data"],
  mixins: [validationMixin],
  data() {
    return {
      text: "Completed"
    };
  },
  watch: {
    currentStep(val) {
      console.log("Actual paso :::>", val);
    },
    /*$v: {
      handler: function(val) {
        this.$emit("can-continue", { value: true });    
        /*if (!val.$invalid) {
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
        }
      },
      deep: true
    },*/
    clickedNext(val) {
      console.log("Clicked next val :::>", val);
      this.$emit("can-continue", { value: val });
      /*if (val === true) {
        return true;
      }*/
    }
  },
  mounted() {
    //console.log('Clicked mounted :::>');
    this.$emit("can-continue", { value: true });
    //this.$emit("can-continue", { value: true });
    /*if (!this.$v.$invalid) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }*/
  }
};
</script>