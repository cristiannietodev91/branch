<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.analytics')" />
        <div class="separator mb-5" />
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xl="6" lg="12">
        <div class="icon-cards-row">
          <glide-component :settings="glideIconsOption">
            <icon-card
              :title="$t('dashboards.clients')"
              icon="iconsminds-male"
              :value="cantidadClientes"
            />
            <icon-card
              :title="$t('dashboards.vehiculos')"
              icon="iconsminds-car"
              :value="cantidadVehiculos"
            />
            <icon-card
              :title="$t('dashboards.citasSolicitadas')"
              icon="iconsminds-calendar-4"
              :value="cantidadCitas"
            />
            <icon-card
              :title="$t('dashboards.ordenenesCurso')"
              icon="iconsminds-redirect"
              :value="cantidadOrdenes"
            />
          </glide-component>
        </div>

        <b-card :title="$t('dashboards.citasByMonth')">
          <div class="dashboard-line-chart">
            <line-shadow-chart v-if="loadedLineChartCitas" :data="lineChartCitas" :height="300" />
          </div>
        </b-card>
      </b-colxx>
      <b-colxx lg="4" md="12" class="mb-4">
        <b-card :title="$t('dashboards.citasByState')">
          <div class="dashboard-donut-chart">
            <polar-area-shadow-chart
              v-if="loadedpolarAreaCitasByEstado"
              :data="polarAreaCitasByEstado"
              :height="270"
            />
          </div>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GlideComponent from "../../../components/Carousel/GlideComponent";
import IconCard from "../../../components/Cards/IconCard";
import ServicesCore from "../../../services/service";
import LineShadowChart from "../../../components/Charts/LineShadowCitas";
import PolarAreaShadowChart from "../../../components/Charts/PolarAreaShadow";
import { ThemeColors } from "../../../utils";
const colors = ThemeColors();

export default {
  components: {
    "glide-component": GlideComponent,
    "icon-card": IconCard,
    "line-shadow-chart": LineShadowChart,
    "polar-area-shadow-chart": PolarAreaShadowChart
  },
  data() {
    return {
      cantidadClientes: 0,
      cantidadVehiculos: 0,
      cantidadCitas: 0,
      cantidadOrdenes: 0,
      loadedLineChartCitas: false,
      lineChartCitas: {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
            borderColor: colors.themeColor1,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.themeColor1,
            pointHoverBackgroundColor: colors.themeColor1,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 6,
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            fill: false
          }
        ]
      },
      loadedpolarAreaCitasByEstado: false,
      polarAreaCitasByEstado: {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
            borderWidth: 2,
            borderColor: [
              colors.themeColor1,
              colors.themeColor2,
              colors.themeColor3
            ],
            backgroundColor: [
              colors.themeColor1_10,
              colors.themeColor2_10,
              colors.themeColor3_10
            ]
          }
        ]
      },
      glideIconsOption: {
        gap: 5,
        perView: 4,
        type: "carousel",
        breakpoints: {
          320: {
            perView: 1
          },
          576: {
            perView: 2
          },
          1600: {
            perView: 3
          },
          1800: {
            perView: 4
          }
        },
        hideNav: true
      }
    };
  },
  computed: {
    ...mapGetters({ currentUser: "currentUser" })
  },
  created() {
    ServicesCore.countVehiculosByTaller(this.currentUser.IdTaller)
      .then(response => {
        if (response.status == 200) {
          this.cantidadVehiculos = response.data;
        }
      })
      .catch(error => {
        this.$notify("error filled", "ERROR", error.response.data.error, {
          duration: 3000,
          permanent: false
        });
      });
    ServicesCore.countClientesByTaller(this.currentUser.IdTaller)
      .then(response => {
        if (response.status == 200) {
          this.cantidadClientes = response.data;
        }
      })
      .catch(error => {
        this.$notify("error filled", "ERROR", error.response.data.error, {
          duration: 3000,
          permanent: false
        });
      });

    ServicesCore.countCitasByTaller(this.currentUser.IdTaller)
      .then(response => {
        if (response.status == 200) {
          this.cantidadCitas = response.data;
        }
      })
      .catch(error => {
        this.$notify("error filled", "ERROR", error.response.data.error, {
          duration: 3000,
          permanent: false
        });
      });

    ServicesCore.countOrdenesByTaller(this.currentUser.IdTaller)
      .then(response => {
        if (response.status == 200) {
          this.cantidadOrdenes = response.data;
        }
      })
      .catch(error => {
        this.$notify("error filled", "ERROR", error.response.data.error, {
          duration: 3000,
          permanent: false
        });
      });
  },
  mounted() {
    ServicesCore.countCitasByTallerAndDate(this.currentUser.IdTaller)
      .then(response => {
        if (response.status == 200) {
          const { data } = response;
          data.map(cita => {
            this.lineChartCitas.labels.push(cita.date.substring(0, 10));
            this.lineChartCitas.datasets[0].data.push(cita.count);
          });
        }
      })
      .catch(error => {
        console.error(error);

        this.$notify("error filled", "ERROR", error.response.data.error, {
          duration: 3000,
          permanent: false
        });
      })
      .finally(() => {
        this.loadedLineChartCitas = true;
      });

    ServicesCore.countCitasByTallerAndEstado(this.currentUser.IdTaller)
      .then(response => {
        if (response.status == 200) {
          const { data } = response;
          data.map(cita => {
            this.polarAreaCitasByEstado.labels.push(cita.estado);
            this.polarAreaCitasByEstado.datasets[0].data.push(cita.count);
          });
        }
      })
      .catch(error => {
        console.error(error);

        this.$notify("error filled", "ERROR", error.response.data.error, {
          duration: 3000,
          permanent: false
        });
      })
      .finally(() => {
        this.loadedpolarAreaCitasByEstado = true;
      });
  }
};
</script>

<style>
</style>
