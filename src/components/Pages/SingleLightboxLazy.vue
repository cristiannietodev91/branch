<template>
  <div>
    <router-link to="#" @click.native.prevent="onThumbClick(0)">
      <b-img-lazy v-bind="mainProps" :src="linkThumb" :show="true" :class="className" />
    </router-link>
    <LightGallery
      :images="[large]"
      :index="photoIndex"
      :disable-scroll="true"
      @close="handleHide()"
    />
  </div>
</template>

<script>
import { LightGallery } from "vue-light-gallery";

export default {
  props: ["thumb", "large", "className"],
  components: {
    LightGallery
  },
  data() {
    return {
      photoIndex: null,
      linkThumb: null,
      mainProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: "#bbb",
        width: 300,
        height: 300,
        class: "my-5"
      }
    };
  },
  created() {
    this.getImageUrl(this.thumb);
  },
  methods: {
    onThumbClick(index) {
      this.photoIndex = index;
    },
    handleHide() {
      this.photoIndex = null;
    },
    async getImageUrl(thumb) {
      setTimeout(() => {
        this.linkThumb = `${thumb}?${new Date().getTime()}`;
      }, 1500);
    }
  }
};
</script>
