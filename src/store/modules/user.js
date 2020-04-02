import firebase from 'firebase/app'
import 'firebase/auth'
import ServicesCore from "../../services/service";


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
            ServicesCore.loginUserTaller(user.user.uid).then(response => {
              if (response.status == 200) {
                let usuario = response.data;

                const newUser = {
                  uid: usuario.uid,
                  displayName: usuario.firstName,
                  email: usuario.email,
                  celular: usuario.celular,
                  identificacion: usuario.identificacion,
                  IdTaller: usuario.IdTaller
                }

                //console.log('Resultado usuario autenticado :::: > ', newUser);
                const item = { uid: newUser.uid, ...newUser }
                localStorage.setItem('user', JSON.stringify(item))
                commit('setUser', { uid: newUser.uid, ...newUser })

              }
            }).catch(err => {
                localStorage.removeItem('user')
                commit('setError', err.message)
                setTimeout(() => {
                  commit('clearError')
                }, 3000)
              });
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
      payload.tipoUsuario = "AdminTaller";

      ServicesCore.registrarUsuario(payload).then(user => {
        console.debug('Resultado usuario firebase :::> ', user.data);
        const item = { uid: user.data.uid, ...user.data }
        //const item = { uid: user.user.uid, ...currentUser }
        localStorage.setItem('user', JSON.stringify(item))
        commit('setUser', { uid: user.uid, ...user.data })
      },
        err => {
          console.error('Error firebase :::> ', err);
          commit('setError', err.message)
          setTimeout(() => {
            commit('clearError')
          }, 3000)
        })


    },
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user')
          commit('setLogout')
        }, _error => { })
    }
    /*,
    fetchUser({ commit }, user) {
      if (user) {
        commit('setUser', { uid: user.uid, ...user.data })
      } else {
        localStorage.removeItem('user')
        commit('setLogout')
      }
    }*/
  }
}
