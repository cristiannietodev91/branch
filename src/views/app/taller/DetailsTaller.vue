<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{ $t("menu.taller") }}</h1>
        <div class="top-right-button-container">
          <b-button
            v-b-modal.modalAddMecanico
            variant="primary"
            size="lg"
            class="top-right-button"
            >{{ $t("pages.branch.add-new-mecanico") }}</b-button
          >
          <modal-add-mecanico :taller="taller"></modal-add-mecanico>
        </div>
        <piaf-breadcrumb />
        <b-card title="Card Title" no-body>
          <b-card-header header-tag="nav">
            <b-nav tabs>
              <b-nav-item
                to="/app/taller/detailTaller"
                exact
                exact-active-class="active"
                >{{ $t("branch.cita.cita") }}
              </b-nav-item>
              <b-nav-item
                to="/app/taller/detailTaller/mecanicos"
                exact
                exact-active-class="active"
                >{{ $t("pages.branch.mecanicos") }}
              </b-nav-item>
              <b-nav-item
                to="/app/taller/detailTaller/ordenes"
                exact
                exact-active-class="active"
                >{{ $t("pages.branch.ordentrabajo") }}</b-nav-item
              >
              <b-nav-item
                to="/app/taller/detailTaller/info"
                exact
                exact-active-class="active"
                >{{ $t("pages.details") }}</b-nav-item
              >
            </b-nav>
          </b-card-header>
        </b-card>
        <b-card-body>
          <router-view></router-view>
        </b-card-body>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalAddMecanico from "../../../components/Modals/addmecanicomodal";
import ServicesCore from "../../../services/service";

export default {
  components: {
    "modal-add-mecanico": ModalAddMecanico
  },
  data() {
    return {
      isLoad: false,
      taller: {}
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser"
    })
  },
  methods: {
    hideModal(refname) {
      this.$refs[refname].hide();
    }
  },
  created() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
    ServicesCore.getTallerById(this.currentUser.IdTaller).then(response => {
      if (response.status == 200) {
        this.taller = response.data;
      }
    });
  }
};
</script>

<style></style>
