<template>
  <div>
    <span @click.native.prevent="onThumbClick(0)">
      <img :src="thumb" alt="thumbnail" :class="className">
    </span>
    <LightGallery
      :images="[large]"
      :index="photoIndex"
      :disable-scroll="true"
      @close="handleHide()"
    />
  </div>
</template>

<script>
import LightGallery from "../Gallery/LightGallery.vue";

export default {
    components: {
      LightGallery
    },
    props: ["thumb", "large", "className"],
    data() {
        return {
            photoIndex: null
        };
    },
    methods: {
        onThumbClick(index) {
            this.photoIndex = index;
        },
        handleHide() {
            this.photoIndex = null;
        }
    }
};
</script>
