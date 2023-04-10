<template>
  <div class="row">
    <div class="col col-12 mb-4">
      <div class="card mb-4 detalle-taller">
        <div class="card-body">
          <div class="position-absolute card-top-buttons">
            <button
              type="button" class="btn icon-button"
              data-bs-toggle="modal" data-bs-target="#modalEditTaller"
            >
              <i class="simple-icon-pencil" />
            </button>
            <modal-edit-taller
              v-if="taller.IdTaller"
              :taller="taller"
              @loadInfoTaller="loadInfoTaller"
            />
          </div>
          <div class="row">
            <div class="col logo-taller">
              <img
                :alt="taller.email"
                :src="taller.logo || '/assets/img/preload.gif'"
                class="card-img-top-2"
              >
            </div>
            <div class="col">
              <h5 class="mb-1 card-subtitle truncate">
                {{ taller.nombre }}
              </h5>
              <p class="text-muted text-small mb-2">
                {{ $t("branch.taller.nombreTaller") }}
              </p>
              <h5 class="mb-1 card-subtitle truncate">
                {{ taller.identificacion }}
              </h5>
              <p class="text-muted text-small mb-2">
                {{ $t("branch.taller.identificacion") }}
              </p>
              <h5 class="mb-1 card-subtitle truncate">
                {{ taller.celular }}
              </h5>
              <p class="text-muted text-small mb-2">
                {{ $t("branch.taller.celular") }}
              </p>
            </div>
            <div class="col">
              <h5 class="mb-1 card-subtitle truncate">
                {{ taller.email }}
              </h5>
              <p class="text-muted text-small mb-2">
                {{ $t("branch.taller.email") }}
              </p>
              <h5 class="mb-1 card-subtitle truncate">
                {{ taller.direccion }}
              </h5>
              <p class="text-muted text-small mb-2">
                {{ $t("branch.taller.direccion") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
