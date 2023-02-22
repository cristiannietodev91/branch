<template>
  <div id="root">
    <div class="fixed-background">
      <main>
        <div class="container">
          <b-row class="h-100">
            <b-colxx xxs="12" md="10" class="mx-auto my-auto">
              <b-card class="auth-card" no-body>
                <div class="position-relative image-side ">
                  <p class="h2">
                    LA MAGIA ESTÁ EN LOS DETALLES
                  </p>
                </div>
                <div class="form-side">
                  <router-link tag="a" to="/">
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
                  <b-button
                    type="submit"
                    variant="primary"
                    size="lg"
                    class="btn-shadow"
                    @click="goBack"
                  >
                    {{ $t("pages.go-back-home") }}
                  </b-button>
                </div>
              </b-card>
            </b-colxx>
          </b-row>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  name: "ErrorComponent",
  mounted: function() {
    document.body.classList.add("background");
  },
  beforeDestroy() {
    document.body.classList.remove("background");
  },
  methods: {
    goBack() {
      this.$router.push("/");
    }
  }
};
</script>
