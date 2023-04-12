<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col col-12 col-sm-6 col-md-6 col-lg-6">
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
        </div>
        <div class="col col-12 col-sm-6 col-md-6 col-lg-6">
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
            <span
              v-for="(documento) in JSON.parse(data.DocumentosDeja)" :key="`${documento}`" pill variant="primary"
              class="badge m-1"
            >
              {{ documento }}
            </span>
          </h5>
        </div>
      </div>
      <div class="row">
        <div class="col col-12">
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.observaciones') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.Observaciones }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';

export default {
  name: "ingreso-step",
  props: ["clickedNext", "currentStep", "data"],
  data() {
    return {
      text: "Completed"
    };
  },
  watch: {
    currentStep() {
    },
    clickedNext(val) {
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