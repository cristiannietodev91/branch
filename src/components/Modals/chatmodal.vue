<template v-slot:default="{ hide }">
  <div class="p-3">
    <b-button variant="primary" block @click="hide">Cerrar Chat</b-button>
    <b-row>
      <b-colxx xxs="12" class="chat-app">
        <conversation-detail
          v-if="otherUser != null"
          key="conversation"
          :current-user="currentUser"
          :other-user="otherUser"
          :messages="conversationMessages"
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
<!-- <div>
    
   
  </div> -->

<script>
import { mapGetters, mapActions } from "vuex";
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
      otherUser: null,
      conversationMessages: []
    };
  },
  computed: {
    ...mapGetters(["currentUser"])
    //...mapGetters(['currentUser', 'isLoadContacts', 'isLoadConversations', 'error', 'contacts', 'contactsSearchResult', 'conversations'])
  },
  /*sockets: {
    sendmessage: newmessage => {
      console.log("Recibi el mensaje ::>", newmessage, "this ::>", this);
      //this.conversationMessages.push(newmessage);
    }
  },*/
  methods: {
    // ...mapActions(['getContacts', 'searchContacts', 'getConversations']),
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
          name: this.currentUser.displayName
        },
        cita: {
          IdCita: this.data.IdCita,
          CodigoOrden: this.data.CodigoOrden,
          IdOrdenTrabajo: this.data.IdOrdenTrabajo,
          IdEtapa: this.data.IdEtapa
        }
      };
      this.conversationMessages.push(newmessage);
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

    this.sockets.subscribe("sendmessage", newmessage => {
      this.conversationMessages.push(newmessage);
    });
  }
  // mounted() {
  //     this.getContacts({
  //         userId: this.currentUser.id,
  //         searchKey: ''
  //     })
  //     this.getConversations(this.currentUser.id)
  //     document.body.classList.add("no-footer");
  // },
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
