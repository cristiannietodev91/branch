<template>
  <b-card class="mb-4" no-body>

    <!-- <router-link to="?" class="d-flex">
      <div
        src="/assets/img/profile-pic-l.jpg"
        alt="Card image cap"
        class="align-self-center list-thumbnail-letters rounded-circle m-4 small"
      >INGRESO</div>
    </router-link> -->
    <div>
      <b-row>
        <b-colxx md="6" sm="6" lg="6" xxs="12">
          <p class="text-muted text-small mb-2">{{$t('branch.orden.fechaIngreso')}}</p>
          <h5 class="mb-1 card-subtitle truncate">{{ data.createdAt | moment("D MMMM YYYY hh:mm A") }}</h5>
          <p class="text-muted text-small mb-2">{{$t('branch.orden.mecanico')}}</p>
          <h5 class="mb-1 card-subtitle truncate">{{data.mecanico.firstName}} {{data.mecanico.lastName}}</h5>
          <!-- <h5 class="mb-1 card-subtitle truncate">{{data.mecanico.identificacion}} {{data.mecanico.firstName}}</h5> -->
        </b-colxx>
        <b-colxx md="6" sm="6" lg="6" xxs="12">
          <p class="text-muted text-small mb-2">{{$t('branch.orden.kilometraje')}}</p>
          <h5 class="mb-1 card-subtitle truncate">{{data.kilometraje}} KM</h5>
          <p class="text-muted text-small mb-2">{{$t('branch.orden.documentos')}}</p>
          <h5 class="mb-1 card-subtitle truncate">
            <b-badge pill variant="primary" v-for="(documento) in  JSON.parse(data.DocumentosDeja)" :key="`${documento}`" class="m-1">{{documento}}</b-badge>
          </h5>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx md="12" sm="12" lg="12" xxs="12">
          <p class="text-muted text-small mb-2">{{$t('branch.orden.observaciones')}}</p>
          <h5 class="mb-1 card-subtitle truncate">{{data.Observaciones}}</h5>
        </b-colxx>
      </b-row>
    </div>
  </b-card>
</template>
<script>
import { validationMixin } from "vuelidate";

export default {
  name: "IngresoStep",
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