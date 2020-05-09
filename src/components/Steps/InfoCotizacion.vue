<template>
  <div >
    <b-card class="mb-4" :title="$t('branch.orden.cotizacionrechadaza')">
            <div class="border" v-for="(orden,index) in data.olderCotizaciones"
                  :key="index">
                <b-button v-b-toggle.collapseAccordion1 variant="link">Cotización {{index+1}}</b-button>
                <b-collapse id="collapseAccordion1" accordion="my-accordion">
                    <b-row class="m-3">
                      <b-colxx xxs="3">
                        <p class="text-muted text-small mb-2">
                          {{$t('branch.orden.fechaIngreso')}}
                        </p>
                        <h5 class="mb-1 card-subtitle truncate">
                          {{ orden.createdAt | moment("D MMMM YYYY hh:mm A") }}
                        </h5>
                      </b-colxx>
                      <b-colxx xxs="3" v-if="data.etapa.mecanico">
                        <p class="text-muted text-small mb-2">
                          {{$t('branch.orden.mecanico')}}
                        </p>
                        <h5 class="mb-1 card-subtitle truncate">
                          {{orden.mecanico.identificacion}} {{orden.mecanico.fullName}}
                        </h5>
                      </b-colxx>
                      <b-colxx>
                        <p class="text-muted text-small mb-2">
                          {{$t('branch.orden.observaciones')}}
                        </p>
                        <h5 class="mb-1 card-subtitle truncate">
                          {{orden.Observaciones}}
                        </h5>
                      </b-colxx>
                      <b-colxx>
                        <p class="text-muted text-small mb-2">
                          {{$t('branch.orden.observaciones')}}
                        </p>
                        <h5 class="mb-1 card-subtitle truncate">
                          {{orden.estado}}
                        </h5>
                      </b-colxx>
                      <div class="branch-image" v-for="(documento,index) in orden.documentos" :key="`contact${index}`">
                      <b-card no-body>
                      <b-link :href="documento.url" target="_blank"> 
                        <img alt="Thumbnail" src="/assets/img/pdflogo.jpg" class="list-thumbnail responsive border-0" />
                        <b-card-text>
                          <span>{{documento.nombrearchivo}}</span>
                          <span>{{ documento.date | moment("D MMMM YYYY hh:mm A") }}</span>
                        </b-card-text>
                      </b-link>
                      </b-card>
                      </div>                       
                    </b-row>
                </b-collapse>
            </div>           
      </b-card>
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
        <b-colxx>
          <p class="text-muted text-small mb-2">
            {{$t('branch.orden.observaciones')}}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{data.etapa.estado}}
          </h5>
        </b-colxx> 
        <b-colxx>
          <p class="text-muted text-small mb-2">
            {{$t('branch.orden.nrcotizacionrechadaza')}}
          </p>
          <h5 class="mb-1 card-subtitle truncate">
            {{data.olderCotizaciones.length}}
          </h5>
        </b-colxx> 
      </b-row>
      <div class="icon-cards-row">
        <div class="branch-gallery">
          <b-collapse id="collapse-cotizacion">
            <div class="branch-image" v-for="(documento,index) in data.etapa.documentos" :key="`contact${index}`">
              <b-card no-body>
                <b-link :href="documento.url" target="_blank"> 
                  <img alt="Thumbnail" src="/assets/img/pdflogo.jpg" class="list-thumbnail responsive border-0" />
                  <b-card-text>
                    <span>{{documento.nombrearchivo}}</span>
                    <span>{{ documento.date | moment("D MMMM YYYY hh:mm A") }}</span>
                  </b-card-text>
                </b-link>
              </b-card>
            </div>
          </b-collapse>
          <b-button v-b-toggle="'collapse-cotizacion'" class="m-1">
            Ver cotizaciones
          </b-button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    props: [ "data"],
}
</script>

<style>

</style>