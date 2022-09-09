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
    <div class>
      <div v-if="!isLoadImage" class="d-flex justify-content-between align-items-center">
        <b-input
          type="text"
          :placeholder="$t('chat.saysomething')"
          v-model="message"
          @keyup.native.enter="sendMessage"
          :readonly="isLoadImage"
        />
        <div class="d-flex flex-row">
          <b-button variant="outline-primary" class="icon-button small ml-1" @click="open">
            <i class="simple-icon-paper-clip" />
          </b-button>
          <b-button variant="primary" class="icon-button small ml-1" @click="sendMessage">
            <i class="simple-icon-arrow-right" />
          </b-button>
        </div>
        <span v-if="showErrorMessage">{{errorMessage}}</span>
      </div>
      <template v-else>
        <div class="loading"></div>
      </template>
    </div>

    <vue-dropzone
      ref="myVueDropzone"
      id="dropzone"
      :awss3="awss3"
      :options="dropzoneOptions"
      v-on:vdropzone-complete="complete"
      v-on:vdropzone-file-added="starLoad"
      v-on:vdropzone-error="errorLoadFile"
      class="d-none"
    ></vue-dropzone>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import vue2Dropzone from "vue2-dropzone";
// import ApplicationMenu from '../Common/ApplicationMenu'
// import ContactList from '../ChatApp/ContactList'
import ConversationList from "../ChatApp/ConversationList";
import ConversationDetail from "../ChatApp/ConversationDetail";
import { v4 as uuidv4 } from "uuid";

export default {
  props: ["conversacion"],
  components: {
    "vue-dropzone": vue2Dropzone,
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
      isLoadImage: false,
      errorMessage: "",
      showErrorMessage: false,
      dropzoneOptions: {
        url: process.env.VUE_APP_URLBACKSERVICES + `file/sendFile`,
        method: "post",
        autoProcessQueue: true,
        acceptedFiles: "image/*",
        thumbnailHeight: 160,
        maxFilesize: 4
      },
      awss3: {
        signingURL: f => {
          // The server REST endpoint we setup earlier
          const key =
            process.env.VUE_APP_URLBACKSERVICES +
            `file/signed?filename=${f.name}`;
          // Save this for later use
          return key;
        },
        headers: {},
        params: {},
        sendFileToServer: false
      }
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
        _id: uuidv4(),
        createdAt: new Date(),
        text: this.message,
        delivered: false,
        read: false,
        user: {
          _id: this.currentUser.uid,
          name: this.conversacion.nombreTaller
        },
        IdCita: this.conversacion.IdCita,
        CodigoOrden: this.conversacion.CodigoOrden,
        IdOrdenTrabajo: this.conversacion.IdOrdenTrabajo,
        IdEtapa: this.conversacion.IdEtapa,
        IdConversacionUser: this.conversacion.IdConversacionUser,
        IdTaller: this.conversacion.IdTaller,
        typeusuario: "taller"
      };

      this.addMessageItem(newmessage);

      this.message = "";
      this.$socket.emit(
        "messaggetosomeone",
        this.conversacion.IdConversacionUser,
        newmessage
      );
    },
    starLoad() {
      this.isLoadImage = true;
    },
    errorLoadFile(file, error) {
      this.isLoadImage = false;
      const { status } = file;
      console.error(
        "Error to load file :::>",
        file,
        "status ::>",
        status,
        "Error",
        error
      );
      this.showErrorMessage = true;
      if (error && error.includes("too big")) {
        this.errorMessage = "Archivo es demasiado grande el maximo es 8 MB";
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 2500);
      }
    },
    hide() {
      this.$emit("hide");
    },
    complete(response) {
      this.isLoadImage = false;
      if (response.status == "success") {
        let newmessage = {
          _id: uuidv4(),
          createdAt: new Date(),
          image: response.s3Url + "/" + response.s3Signature.key,
          delivered: false,
          read: false,
          user: {
            _id: this.currentUser.uid,
            name: this.conversacion.nombreTaller
          },
          IdCita: this.conversacion.IdCita,
          CodigoOrden: this.conversacion.CodigoOrden,
          IdOrdenTrabajo: this.conversacion.IdOrdenTrabajo,
          IdEtapa: this.conversacion.IdEtapa,
          IdConversacionUser: this.conversacion.IdConversacionUser,
          IdTaller: this.conversacion.IdTaller,
          typeusuario: "taller"
        };

        this.addMessageItem(newmessage);

        this.message = "";
        this.$socket.emit(
          "messaggetosomeone",
          this.conversacion.IdConversacionUser,
          newmessage
        );
      }
    },
    open() {
      this.$refs.myVueDropzone.dropzone.hiddenFileInput.click();
    }
  },
  created() {
    this.otherUser = this.conversacion.usuario;
    this.$socket.emit(
      "joinroom",
      { room: this.conversacion.IdConversacionUser },
      resultado => {}
    );
  },
  mounted() {
    this.getMessages({
      IdConversacionUser: this.conversacion.IdConversacionUser,
      IdTaller: this.conversacion.IdTaller
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
