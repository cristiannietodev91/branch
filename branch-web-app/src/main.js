import { createApp } from "vue";
import App from "./App";

// BootstrapVue add
import BootstrapVue from "bootstrap-vue";
// Router & Store add
import router from "./router";
import { store } from "./store";
// Multi Language Add
import en from "./locales/en.json";
import es from "./locales/es.json";
import { createI18n } from "vue-i18n";
import {
  defaultLocale,
} from "./constants/config";
// Notification Component Add
// import Notifications from "./components/Common/Notification";
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

import firebase from "firebase/app";
// import "firebase/auth";

import Vuelidate from "vuelidate";

const app = createApp({
  router,
  ...App
});

app.use(store);
app.use(Vuelidate);

//console.log('Service account file :::::>',serviceAccount);

const messages = { en: en, es: es };
const locale = defaultLocale;

const i18n = createI18n({
  locale: locale,
  fallbackLocale: "es",
  messages
});

app.use(BootstrapVue);
app.use(i18n);



// app.use(Notifications);
app.use(require("vue-shortkey"));
app.use(contentmenu);
app.use(VueLineClamp, {
  importCss: true
});
app.use(VCalendar, {
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
app.use(VueScrollTo);
app.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO(process.env.VUE_APP_URLBACKSERVICES, options),
    vuex: {
      store,
      actionPrefix: "SOCKET_"
    }
  })
);

app.use(VueNativeNotification, {
  requestOnNotify: false
});

app.component("piaf-breadcrumb", Breadcrumb);
app.component("b-refresh-button", RefreshButton);
app.component("b-colxx", Colxx);
app.component("vue-perfect-scrollbar", vuePerfectScrollbar);



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



// Vue.notification.requestPermission().then(console.log);

/*firebase.auth().onAuthStateChanged(user => {
  if(user){
    store.dispatch("fetchUser", user);
  }
});*/


export default app;
