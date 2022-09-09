<template>
<div>
    <div class="row social-image-row gallery">
        <b-colxx xxs="6" v-for="(thumb, thumbIndex) in thumbs" :key="`thumb_${thumbIndex}`">
            <img class="img-fluid border-radius" :src="thumb" alt="thumbnail" @click="onThumbClick(thumbIndex)" />
        </b-colxx>
    </div>
    <LightGallery :images="images" :index="photoIndex" :disable-scroll="true" @close="handleHide()" />
</div>
</template>

<script>
import {
    LightGallery
} from 'vue-light-gallery';

const images = [
    '/assets/img/fruitcake.jpg',
    '/assets/img/napoleonshat.jpg',
    '/assets/img/tea-loaf.jpg',
    '/assets/img/magdalena.jpg',
    '/assets/img/marble-cake.jpg',
    '/assets/img/parkin.jpg',
];
const thumbs = [
    '/assets/img/fruitcake-thumb.jpg',
    '/assets/img/napoleonshat-thumb.jpg',
    '/assets/img/tea-loaf-thumb.jpg',
    '/assets/img/magdalena-thumb.jpg',
    '/assets/img/marble-cake-thumb.jpg',
    '/assets/img/parkin-thumb.jpg',
]
export default {
    components: {
        LightGallery,
    },
    data() {
        return {
            images,
            thumbs,
            isOpen: false,
            photoIndex: null
        }
    },
    methods: {
        onThumbClick(index) {
            this.photoIndex = index;
            this.isOpen = true;
        },
        handleHide() {
            this.photoIndex = null;
            this.isOpen = false;
        }
    }
}
</script>
