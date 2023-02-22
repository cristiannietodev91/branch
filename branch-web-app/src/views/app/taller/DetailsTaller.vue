<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{ $t("menu.taller") }}</h1>
        <piaf-breadcrumb />
        <b-card title="Card Title" no-body>
          <b-card-header header-tag="nav">
            <b-nav tabs>
              <b-nav-item
                to="/app/taller/detailTaller"
                exact
                exact-active-class="active"
              >
                {{ $t("branch.cita.cita") }}
              </b-nav-item>
              <b-nav-item
                to="/app/taller/detailTaller/mecanicos"
                exact
                exact-active-class="active"
              >
                {{ $t("pages.branch.mecanicos") }}
              </b-nav-item>
              <b-nav-item
                to="/app/taller/detailTaller/ordenes"
                exact
                exact-active-class="active"
              >
                {{ $t("pages.branch.ordentrabajo") }}
              </b-nav-item>
              <b-nav-item
                to="/app/taller/detailTaller/info"
                exact
                exact-active-class="active"
              >
                {{ $t("pages.details") }}
              </b-nav-item>
            </b-nav>
          </b-card-header>
        </b-card>
        <b-card-body>
          <router-view />
        </b-card-body>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isLoad: false
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser"
    })
  },
  created() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    }
  }
};
</script>

<style></style>
