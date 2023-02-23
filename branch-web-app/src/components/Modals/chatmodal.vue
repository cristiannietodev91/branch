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
        <div v-else key="conversationLoading" class="loading" />
      </b-colxx>
    </b-row>
    <div class>
      <div v-if="!isLoadImage" class="d-flex justify-content-between align-items-center">
        <b-input
          v-model="message"
          type="text"
          :placeholder="$t('chat.saysomething')"
          :readonly="isLoadImage"
          @keyup.native.enter="sendMessage"
        />
        <div class="d-flex flex-row">
          <b-button variant="outline-primary" class="icon-button small ml-1" @click="open">
            <i class="simple-icon-paper-clip" />
          </b-button>
          <b-button variant="primary" class="icon-button small ml-1" @click="sendMessage">
            <i class="simple-icon-arrow-right" />
          </b-button>
        </div>
        <span v-if="showErrorMessage">{{ errorMessage }}</span>
      </div>
      <template v-else>
        <div class="loading" />
      </template>
    </div>

    <vue-dropzone
      id="dropzone"
      ref="myVueDropzone"
      :awss3="awss3"
      :options="dropzoneOptions"
      class="d-none"
      @vdropzone-complete="complete"
      @vdropzone-file-added="starLoad"
      @vdropzone-error="errorLoadFile"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import vue2Dropzone from "vue2-dropzone";
import ConversationDetail from "../ChatApp/ConversationDetail";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "chat-modal",
  components: {
    "vue-dropzone": vue2Dropzone,
    "conversation-detail": ConversationDetail
  },
  props: ["conversacion"],
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
  created() {
    this.otherUser = this.conversacion.usuario;
    this.$socket.emit(
      "joinroom",
      { room: this.conversacion.IdConversacionUser },
      () => {}
    );
  },
  mounted() {
    this.getMessages({
      IdConversacionUser: this.conversacion.IdConversacionUser,
      IdTaller: this.conversacion.IdTaller
    });
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
  }
};
</script>
