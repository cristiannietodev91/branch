<template>
<div id="app-container" :class="getMenuType">
    <top-nav />
    <sidebar />
    <main>
        <div class="container-fluid">
            <router-view />
        </div>
    </main>
    <footer-component/>
</div>
</template>

<script>
import Sidebar from '../../containers/Sidebar'
import TopNav from '../../containers/TopNav'
import Footer from '../../containers/Footer'
import {
    mapGetters
} from 'vuex'

export default {
    components: {
        'top-nav': TopNav,
        'sidebar': Sidebar,
        'footer-component': Footer
    },
    data() {
        return {
            show: false
        }
    },
    computed: {
        ...mapGetters(['getMenuType'])
    }
}
</script>
