<template v-slot:default="{ hide }" class="modal-chat">
  <div class="p-3">
    <!-- <b-button variant="primary" block @click="hide">Cerrar Chat</b-button> -->
    <b-row>
      <b-colxx xxs="12" class="chat-app">
        <conversation-detail
          v-if="otherUser != null"
          key="conversation"
          :current-user="currentUser"
          :other-user="otherUser"
          :messages="messages"
        />
        <div v-else class="loading" key="conversationLoading"></div>
      </b-colxx>
    </b-row>
    <div class="d-flex justify-content-between align-items-center">
      <b-input
        type="text"
        :placeholder="$t('chat.saysomething')"
        v-model="message"
        @keyup.native.enter="sendMessage"
      />
      <div class="d-flex flex-row">
        <b-button variant="outline-primary" class="icon-button small ml-1">
          <i class="simple-icon-paper-clip" />
        </b-button>
        <b-button
          variant="primary"
          class="icon-button small ml-1"
          @click="sendMessage"
        >
          <i class="simple-icon-arrow-right" />
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
// import ApplicationMenu from '../Common/ApplicationMenu'
// import ContactList from '../ChatApp/ContactList'
import ConversationList from "../ChatApp/ConversationList";
import ConversationDetail from "../ChatApp/ConversationDetail";
import { v4 as uuidv4 } from "uuid";

export default {
  props: ["data"],
  components: {
    // 'application-menu': ApplicationMenu,
    // 'contact-list': ContactList,
    "conversation-list": ConversationList,
    "conversation-detail": ConversationDetail
  },
  data() {
    return {
      tabIndex: 0,
      message: "",
      searchKey: "",
      isLoadCurrentConversation: false,
      otherUser: null
    };
  },
  computed: {
    ...mapGetters(["currentUser", "messages"])
    //...mapGetters(['currentUser', 'isLoadContacts', 'isLoadConversations', 'error', 'contacts', 'contactsSearchResult', 'conversations'])
  },
  methods: {
    ...mapMutations(["addMessageItem"]),
    ...mapActions(["getMessages"]),
    // selectConversation(otherUser, messages) {
    //     this.otherUser = otherUser
    //     this.conversationMessages = messages
    // },
    sendMessage() {
      let newmessage = {
        _id: uuidv4(), //TODO: Generate hash
        createdAt: new Date(),
        text: this.message,
        delivered: false,
        read: false,
        user: {
          _id: this.currentUser.uid,
          name: this.data.taller.nombre
        },
        IdCita: this.data.IdCita,
        CodigoOrden: this.data.CodigoOrden,
        IdOrdenTrabajo: this.data.IdOrdenTrabajo,
        IdEtapa: this.data.IdEtapa,
        IdConversacionUser: this.data.vehiculo.IdUsuario,
        IdTaller: this.data.IdTaller,
        typeusuario: "taller"
      };

      this.addMessageItem(newmessage);

      this.message = "";
      this.$socket.emit(
        "messaggetosomeone",
        this.data.vehiculo.IdUsuario,
        newmessage
      );
    },
    hide() {
      this.$emit("hide");
    }
  },
  created() {
    this.otherUser = this.data.vehiculo.usuario;
    this.$socket.emit(
      "joinroom",
      { room: this.data.vehiculo.IdUsuario },
      resultado => {
        console.log(
          "Se unio correctmente al room del usuario ya pueden chatear"
        );
      }
    );
  },
  mounted() {
    this.getMessages({
      IdConversacionUser: this.data.vehiculo.IdUsuario,
      IdTaller: this.data.IdTaller
    });

    this.sockets.listener.subscribe("sendmessage", newmessage => {
      console.log("New Message 2 ::>", newmessage);
      this.addMessageItem(newmessage);
    });
  }
  // beforeDestroy() {
  //     document.body.classList.remove("no-footer");
  // },
  // watch: {
  //     searchKey(val, oldVal) {
  //         this.searchContacts({
  //             userId: this.currentUser.id,
  //             searchKey: val
  //         })
  //     }
  // }
};
</script>
