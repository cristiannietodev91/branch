<template class="modal-chat">
  <v-modal
    :id="`sidebar${workorder}`"
    :ref="`sidebar${workorder}`"
    class="shadow"
    :show="open"
    @close="hideModal(`sidebar${workorder}`)"
  >
    <div class="p-3">
      <div class="row">
        <div class="col col-12 chat-app">
          <conversation-detail
            v-if="conversacion && conversacion.usuario"
            key="conversation"
            :current-user="currentUser"
            :other-user="conversacion.usuario"
            :messages="messages"
          />
          <div v-else key="conversationLoading" class="loading" />
        </div>
      </div>
      <div>
        <div v-if="!isLoadImage" class="d-flex justify-content-between align-items-center">
          <input
            v-model="message"
            class="form-control"
            type="text"
            :placeholder="$t('chat.saysomething')"
            :readonly="isLoadImage"
            @keyup.enter="sendMessage"
          >
          <div class="d-flex flex-row">
            <button class="btn btn-outline-primary icon-button small ml-1" @click="openFileHandler">
              <i class="simple-icon-paper-clip" />
            </button>
            <button class="btn btn-primary icon-button small ml-1" @click="sendMessage">
              <i class="simple-icon-arrow-right" />
            </button>
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
  </v-modal>
</template>

<script>
import vueDropzone from "dropzone-vue3";
import { mapGetters, mapActions, mapMutations } from "vuex";
import ConversationDetail from "../ChatApp/ConversationDetail";
import Modal from "./SharedModal.vue";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "chat-modal",
  components: {
    "v-modal": Modal,
    "conversation-detail": ConversationDetail,
    vueDropzone,
  },
  props: ["conversacion", "workorder", "open"],
  data() {
    return {
      tabIndex: 0,
      message: "",
      searchKey: "",
      isLoadCurrentConversation: false,
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
    hideModal(refname) {
        if(this.$refs[refname] && this.$refs[refname].open){
            this.$refs[refname].hide();
        }
        this.$emit('close')
    },
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
    openFileHandler() {
      this.$refs.myVueDropzone.dropzone.hiddenFileInput.click();
    }
  }
};
</script>
