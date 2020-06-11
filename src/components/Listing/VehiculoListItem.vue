<template>
  <b-card
    @click.prevent="toggleItem($event,data.IdVehiculo)"
    :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.IdVehiculo)}"
    no-body
  >
    <div
      :style="{ backgroundImage: `url('${data.marca.urllogo}')`, width: `15%`
        ,  backgroundPosition: `center center`,backgroundRepeat: `no-repeat` }"
    ></div>

    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center p-3">
        <div class="mb-0 w-30 w-sm-100">
          <p class="text-muted text-small mb-1">{{ $t('branch.orden.marca') }}</p>
          <p class="mb-1 text-small mb-3">{{data.marca.marca}}</p>
          <p class="text-muted text-small mb-1">{{ $t('branch.vehiculo.dueno') }}</p>
          <p class="mb-1 text-small">{{data.usuario.firstName}}</p>
        </div>
        <div class="mb-0 w-30 w-sm-100">
          <p class="text-muted text-small mb-1">{{ $t('branch.marca.referencia') }}</p>
          <p class="mb-1 text-small mb-3">{{data.marca.referencia}}</p>
          <p class="text-muted text-small mb-1">{{ $t('branch.usuario.identificacion') }}</p>
          <p class="mb-1 text-small">{{data.usuario.identificacion ? data.usuario.identificacion : '1234' }}</p>
        </div>
        <div class="mb-0 w-30 w-sm-100">
          <p class="text-muted text-small mb-1">{{ $t('branch.vehiculo.modelo') }}</p>
          <p class="mb-1 text-small mb-3">{{data.modelo ? data.modelo : 'Sin modelo'}}</p>
          <p class="text-muted text-small mb-1">{{ $t('branch.usuario.telefono') }}</p>
          <p class="mb-1 text-small">{{data.usuario.celular}}</p>
        </div>
        <div class="mb-0 w-30 w-sm-100 mr-2">
          <p class="text-muted text-small mb-1">{{ $t('branch.vehiculo.placa') }}</p>
          <p class="mb-1 text-small mb-3">{{data.placa}}</p>
          <p class="text-muted text-small mb-1">{{ $t('branch.usuario.email') }}</p>
          <p class="mb-1 text-small">{{data.usuario.email}}</p>
        </div>
        <div class="mb-0 w-30 w-sm-100">
          <p class="text-muted text-small mb-1">{{ $t('branch.vehiculo.kilometraje') }}</p>
          <p class="mb-1 text-small mb-3">{{data.kilometraje}} KM</p>
          <p class="text-muted text-small mb-1">{{ $t('branch.vehiculo.tipo') }}</p>
          <p class="mb-1 text-small">{{data.tipoVehiculo}}</p>
        </div>
        <!-- <div class="w-15 w-sm-100">
          <b-badge pill variant="primary">{{ data.estado }}</b-badge>
        </div> -->
      </div>
      <!-- <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
        <b-form-checkbox :checked="selectedItems.includes(data.IdTaller)" class="itemCheck mb-0" />
      </div> -->
    </div>
  </b-card>
</template>

<script>
export default {
  props: ["data", "selectedItems"],
  data() {
    return {};
  },
  methods: {
    toggleItem(event, itemId) {
      this.$emit("toggle-item", event, itemId);
    }
  }
};
</script>
