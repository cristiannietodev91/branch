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
  name: "AppMainPage",
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
    this.sockets.subscribe("sendmessage", data => {
      // console.log("Log in mounted", data);
      this.$notification.show(
        data.user.name,
        {
          body: data.text
        },
        {
          onclick: () => {
            this.$router.push({
              path: `/app/taller/detailTaller/ordenes/${data.cita}`
            });
          }
        }
      );
    });
    this.sockets.subscribe("newcita", data => {
      this.$notification.show(
        data.placa,
        {
          body: data.text
        },
        {
          onclick: () => {
            this.$router.push({
              path: `/app/taller/detailTaller/citas`
            });
          }
        }
      );
    });
  }
};
</script>
