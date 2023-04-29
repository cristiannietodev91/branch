<template>
  <div>
    <div class="row m-3">
      <div class="search-container">
        <div
          ref="searchContainer"
          :class="{ search: true, 'mobile-view': isMobileSearch }"
          @mouseenter="isSearchOver = true"
          @mouseleave="isSearchOver = false"
        >
          <input
            v-model="searchKeyword"
            class="form-control"
            :placeholder="$t('menu.search')"
            @keypress.enter="search"
          >
          <span class="search-icon" @click="searchClick">
            <i class="simple-icon-magnifier" />
          </span>
        </div>
      </div>
    </div>
    <div class="row">
      <div
        v-for="(order) in Object.keys(workOrdersByOrderCode)"
        :key="`orden_${order}`"
        class="col col-12 ordenes-branch"
      >
        <orden-card :workOrder="order" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import OrdenCard from "../../../components/Cards/OrdenCard";
import ServicesCore from "../../../services/service";

export default {
  name: "ordenes-workshop",
  components: {
    "orden-card": OrdenCard
  },
  data() {
    return {
      searchKeyword: "",
      isMobileSearch: false,
      ordenes: [],
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser",
      workOrdersByOrderCode: "workOrdersByOrderCode",
    })
  },
  created() {
    if (this.$route.params.cita) {
      ServicesCore.getOrdenesByIdTallerAndIdCita(
        this.currentUser.IdTaller,
        this.$route.params.cita
      )
        .catch(error => {
          this.$notify({
            title: "ERROR",
            type: "error",
            duration: 3000,
            permanent: false,
            text: error.response.data.error
          });
        });
    }
  },
  methods: {
    search() {
      ServicesCore.getOrdenesByIdTallerAndFilter(
        this.currentUser.IdTaller,
        this.searchKeyword
      )
        .catch(error => {
          this.$notify({
            title: "ERROR",
            type: "error",
            duration: 3000,
            permanent: false,
            text: error.response.data.error
          });
        });
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
