<template>
  <div id="app-container" :class="getMenuType">
    <top-nav />
    <sidebar />
    <main>
      <div class="container-fluid">
        <router-view />
      </div>
    </main>
    <footer-component />
  </div>
</template>

<script>
import Sidebar from "../../containers/Sidebar";
import TopNav from "../../containers/TopNav";
import Footer from "../../containers/Footer";
import { mapGetters } from "vuex";

export default {
  name: "app-mai-page",
  components: {
    "top-nav": TopNav,
    sidebar: Sidebar,
    "footer-component": Footer
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters(["getMenuType", "currentUser", "conversations"])
  },
  created() {
    this.$socket.emit("jointaller", this.currentUser.IdTaller, result => {
      console.log("resultado join to room taller", result);
    });
    this.conversations.forEach(conversacion => {
      this.$socket.emit("joinroom", { room: conversacion }, () => {
        console.log(
          "Se unio de nuevo exitosamente a las conversacion::>",
          conversacion
        );
      });
    });
  },
  mounted() {
    this.sockets.subscribe("sendmessage", () => {
      //TODO: Show notifications when a user send a message
    });
    this.sockets.subscribe("newcita", () => {
      //TODO: Show notifications when a new cita is created
    });
  }
};
</script>
