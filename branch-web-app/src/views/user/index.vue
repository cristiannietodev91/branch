<template>
  <div id="root">
    <div class="fixed-background" />
    <main>
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>
<script>
export default {
  name: "MainUserPage",
  mounted () {
    document.body.classList.add('background')
  },
  beforeDestroy () {
    document.body.classList.remove('background')
  }
}
</script>
