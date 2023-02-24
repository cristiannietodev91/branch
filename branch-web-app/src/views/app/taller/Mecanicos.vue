<template>
  <b-row>
    <b-colxx class="mecanicos-branch">
      <div class="top-right-button-container">
        <b-button
          variant="primary"
          size="xs"
          class="top-right-button"
          @click="showModal"
        >
          {{ $t("pages.branch.add-new-mecanico") }}
        </b-button>
        <modal-add-mecanico
          :idTaller="currentUser.IdTaller"
          :mecanicoSelected="mecanicoSelected"
          @loadInfoTaller="loadInfoTaller"
        />
        <b-modal id="modalDeleteMecanico" title="Eliminar Mecanico" @ok="deleteMecanicoConfirm">
          <p class="my-4">
            ¿Esta seguro de eliminar este mecanico?
          </p>
        </b-modal>
      </div>
      <mecanicos-items
        v-for="(mecanico, index) in mecanicos"
        :key="index"
        :data="mecanico"
        @editMecanico="editMecanico"
        @deleteMecanico="deleteMecanico"
      />
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import ModalAddMecanico from "../../../components/Modals/addmecanicomodal";
import MecanicosItem from "../../../components/Listing/MecanicosListItem";
import ServicesCore from "../../../services/service";

export default {
  name: "mecanicos-workshop",
  components: {
    "mecanicos-items": MecanicosItem,
    "modal-add-mecanico": ModalAddMecanico
  },
  data() {
    return {
      mecanicos: {},
      mecanicoSelected: {}
    };
  },
  computed: {
    ...mapGetters({ currentUser: "currentUser" })
  },
  created() {
    this.loadInfoTaller();
  },
  methods: {
    showModal() {
      this.mecanicoSelected = {};
      this.$bvModal.show("modalAddMecanico");
    },
    editMecanico(mecanico) {
      this.mecanicoSelected = mecanico;
      this.$bvModal.show("modalAddMecanico");
    },
    deleteMecanico(mecanico) {
      this.mecanicoSelected = mecanico;
      this.$bvModal.show("modalDeleteMecanico");
    },
    loadInfoTaller() {
      ServicesCore.getAllMecanicos(this.currentUser.IdTaller).then(response => {
        if (response.status == 200) {
          this.mecanicos = response.data;
        }
      });
    },
    deleteMecanicoConfirm() {
      if (this.mecanicoSelected) {
        const mecanico = {
          IdMecanico: this.mecanicoSelected.IdMecanico,
          estado: "Eliminado"
        };
        ServicesCore.updateMecanico(mecanico)
          .then(response => {
            if (response.status == 202) {
              this.loadInfoTaller();
            }
          })
          .catch(error => {
            console.log("Error al eliminar mecanico :::>", error);
            this.$notify(
              "error filled",
              "ERROR",
              "Error al eliminar mecanico",
              {
                duration: 3000,
                permanent: false
              }
            );
          });
      }
    }
  }
};
</script>


