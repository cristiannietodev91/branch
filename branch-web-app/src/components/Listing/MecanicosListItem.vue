<template>
  <div class="col col-12 col-lg-2 col-md-2">
    <div class="card mb-4 d-flex flex-row" no-body>
      <!-- <img src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="img-thumbnail list-thumbnail  rounded-circle align-self-center m-4" /> -->
      <div class="d-flex flex-grow-1 min-width-zero">
        <div
          class="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
        >
          <div class="min-width-zero">
            <h5 class="mb-1 card-subtitle truncate">
              {{ data.firstName }} {{ data.lastName }}
            </h5>
            <p class="text-muted text-small mb-2">
              Identificación
            </p>
            <h6>{{ data.identificacion }}</h6>
            <p class="text-muted text-small mb-2">
              Fecha de creación
            </p>
            <h6>{{ dateTime(data.createdAt) }}</h6>
            <p class="text-muted text-small mb-2">
              Habilidades
            </p>
            <p>
              <span
                v-for="(skill) in JSON.parse(data.skills)"
                :key="`${skill}`"
                class="badge rounded-pill text-bg-primary"
              >
                {{ skill }}
              </span>
            </p>
            <p class="text-muted text-small mb-2">
              <button class="btn btn-outline-primary btn-xs" @click="editMecanico(data)">
                Editar
              </button>
              <button class="btn btn-outline-danger btn-xs" @click="eliminarMecanico(data)">
                Eliminar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: ["data"],
  methods: {
    dateTime(value) {
      return moment(value).format('D MMMM YYYY hh:mm A');
    },
    editMecanico(mecanico) {
      this.$emit("editMecanico", mecanico);
    },
    eliminarMecanico(mecanico) {
      this.$emit("deleteMecanico", mecanico);
    }
  }
};
</script>
