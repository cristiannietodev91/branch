<template>
  <b-row>
    <b-row class="m-3">
      <div class="d-flex align-items-center navbar-left">
        <div
          :class="{ search: true, 'mobile-view': isMobileSearch }"
          ref="searchContainer"
          @mouseenter="isSearchOver = true"
          @mouseleave="isSearchOver = false"
        >
          <b-input
            :placeholder="$t('menu.search')"
            @keypress.native.enter="search"
            v-model="searchKeyword"
          />
          <span class="search-icon" @click="searchClick">
            <i class="simple-icon-magnifier"></i>
          </span>
        </div>
      </div>
    </b-row>
    <b-row>
      <b-colxx
        xxs="12"
        class="ordenes-branch"
        v-for="(orden, ordenIndex) in ordenes"
        :key="`orden_${ordenIndex}`"
      >
        <orden-card :data="orden" :mecanicos="taller.mecanicos" />
      </b-colxx>
    </b-row>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import OrdenCard from "../../../components/Cards/OrdenCard";
import ServicesCore from "../../../services/service";

export default {
  components: {
    "orden-card": OrdenCard
  },
  data() {
    return {
      searchKeyword: "",
      isMobileSearch: false,
      ordenes: [],
      taller: {}
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser"
    })
  },
  created() {
    ServicesCore.getTallerById(this.currentUser.IdTaller).then(response => {
      if (response.status == 200) {
        this.taller = response.data;
      }
    });
    if (this.$route.params.cita) {
      ServicesCore.getOrdenesByIdTallerAndIdCita(
        this.currentUser.IdTaller,
        this.$route.params.cita
      )
        .then(response => {
          if (response.status == 200) {
            this.formatOrdenes(response.data);
          }
        })
        .catch(error => {
          this.$notify("error filled", "ERROR", error.response.data.error, {
            duration: 3000,
            permanent: false
          });
        });
    }
  },
  methods: {
    search() {
      //this.$router.push(`${this.searchPath}?search=${this.searchKeyword}`)
      ServicesCore.getOrdenesByIdTallerAndFilter(
        this.currentUser.IdTaller,
        this.searchKeyword
      )
        .then(async response => {
          if (response.status == 200) {
            this.formatOrdenes(response.data);
          }
        })
        .catch(error => {
          this.$notify("error filled", "ERROR", error.response.data.error, {
            duration: 3000,
            permanent: false
          });
        });
    },
    async formatOrdenes(data) {
      let ordenList = [];
      let codeorden = "";
      let objMyOrden = null;
      for await (const orden of data) {
        if (orden.CodigoOrden != codeorden) {
          codeorden = orden.CodigoOrden;
          objMyOrden = {
            CodigoOrden: orden.CodigoOrden,
            IdTaller: orden.IdTaller,
            IdCita: orden.IdCita,
            IdVehiculo: orden.IdVehiculo,
            vehiculo: orden.vehiculo,
            taller: orden.taller,
            etapas: [],
            olderCotizaciones: []
          };
          let etapa = {
            CodigoOrden: orden.CodigoOrden,
            IdOrdenTrabajo: orden.IdOrdenTrabajo,
            IdEtapa: orden.IdEtapa,
            IdMecanico: orden.IdMecanico,
            kilometraje: orden.kilometraje,
            DocumentosDeja: orden.DocumentosDeja,
            Observaciones: orden.Observaciones,
            createdAt: orden.createdAt,
            mecanico: orden.mecanico,
            etapa: orden.etapa,
            documentos: orden.documentos,
            estado: orden.estado
          };
          objMyOrden.etapas.push(etapa);

          if (orden.estado == "Rechazado") {
            objMyOrden.olderCotizaciones.push(etapa);
          }

          ordenList.push(objMyOrden);
        } else {
          //Si es la misma orden agrega la etapa unicamanete
          let etapa = {
            CodigoOrden: orden.CodigoOrden,
            IdOrdenTrabajo: orden.IdOrdenTrabajo,
            IdEtapa: orden.IdEtapa,
            IdMecanico: orden.IdMecanico,
            kilometraje: orden.kilometraje,
            DocumentosDeja: orden.DocumentosDeja,
            Observaciones: orden.Observaciones,
            createdAt: orden.createdAt,
            mecanico: orden.mecanico,
            etapa: orden.etapa,
            documentos: orden.documentos,
            estado: orden.estado
          };
          if (orden.estado != "Rechazado") {
            ordenList[ordenList.length - 1].etapas.push(etapa);
          } else {
            ordenList[ordenList.length - 1].olderCotizaciones.push(etapa);
          }
          //objMyOrden.etapas.push(etapa);
        }
      }

      this.ordenes = ordenList;
    },
    searchClick() {
      if (window.innerWidth < this.menuHiddenBreakpoint) {
        if (!this.isMobileSearch) {
          this.isMobileSearch = true;
        } else {
          this.search();
          this.isMobileSearch = false;
        }
      } else {
        this.search();
      }
    }
  }
};
</script>

<style></style>
