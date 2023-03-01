<template>
  <div>
    <router-link to="#" @click.prevent="onThumbClick(0)">
      <img :src="thumb" alt="thumbnail" :class="className">
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
    import {LightGallery} from "vue-light-gallery";

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
