<template>
  <b-row>
    <b-colxx xl="12" lg="12" class="mb-4">
      <b-card class="mb-4 detalle-taller">
        <div class="position-absolute card-top-buttons">
          <b-button class="icon-button" v-b-modal.modalEditTaller>
            <i class="simple-icon-pencil" />
          </b-button>
          <modal-edit-taller
            :taller="taller"
            v-if="taller.IdTaller"
            @loadInfoTaller="loadInfoTaller"
          ></modal-edit-taller>
        </div>
        <b-row>
          <b-colxx class="logo-taller">
            <img
              :alt="taller.email"
              :src="taller.logo || '/assets/img/preload.gif'"
              class="card-img-top-2"
            />
          </b-colxx>
          <b-colxx>
            <h5 class="mb-1 card-subtitle truncate">{{ taller.nombre }}</h5>
            <p class="text-muted text-small mb-2">{{ $t("branch.taller.nombreTaller") }}</p>
            <h5 class="mb-1 card-subtitle truncate">{{ taller.identificacion }}</h5>
            <p class="text-muted text-small mb-2">{{ $t("branch.taller.identificacion") }}</p>
            <h5 class="mb-1 card-subtitle truncate">{{ taller.celular }}</h5>
            <p class="text-muted text-small mb-2">{{ $t("branch.taller.celular") }}</p>
          </b-colxx>
          <b-colxx>
            <h5 class="mb-1 card-subtitle truncate">{{ taller.email }}</h5>
            <p class="text-muted text-small mb-2">{{ $t("branch.taller.email") }}</p>
            <h5 class="mb-1 card-subtitle truncate">{{ taller.direccion }}</h5>
            <p class="text-muted text-small mb-2">{{ $t("branch.taller.direccion") }}</p>
          </b-colxx>
        </b-row>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import ServicesCore from "../../../services/service";
import ModalEditTaller from "../../../components/Modals/editInfoTallermodal";

export default {
  components: {
    "modal-edit-taller": ModalEditTaller
  },
  data() {
    return {
      taller: {}
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser"
    })
  },
  mounted() {
    this.loadInfoTaller();
  },
  methods: {
    loadInfoTaller() {
      ServicesCore.getTallerById(this.currentUser.IdTaller).then(response => {
        if (response.status == 200) {
          this.taller = response.data;
        }
      });
    }
  }
};
</script>

<style></style>
