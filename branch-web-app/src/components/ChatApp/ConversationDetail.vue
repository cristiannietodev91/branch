<template>
  <div>
    <div class="d-flex flex-row chat-heading">
      <div class="d-flex">
        <img
          :alt="otherUser.firstName"
          :src="defaultProfilePicture"
          class="img-thumbnail border-0 rounded-circle ml-0 mr-4 list-thumbnail align-self-center small"
        >
      </div>
      <div class="d-flex min-width-zero">
        <div
          class="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
        >
          <div class="min-width-zero">
            <div>
              <p class="list-item-heading mb-1 truncate">
                {{ otherUser.firstName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="separator mb-5" />
    <perfect-scrollbar
      ref="chatArea"
      class="chat-container"
    >
      <div v-for="(message, index) in messages" :key="`message${index}`">
        <MessageCard :message="message" :showLeft="message.user._id === otherUser.uid" />
        <div class="clearfix" />
      </div>
    </perfect-scrollbar>
  </div>
</template>
<script>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import defaultProfilePicture from "../../assets/img/profile-pic-l.jpg"
import MessageCard from './MessageCard.vue';

export default {
  components: {
      PerfectScrollbar,
      MessageCard,
  },
  props: ["currentUser", "otherUser", "messages"],
  data() {
    return {
      defaultProfilePicture
    }
  },
  watch: {
    'messages': {
      handler(){
        this.scrollToEnd();
      },
      deep: true
    }
  },
  methods: {
    scrollToEnd() {
      setTimeout(() => {
        const container = this.$refs.chatArea.$el;
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }
};
</script>
<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css" />
