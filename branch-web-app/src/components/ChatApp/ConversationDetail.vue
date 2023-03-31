<template>
  <div>
    <div class="d-flex flex-row chat-heading">
      <div class="d-flex">
        <img
          :alt="otherUser.firstName"
          src="/assets/img/profile-pic-l.jpg"
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
    <div>
      <div v-for="(message, index) in messages" :key="`message${index}`">
        <div
          class="card d-inline-block mb-3"
          no-body
          :class="{
            'float-left': message.user._id === otherUser.uid,
            'float-right': message.user._id === currentUser.uid
          }"
        >
          <div class="d-flex position-absolute pt-1 pr-2 w-90">
            <span class="align-self-start ml-2">
              {{
                message.user.name
              }}
            </span>
            <div class="position-absolute r-0">
              <span class="align-self-xl-end text-extra-small text-muted">
                {{
                  new Date(message.createdAt).getHours() +
                    ":" +
                    new Date(message.createdAt).getMinutes()
                }}
              </span>
            </div>
          </div>
          <div class="card-body body-chat">
            <div v-if="message.user._id === currentUser.uid" class="d-flex flex-row" />
            <div v-else class="d-flex flex-row pb-1" />
            <div>
              <p v-if="message.text" class="mb-0 text-semi-muted">
                {{ message.text }}
              </p>
              <!-- <single-lightbox-lazy
                v-else
                :thumb="
                  message.image.replace('branchmedia', 'branchmedia-resized')
                "
                :large="message.image"
                class-name="responsive"
              /> -->
            </div>
          </div>
        </div>
        <div class="clearfix" />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: ["currentUser", "otherUser", "messages"],
  mounted() {
    this.scrollToEnd();
  },
  updated() {
    this.scrollToEnd();
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
