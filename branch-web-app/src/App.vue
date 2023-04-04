<template>
  <div class="h-100">
    <router-view />
    <notifications />
  </div>
</template>

<script>
import { getDirection } from "./utils";

export default {
  beforeMount() {
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add("rtl");
      document.dir = "rtl";
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.dir = "ltr";
      document.body.classList.remove("rtl");
    }
  }
};
</script>

<style lang="scss">
html {
  width: 100%;
  height: 100%;
}

#app{
  height: 100%;
}

</style>
