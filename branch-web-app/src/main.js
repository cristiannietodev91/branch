import Vue from "vue";
import App from "./App";

// BootstrapVue add
import BootstrapVue from "bootstrap-vue";
// Router & Store add
import router from "./router";
import store from "./store";
// Multi Language Add
import en from "./locales/en.json";
import es from "./locales/es.json";
import VueI18n from "vue-i18n";
import {
  defaultLocale,
} from "./constants/config";
// Notification Component Add
import Notifications from "./components/Common/Notification";
// Breadcrumb Component Add
import Breadcrumb from "./components/Common/Breadcrumb";
// RefreshButton Component Add
import RefreshButton from "./components/Common/RefreshButton";
// Colxx Component Add
import Colxx from "./components/Common/Colxx";
// Perfect Scrollbar Add
import vuePerfectScrollbar from "vue-perfect-scrollbar";
import contentmenu from "v-contextmenu";
import VueLineClamp from "vue-line-clamp";
import VCalendar from "v-calendar";
import "v-calendar/lib/v-calendar.min.css";
import VueScrollTo from "vue-scrollto";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
import VueNativeNotification from "vue-native-notification";
const moment = require("moment-timezone");
require("moment/locale/es");

moment.tz.setDefault("UTC");

import VueMoment from "vue-moment";
import firebase from "firebase/app";
// import "firebase/auth";

import Vuelidate from "vuelidate";

Vue.use(Vuelidate);

//console.log('Service account file :::::>',serviceAccount);

Vue.use(BootstrapVue);
Vue.use(VueI18n);
Vue.use(VueMoment, { moment });
const messages = { en: en, es: es };
const locale = defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: "es",
  messages
});

Vue.use(Notifications);
Vue.component("piaf-breadcrumb", Breadcrumb);
Vue.component("b-refresh-button", RefreshButton);
Vue.component("b-colxx", Colxx);
Vue.component("vue-perfect-scrollbar", vuePerfectScrollbar);
Vue.use(require("vue-shortkey"));
Vue.use(contentmenu);
Vue.use(VueLineClamp, {
  importCss: true
});
Vue.use(VCalendar, {
  firstDayOfWeek: 2, // ...other defaults,
  formats: {
    title: "MMM YYYY",
    weekdays: "WW",
    navMonths: "MMMM",
    input: ["L", "YYYY-MM-DD", "YYYY/MM/DD"],
    dayPopover: "L"
  },
  datePickerShowDayPopover: false,
  popoverExpanded: true,
  popoverDirection: "bottom"
});
Vue.use(VueScrollTo);


firebase.initializeApp(
  {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: `${process.env.VUE_APP_FIREBASE_PROJECT_NAME}.firebaseapp.com`,
    databaseURL: `https://${process.env.VUE_APP_FIREBASE_PROJECT_NAME}.firebaseio.com`,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_NAME,
    storageBucket: `${process.env.VUE_APP_FIREBASE_PROJECT_NAME}.appspot.com`,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID
  }
);

const options = { transports: ["websocket"], secure: true };

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO(process.env.VUE_APP_URLBACKSERVICES, options),
    vuex: {
      store,
      actionPrefix: "SOCKET_"
    }
  })
);

Vue.use(VueNativeNotification, {
  requestOnNotify: false
});

Vue.notification.requestPermission().then(console.log);

/*firebase.auth().onAuthStateChanged(user => {
  if(user){
    store.dispatch("fetchUser", user);
  }
});*/

Vue.config.productionTip = false;

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
