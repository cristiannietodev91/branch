<template>
  <b-card class="mb-4" no-body>
    <div>
      <b-row>
        <b-colxx md="6" sm="6" lg="6" xxs="12">
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.fechaIngreso') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ dateTime(data.createdAt) }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.mecanico') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.mecanico.firstName }} {{ data.mecanico.lastName }}
          </h5>
        </b-colxx>
        <b-colxx md="6" sm="6" lg="6" xxs="12">
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.kilometraje') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.kilometraje }} KM
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.documentos') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            <b-badge
              v-for="(documento) in JSON.parse(data.DocumentosDeja)" :key="`${documento}`" pill variant="primary"
              class="m-1"
            >
              {{ documento }}
            </b-badge>
          </h5>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx md="12" sm="12" lg="12" xxs="12">
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.observaciones') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.Observaciones }}
          </h5>
        </b-colxx>
      </b-row>
    </div>
  </b-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import moment from 'moment';

export default {
  name: "ingreso-step",
  mixins: [validationMixin],
  props: ["clickedNext", "currentStep", "data"],
  data() {
    return {
      text: "Completed"
    };
  },
  watch: {
    currentStep(val) {
      console.log("Actual paso :::>", val);
    },
    clickedNext(val) {
      console.log("Clicked next val :::>", val);
      this.$emit("can-continue", { value: val });
    }
  },
  mounted() {
    this.$emit("can-continue", { value: true });
  },
  methods: {
    dateTime(value) {
      return moment(value).format('D MMMM YYYY hh:mm A');
    },
  }
};
</script>