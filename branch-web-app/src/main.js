import { createApp } from "vue";
import App from "./App";

// Router & Store add
import router from "./router";
import { createStore } from "./store";
// Multi Language Add
import en from "./locales/en.json";
import es from "./locales/es.json";
import { createI18n } from "vue-i18n";
import {
  defaultLocale,
} from "./constants/config";
// Notification Component Add
import Notifications from '@kyvg/vue3-notification';
// Vue select
import vSelect from 'vue-select';
// Breadcrumb Component Add
import Breadcrumb from "./components/Common/Breadcrumb";
// Socket IO
import VueSocketIO from 'vue-3-socket.io'

import SocketIO from "socket.io-client";
const moment = require("moment-timezone");
require("moment/locale/es");

moment.tz.setDefault("UTC");

import firebase from "firebase/app";

const app = createApp(App);

const store = createStore(router);

app.use(store);
app.use(router);

//console.log('Service account file :::::>',serviceAccount);


const messages = { en: en, es: es };
const locale = defaultLocale;

const i18n = createI18n({
  locale: locale,
  fallbackLocale: "es",
  messages
});

app.use(i18n);
app.use(Notifications);

/*
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
*/


const options = { transports: ["websocket"], secure: true };

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

app.component("piaf-breadcrumb", Breadcrumb);
app.component("v-select", vSelect);



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





// Vue.notification.requestPermission().then(console.log);

/*firebase.auth().onAuthStateChanged(user => {
  if(user){
    store.dispatch("fetchUser", user);
  }
});*/


export default app;
