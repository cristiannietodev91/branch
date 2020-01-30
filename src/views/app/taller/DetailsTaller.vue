<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{ $t('menu.taller') }} {{ $route.params.IdTaller}}</h1>
        <div class="top-right-button-container">
          <b-dropdown
            id="ddown5"
            :text="$t('pages.actions')"
            size="lg"
            variant="outline-primary"
            class="top-right-button top-right-button-single"
            no-fade="true"
          >
            <b-dropdown-item>{{ $t('dashboards.last-week') }}</b-dropdown-item>
            <b-dropdown-item>{{ $t('dashboards.this-month') }}</b-dropdown-item>
          </b-dropdown>
        </div>
        <piaf-breadcrumb />
        <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
          <b-tab :title="$t('pages.details')">
            <b-card class="mb-4" no-body>
              <div class="position-absolute card-top-buttons">
                <b-button variant="outline-white" class="icon-button">
                  <i class="simple-icon-pencil" />
                </b-button>
              </div>
              <img
                :alt="taller.email"
                :src="taller.logo || '/assets/img/detail.jpg' "
                class="card-img-top-2"
              />
              <b-card-body>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.nombreTaller') }}</p>
                <p class="mb-3">{{taller.nombre}}</p>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.identificacion') }}</p>
                <div class="mb-3">{{taller.identificacion}}</div>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.celular') }}</p>
                <p class="mb-3">{{taller.celular}}</p>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.email') }}</p>
                <div class="mb-3">{{taller.email}}</div>
                <p class="text-muted text-small mb-2">{{ $t('branch.taller.direccion') }}</p>
                <div class="mb-3">{{taller.direccion}}</div>
              </b-card-body>
            </b-card>
          </b-tab>

          <b-tab :title="$t('pages.orders')">
            <b-row>
              <b-colxx>
                <order-item
                  v-for="(order,index) in orders"
                  :key="index"
                  :data="order"
                  detail-path="#"
                />
              </b-colxx>
            </b-row>
          </b-tab>
        </b-tabs>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import Stars from "../../../components/Common/Stars";
import RadialProgressCard from "../../../components/Cards/RadialProgressCard";
import SmallLineChartCard from "../../../components/Cards/SmallLineChartCard";
import AreaShadowChart from "../../../components/Charts/AreaShadow";
import CommentItem from "../../../components/Listing/CommentItem";
import OrderItem from "../../../components/Listing/OrderItem";

import {
  smallChartData1,
  smallChartData2,
  smallChartData3,
  smallChartData4,
  areaChartData
} from "../../../data/charts";
import { comments } from "../../../data/comments";
import orders from "../../../data/orders";

import ServicesCore from "../../../services/service";

export default {
  components: {
    stars: Stars,
    "radial-progress-card": RadialProgressCard,
    "small-line-chart-card": SmallLineChartCard,
    "area-shadow-chart": AreaShadowChart,
    "comment-item": CommentItem,
    "order-item": OrderItem
  },
  data() {
    return {
      isLoad: false,
      smallChartData1,
      smallChartData2,
      smallChartData3,
      smallChartData4,
      areaChartData,
      comments: comments.slice(0, 5),
      orders,
      taller: {}
    };
  },
  methods: {},
  mounted() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
    ServicesCore.getTallerById(this.$route.params.IdTaller).then(response => {
      if (response.status == 200) {
        this.taller = response.data;
      }
    });
  }
};
</script>
