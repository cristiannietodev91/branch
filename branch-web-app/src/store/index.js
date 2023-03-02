import { createStore } from 'vuex'

import app from '../main'
import menu from './modules/menu'
import user from './modules/user'
import chat from './modules/chat'

export const store = createStore({
  state: {
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
  }
})