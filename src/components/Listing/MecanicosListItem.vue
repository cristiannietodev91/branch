<template>
    <b-colxx md="6" sm="6" lg="4" xxs="12">
        <b-card class="mb-4 d-flex flex-row" no-body>
            <img src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="img-thumbnail list-thumbnail  rounded-circle align-self-center m-4" />
            <div class=" d-flex flex-grow-1 min-width-zero">
                <div class=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                    <div class="min-width-zero">
                        <h5 class="mb-1 card-subtitle truncate">{{data.firstName}} {{data.lastName}}</h5>
                        <p class="text-muted text-small mb-2">Identificación</p>
                        <h6>{{data.identificacion}}</h6>
                        <p class="text-muted text-small mb-2">Fecha de creación</p>
                        <h6>{{data.createdAt}}</h6>
                        <p class="text-muted text-small mb-2">Habilidades</p>
                        <p>
                            <b-badge pill variant="primary">{{data.skills}}</b-badge>
                        </p>
                        <p class="text-muted text-small mb-2">
                            <b-button size="xs" variant="outline-primary">Editar</b-button>
                        </p>
                    </div>
                </div>
            </div>
        </b-card>
    </b-colxx>
</template>

<script>
export default {
    props: ['data']
}
</script>
