<template>
  <div class="d-flex flex-row m-2 border-bottom border-top cardChats" @click="openChat">
    <b-badge v-if="newmessages > 0" variant="light" class="align-self-center">
      {{ newmessages }}
    </b-badge>
    <div class="pl-3 pt-2 pr-2 pb-2">
      <p class="list-item-heading">
        {{ conversacion.usuario.firstName }}
      </p>
      <div class="pr-4">
        <p class="text-muted mb-1 text-small">
          {{ conversacion.usuario.email }}
        </p>
      </div>
      <div
        class="text-primary text-small font-weight-medium d-none d-sm-block"
      >
        {{ conversacion.createdAt }}
      </div>
    </div>
    <b-modal
      v-if="renderModal"
      :id="`sidebar${uidChat}`"
      v-model="showModal"
      right
      shadow
      no-header
    >
      <modal-open-chat :conversacion="infoconversacion" @hide="openChat" />
    </b-modal>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import ModalOpenChat from "../Modals/chatmodal";
import ServicesCore from "../../services/service";

export default {
  components: {
    "modal-open-chat": ModalOpenChat
  },
  props: ["conversacion", "detailPath"],
  data() {
    return {
      newmessages: 0,
      uidChat: "",
      showModal: false,
      renderModal: false,
      infoconversacion: {}
    };
  },
  mounted() {
    ServicesCore.countUnReadMessagesByIdConversacion(
      this.conversacion.IdConversacion,
      "cliente"
    ).then(response => {
      const { data } = response;
      this.newmessages = data;
    });
    this.sockets.listener.subscribe("sendmessage", newmessage => {
      const { user } = newmessage;
      const { _id } = user;
      const { uid } = this.conversacion;
      this.uidChat = uid;
      if (_id === uid) {
        this.newmessages++;
      }
    });
    this.infoconversacion = {
      IdTaller: this.conversacion.IdTaller,
      nombreTaller: this.conversacion.taller.nombre,
      usuario: this.conversacion.usuario,
      IdConversacionUser: this.conversacion.uid
    };
    this.renderModal = true;
  },
  methods: {
    ...mapMutations(["resetNewMessages"]),
    openChat() {
      this.showModal = !this.showModal;
      this.newmessages = 0;
      this.resetNewMessages();
      this.$emit("markreadmessages", {
        IdConversacionUser: this.conversacion.uid,
        IdTaller: this.conversacion.IdTaller
      });
      //this.$bvModal.show("modalChat_" + this.data.CodigoOrden);
    }
  }
};
</script>
