<template>
  <div>
    <div class="row">
      <div class="col col-12">
        <v-breadcrumb :heading="$t('menu.taller')" />
        <div class="card" title="Card Title">
          <div class="card-header">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <router-link class="nav-link" aria-current="page" to="/app/taller/detailTaller">
                  {{ $t("branch.cita.cita") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" aria-current="page" to="/app/taller/detailTaller/mecanicos">
                  {{ $t("pages.branch.mecanicos") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" aria-current="page" to="/app/taller/detailTaller/ordenes">
                  {{ $t("pages.branch.ordentrabajo") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" aria-current="page" to="/app/taller/detailTaller/info">
                  {{ $t("pages.details") }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isLoad: false
    };
  },
  created() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
  },
};
</script>
