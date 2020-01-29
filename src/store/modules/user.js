import firebase from 'firebase/app'
import 'firebase/auth'
import axios from 'axios'
import { apiBranchUrl } from '../../constants/config'

export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess = true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess = true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              uid: user.user.uid,
              displayName: user.user.displayName,
              email: user.user.email,
              photoUrl: user.user.photoURL
            }

            console.log('Resultado usuario autenticado :::: > ', newUser);
            const item = { uid: newUser.uid, ...newUser }
            localStorage.setItem('user', JSON.stringify(item))
            commit('setUser', { uid: newUser.uid, ...newUser })

          },
          err => {
            localStorage.removeItem('user')
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    forgotPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase
        .auth()
        .sendPasswordResetEmail(payload.email)
        .then(
          user => {
            commit('clearError')
            commit('setForgotMailSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    resetPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase
        .auth()
        .confirmPasswordReset(payload.resetPasswordCode, payload.newPassword)
        .then(
          user => {
            commit('clearError')
            commit('setResetPasswordSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    register({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then((user) => {
        user.user
          .updateProfile({
            displayName: payload.fullname
          })
          .then(() => { });
        axios
          .post(`${apiBranchUrl}/usuario/createFireBaseUser`, payload)
          .then(user => {
            console.debug('Resultado usuario firebase :::> ', user.data);
            const item = { uid: user.uid, ...user.data }
            //const item = { uid: user.user.uid, ...currentUser }
            localStorage.setItem('user', JSON.stringify(item))
            commit('setUser', { uid: user.uid, ...user.data })
          },
            err => {
              console.error('Error firebase :::> ', err.message);
              commit('setError', err.message)
              setTimeout(() => {
                commit('clearError')
              }, 3000)
            })

      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error('Error login Firebase :::> ', errorMessage, ' Code :::>', errorCode);
      });
    },
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user')
          commit('setLogout')
        }, _error => { })
    },
    fetchUser({ commit }, user) {
      if (user) {
        commit("SET_USER", {
          fullname: user.fullname,
          email: user.email
        });
      } else {
        localStorage.removeItem('user')
        commit('setLogout')
      }
    }
  }
}
