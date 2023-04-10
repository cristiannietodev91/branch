<template>
  <div>
    <div
      v-if="data.olderCotizaciones != null"
      class="card mb-4"
      :title="$t('branch.orden.cotizacionrechadaza')"
    >
      <div v-for="(orden,index) in data.olderCotizaciones" :key="index" class="border">
        <a
          class="btn btn-link" 
          data-bs-toggle="collapse" href="#collapseAccordion1" role="button" aria-expanded="false"
          aria-controls="collapseAccordion1"
        >
          Cotización {{ index+1 }}
        </a>
        <div id="collapseAccordion1" class="collapse">
          <div class="row m-3">
            <div class="col col-3">
              <p class="text-muted text-small mb-2">
                {{ $t('branch.orden.fechaIngreso') }}
              </p>
              <h5
                class="mb-1 card-subtitle truncate"
              >
                {{ dateTime(orden.createdAt) }}
              </h5>
            </div>
            <div v-if="data.etapa.mecanico" class="col col-3">
              <p class="text-muted text-small mb-2">
                {{ $t('branch.orden.mecanico') }}
              </p>
              <h5
                class="mb-1 card-subtitle truncate"
              >
                {{ orden.mecanico.identificacion }} {{ orden.mecanico.fullName }}
              </h5>
            </div>
            <div class="col">
              <p class="text-muted text-small mb-2">
                {{ $t('branch.orden.observaciones') }}
              </p>
              <h5 class="mb-1 card-subtitle truncate">
                {{ orden.Observaciones }}
              </h5>
            </div>
            <div class="col">
              <p class="text-muted text-small mb-2">
                {{ $t('branch.orden.observaciones') }}
              </p>
              <h5 class="mb-1 card-subtitle truncate">
                {{ orden.estado }}
              </h5>
            </div>
            <div
              v-for="(documento,docIndx) in orden.documentos"
              :key="`contact${docIndx}`"
              class="branch-image"
            >
              <div class="card">
                <a :href="documento.url" target="_blank">
                  <img
                    alt="Thumbnail"
                    src="/assets/img/pdflogo.jpg"
                    class="list-thumbnail responsive border-0"
                  >
                  <p class="card-text">
                    <span>{{ documento.nombrearchivo }}</span>
                    <span>{{ dateTime(documento.date) }}</span>
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col col-3">
        <p class="text-muted text-small mb-2">
          {{ $t('branch.orden.fechaIngreso') }}
        </p>
        <h5
          class="mb-1 card-subtitle truncate"
        >
          {{ dateTime(data.etapa.createdAt) }}
        </h5>
      </div>
      <div v-if="data.etapa.mecanico" class="col col-3">
        <p class="text-muted text-small mb-2">
          {{ $t('branch.orden.mecanico') }}
        </p>
        <h5
          class="mb-1 card-subtitle truncate"
        >
          {{ data.etapa.mecanico.identificacion }} {{ data.etapa.mecanico.fullName }}
        </h5>
      </div>
      <div class="col col-3">
        <p class="text-muted text-small mb-2">
          {{ $t('branch.orden.observaciones') }}
        </p>
        <h5 class="mb-1 card-subtitle truncate">
          {{ data.etapa.Observaciones }}
        </h5>
      </div>
      <div class="col">
        <p class="text-muted text-small mb-2">
          {{ $t('branch.orden.observaciones') }}
        </p>
        <h5 class="mb-1 card-subtitle truncate">
          {{ data.etapa.estado }}
        </h5>
      </div>
      <div class="col">
        <p class="text-muted text-small mb-2">
          {{ $t('branch.orden.nrcotizacionrechadaza') }}
        </p>
        <h5
          class="mb-1 card-subtitle truncate"
        >
          {{ data.olderCotizaciones ? data.olderCotizaciones.length : 0 }}
        </h5>
      </div>
    </div>
    <div class="icon-cards-row">
      <div class="branch-gallery">
        <div id="collapse-cotizacion" class="collapse">
          <div
            v-for="(documento,index) in data.etapa.documentos"
            :key="`contact${index}`"
            class="branch-image"
          >
            <div class="card">
              <a :href="documento.url" target="_blank">
                <img
                  alt="Thumbnail"
                  src="/assets/img/pdflogo.jpg"
                  class="list-thumbnail responsive border-0"
                >
                <p class="card-text">
                  <span>{{ documento.nombrearchivo }}</span>
                  <span>{{ dateTime(documento.date) }}</span>
                </p>
              </a>
            </div>
          </div>
        </div>
        <button
          type="button" class="btn btn-primary m-1" data-bs-toggle="collapse"
          data-bs-target="#collapse-cotizacion" aria-expanded="false" aria-controls="collapse-cotizacion"
        >
          Ver cotizaciones
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: ["data"],
  created() {},
  methods: {
    dateTime(value) {
      return moment(value).format('D MMMM YYYY hh:mm A');
    },
  }
};
</script>

<style>
</style>
