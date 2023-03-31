<template>
  <div class="card d-flex flex-row">
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
        <router-link :to="`detailTaller/info`" class="w-40 w-sm-100">
          <p class="list-item-heading mb-0 truncate">
            {{ data.nombre }}
          </p>
        </router-link>
        <p class="mb-0 text-muted text-small w-15 w-sm-100">
          {{ data.email }}
        </p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100">
          {{ data.direccion }}
        </p>
        <div class="w-15 w-sm-100">
          <span class="badge rounded-pill text-bg-success">{{ data.estado }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: ['data']
}
</script>
