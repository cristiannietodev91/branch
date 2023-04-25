import { createStore as _createStore } from "vuex";

import app from "../main";
import menu from "./modules/menu";
import user from "./modules/user";
import chat from "./modules/chat";
import workshop from "./modules/workshop";

export const createStore = (router) => _createStore({
  state: {
    get route() {
      return router.currentRoute.value;
    }
  },
  mutations: {
    changeLang (state, payload) {
      app.$i18n.locale = payload
      localStorage.setItem('currentLanguage', payload)
    }
  },
  actions: {
    setLang ({ commit }, payload) {
      commit('changeLang', payload)
    }
  },
  modules: {
    menu,
    user,
    chat,
    workshop,
  },
})