<template>
  <div class="card mb-4">
    <!-- <router-link to="?" class="d-flex">
      <div
        src="/assets/img/profile-pic-l.jpg"
        alt="Card image cap"
        class="align-self-center list-thumbnail-letters rounded-circle m-4 small"
      >INGRESO</div>
    </router-link> -->
    <div v-if="data.etapa" class="container">
      <div class="row">
        <div class="col col-12 col-sm-6 col-md-6 col-lg-6">
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.fechaAprobacion') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ dateTime(data.etapa.createdAt) }}
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.mecanico') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.etapa.mecanico.fullName }}
          </h5>
        </div>
        <div class="col col-12 col-sm-6 col-md-6 col-lg-6">
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.kilometraje') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.etapa.kilometraje }} KM
          </h5>
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.documentos') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.etapa.DocumentosDeja }}
          </h5>
        </div>
      </div>
      <div class="row">
        <div class="col col-12">
          <p class="text-muted text-small mb-2">
            {{ $t('branch.orden.observaciones') }}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{ data.etapa.Observaciones }}
          </h5>
        </div>
      </div>
      -
    </div>    
    <div v-else class="container">
      <h5 class="mb-1 card-subtitle truncate">
        {{ $t('branch.orden.sinetapa') }}
      </h5>
    </div>    
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: "aprobacion-step",
  props: ["clickedNext", "currentStep", "data"],
  data() {
    return {
      text: "Completed"
    };
  },
  watch: {
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