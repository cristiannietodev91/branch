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
  name: "main-user-page",
  mounted () {
    document.body.classList.add('background')
  },
  beforeUnmount () {
    document.body.classList.remove('background')
  }
}
</script>
