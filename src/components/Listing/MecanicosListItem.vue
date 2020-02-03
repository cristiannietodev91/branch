<template>
<b-card class="d-flex flex-row mb-3" no-body>
    <div class="d-flex flex-grow-1 min-width-zero">
        <b-card-body class="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <p class="mb-1 text-muted text-small w-15 w-xs-100">{{data.firstName}} {{data.lastName}}</p>
            <p class="mb-1 text-muted text-small w-15 w-xs-100">{{data.identificacion}}</p>
            <p class="mb-1 text-muted text-small w-15 w-xs-100">{{data.createdAt}}</p>
            <div class="w-15 w-xs-100 text-right">
                <b-badge pill variant="primary">{{data.skills}}</b-badge>
            </div>
        </b-card-body>
    </div>
</b-card>
</template>

<script>
export default {
    props: ['data']
}
</script>
