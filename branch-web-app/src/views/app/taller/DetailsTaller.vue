<template>
  <div>
    <div class="row">
      <div class="col col-12">
        <v-breadcrumb :heading="$t('menu.taller')" />
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs nav-fill">
              <li
                v-for="(navItem, index) in navItems" :key="index" class="nav-item"
              >
                <button
                  class="nav-link"
                  type="button"
                  role="tab"
                  :class="{
                    'active': path === navItem.to
                  }"
                  @click="$router.push(navItem.to)"
                >
                  {{ $t(navItem.text) }}
                </button>
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
  props: {
    path: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoad: false,
      navItems: [
        {
          text: "branch.cita.cita",
          to: "/app/taller/detailTaller/citas",
        },
        {
          text: "pages.branch.mecanicos",
          to: "/app/taller/detailTaller/mecanicos",
        },
        {
          text: "pages.branch.ordentrabajo",
          to: "/app/taller/detailTaller/ordenes",
        },
        {
          text: "pages.details",
          to: "/app/taller/detailTaller/info",
        }
      ]
    };
  },
  created() {
    setTimeout(() => {
      this.isLoad = true;
    }, 50);
  },
};
</script>
