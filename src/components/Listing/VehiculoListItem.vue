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
      <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
        <p class="list-item-heading mb-0 truncate w-15 w-sm-100">{{data.placa}}</p>
        <div class="mb-0 text-muted text-small w-10 w-sm-100">
            <p class="mb-0 text-muted text-small">{{data.kilometraje}} KM</p>
            <p class="mb-0 text-muted text-small">Año {{data.modelo}}</p>
            <p class="mb-0 text-muted text-small">{{data.marca.marca}}</p>
        </div>        
        <p class="mb-0 text-muted text-small w-10 w-sm-100">{{data.color}}</p>
        <p class="mb-0 text-muted text-small w-10 w-sm-100">{{data.tipoVehiculo}}</p>
        <p class="mb-0 text-muted text-small w-30 w-sm-100">{{data.usuario.email}}</p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.usuario.celular}}</p>
        <div class="w-15 w-sm-100">
          <b-badge pill variant="primary">{{ data.estado }}</b-badge>
        </div>
      </div>
      <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
        <b-form-checkbox :checked="selectedItems.includes(data.IdTaller)" class="itemCheck mb-0" />
      </div>
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
