import axios from "axios";
import { apiBranchUrl } from "../../constants/config";
import ServiceCore from "../../services/service";

const state = {
  isLoadContacts: false,
  isLoadConversations: false,
  error: "",
  contacts: null,
  contactsSearchResult: null,
  conversations:
    localStorage.getItem("conversations") != null
      ? JSON.parse(localStorage.getItem("conversations"))
      : [],
  messages: [],
  newMessages: 0
};

const getters = {
  isLoadContacts: state => state.isLoadContacts,
  isLoadConversations: state => state.isLoadConversations,
  error: state => state.error,
  contacts: state => state.contacts,
  conversations: state => state.conversations,
  contactsSearchResult: state => state.contactsSearchResult,
  messages: state => state.messages,
  newMessages: state => state.newMessages
};

const mutations = {
  getContactsSuccess(state, payload) {
    state.isLoadContacts = true;
    state.contacts = payload.contacts;
    state.contactsSearchResult = payload.contacts;
  },
  getContactsSearchSuccess(state, payload) {
    state.contactsSearchResult = payload.contacts;
  },
  getContactsError(state, error) {
    state.isLoadContacts = false;
    state.error = error;
  },
  getConversationsSuccess(state, payload) {
    state.isLoadConversations = true;
    state.conversations = payload.conversations;
  },
  getConversationsError(state, error) {
    state.isLoadConversations = false;
    state.error = error;
  },
  getMessagesSucess(state, payload) {
    state.isLoadConversations = true;
    state.messages = payload.messages;
  },
  addMessageItem(state, newMessage) {
    state.messages.push(newMessage);
    const { typeusuario } = newMessage;
    if (typeusuario == "cliente") {
      state.newMessages = state.newMessages + 1;
    }
  },
  resetNewMessages(state) {
    state.newMessages = 0;
  }
};

const actions = {
  getConversations({ commit }, userId) {
    axios
      .get(`${apiBranchUrl}/conversations`)
      .then(r => r.data)
      .then(res => {
        if (res.status) {
          commit("getConversationsSuccess", {
            conversations: res.data,
            userId: userId
          });
        } else {
          commit("getConversationsError", "error:getConversations");
        }
      });
  },
  getMessages({ commit }, { IdConversacionUser, IdTaller }) {
    ServiceCore.getMessagesByConversacion(IdConversacionUser, IdTaller).then(
      result => {
        if (result.status == 200) {
          commit("getMessagesSucess", {
            messages: result.data
          });
        }
      }
    );
  },
  SOCKET_connect() {
    console.log("From vuexxx:::> coonect");
  },
  SOCKET_newcliente({ state }, data) {
    console.log("New cliente data ", data);
    this._vm.$socket.emit("joinroom", { room: data.room }, result => {
      const conversations = [...state.conversations];
      const existConversions = conversations.find(element => {
        element == data.room;
      });
      if (!existConversions) {
        conversations.push(data.room);
      }
      localStorage.setItem("conversations", JSON.stringify(conversations));
      console.log("Result unir a room del cliente", result);
    });
  },
  SOCKET_sendmessage({ commit }, data) {
    commit("addMessageItem", data);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
