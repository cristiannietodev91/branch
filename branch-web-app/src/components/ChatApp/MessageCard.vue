<template>
  <div
    class="card d-inline-block mb-3 rounded-1"
    :class="{
      'float-left': showLeft,
      'float-right': !showLeft
    }"
  >
    <div class="d-flex ps-1 pe-1 justify-content-between align-items-center">
      <span>
        {{
          message.user.name
        }}
      </span>
      <span class="text-extra-small text-muted">
        {{
          new Date(message.createdAt).getHours() +
            ":" +
            new Date(message.createdAt).getMinutes()
        }}
      </span>
    </div>
          
    <div class="body-chat p-1">
      <p v-if="message.text" class="m-0 text-foreground">
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
</template>

<script>

export default {
    props: {
        message: {
            type: Object,
            default() {
                return {}
            }
        },
        showLeft: {
            type: Boolean,
            default: true
        }
    },
}
</script>