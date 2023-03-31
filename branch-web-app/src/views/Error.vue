<template>
  <div id="root">
    <div class="fixed-background">
      <main>
        <div class="container">
          <div class="row h-100">
            <div class="col col-12 col-md-10 mx-auto my-auto">
              <div class="card auth-card">
                <div class="card-body">
                  <div class="position-relative image-side ">
                    <p class="h2">
                      LA MAGIA ESTÁ EN LOS DETALLES
                    </p>
                  </div>
                  <div class="form-side">
                    <router-link to="/">
                      <span class="logo-single" />
                    </router-link>
                    <h6 class="mb-4">
                      {{ $t("pages.error-title") }}
                    </h6>
                    <p class="mb-0 text-muted text-small mb-0">
                      {{ $t("pages.error-code") }}
                    </p>
                    <p class="display-1 font-weight-bold mb-5">
                      404
                    </p>
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg btn-shadow"
                      @click="goBack"
                    >
                      {{ $t("pages.go-back-home") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: "error-component",
  mounted: function() {
    document.body.classList.add("background");
  },
  beforeUnmount() {
    document.body.classList.remove("background");
  },
  methods: {
    goBack() {
      this.$router.push("/");
    }
  }
};
</script>
