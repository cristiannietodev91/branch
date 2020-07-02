import axios from "axios";
import { apiUrl } from "../../constants/config";
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
  resetNewMessages(state, payload) {
    state.newMessages = 0;
  }
};

const actions = {
  searchContacts({ commit, state }, { userId, searchKey }) {
    if (searchKey.length > 0) {
      axios
        .get(`${apiUrl}/contacts?search=${searchKey}`)
        .then(r => r.data)
        .then(res => {
          if (res.status) {
            commit("getContactsSearchSuccess", {
              contacts: res.data,
              userId: userId
            });
          } else {
            commit("getContactsError", "error:getContacts");
          }
        });
    } else {
      commit("getContactsSearchSuccess", {
        contacts: state.contacts,
        userId: userId
      });
    }
  },
  getContacts({ commit }, userId) {
    axios
      .get(`${apiUrl}/contacts`)
      .then(r => r.data)
      .then(res => {
        if (res.status) {
          commit("getContactsSuccess", { contacts: res.data, userId: userId });
        } else {
          commit("getContactsError", "error:getContacts");
        }
      });
  },
  getConversations({ commit }, userId) {
    axios
      .get(`${apiUrl}/conversations`)
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
  SOCKET_connect({ commit }) {
    console.log("From vuexxx:::> coonect");
  },
  SOCKET_newcliente({ commit, state }, data) {
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
  SOCKET_sendmessage({ commit, state }, data) {
    commit("addMessageItem", data);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
