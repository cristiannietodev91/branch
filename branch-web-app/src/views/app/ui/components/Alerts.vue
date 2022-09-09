<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.alerts')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('alert.react-notifications')">
        <h6 class="card-subtitle">{{ $t('alert.outline') }}</h6>
        <b-button variant="outline-primary" class="mb-3" @click="addNotification('primary')">{{ $t('alert.primary') }}</b-button>
        <b-button variant="outline-secondary" class="mb-3" @click="addNotification('secondary')">{{ $t('alert.secondary') }}</b-button>
        <b-button variant="outline-info" class="mb-3" @click="addNotification('info')">{{ $t('alert.info') }}</b-button>
        <b-button variant="outline-success" class="mb-3" @click="addNotification('success')">{{ $t('alert.success') }}</b-button>
        <b-button variant="outline-warning" class="mb-3" @click="addNotification('warning')">{{ $t('alert.warning') }}</b-button>
        <b-button variant="outline-danger" class="mb-3" @click="addNotification('error')">{{ $t('alert.error') }}</b-button>

        <h6 class="card-subtitle">{{ $t('alert.filled') }}</h6>
        <b-button variant="primary" class="mb-3" @click="addNotification('primary filled')">{{ $t('alert.primary') }}</b-button>
        <b-button variant="secondary" class="mb-3" @click="addNotification('secondary filled')">{{ $t('alert.secondary') }}</b-button>
        <b-button variant="info" class="mb-3" @click="addNotification('info filled')">{{ $t('alert.info') }}</b-button>
        <b-button variant="success" class="mb-3" @click="addNotification('success filled')">{{ $t('alert.success') }}</b-button>
        <b-button variant="warning" class="mb-3" @click="addNotification('warning filled')">{{ $t('alert.warning') }}</b-button>
        <b-button variant="danger" class="mb-3" @click="addNotification('error filled')">{{ $t('alert.error') }}</b-button>
      </b-card>

      <b-card class="mb-4" :title="$t('alert.rounded')">
        <b-alert show variant="primary" class="rounded">{{ $t('alert.primary-text') }}</b-alert>
        <b-alert show variant="secondary" class="rounded">{{ $t('alert.secondary-text') }}</b-alert>
        <b-alert show variant="success" class="rounded">{{ $t('alert.success-text') }}</b-alert>
        <b-alert show variant="danger" class="rounded">{{ $t('alert.danger-text') }}</b-alert>
        <b-alert show variant="warning" class="rounded">{{ $t('alert.warning-text') }}</b-alert>
        <b-alert show variant="info" class="rounded">{{ $t('alert.info-text') }}</b-alert>
        <b-alert show variant="light" class="rounded">{{ $t('alert.light-text') }}</b-alert>
        <b-alert show variant="dark" class="rounded">{{ $t('alert.dark-text') }}</b-alert>
      </b-card>

      <b-card class="mb-4" :title="$t('alert.default')">
        <b-alert show variant="primary">{{ $t('alert.primary-text') }}</b-alert>
        <b-alert show variant="secondary">{{ $t('alert.secondary-text') }}</b-alert>
        <b-alert show variant="success">{{ $t('alert.success-text') }}</b-alert>
        <b-alert show variant="danger">{{ $t('alert.danger-text') }}</b-alert>
        <b-alert show variant="warning">{{ $t('alert.warning-text') }}</b-alert>
        <b-alert show variant="info">{{ $t('alert.info-text') }}</b-alert>
        <b-alert show variant="light">{{ $t('alert.light-text') }}</b-alert>
        <b-alert show variant="dark">{{ $t('alert.dark-text') }}</b-alert>
      </b-card>

      <b-card class="mb-4" :title="$t('alert.default')">
        <b-alert variant="warning" class="rounded" fade show dismissible>{{ $t('alert.dismissing-text') }}</b-alert>
        <b-alert variant="warning" show  dismissible>{{ $t('alert.dismissing-without-animate-text') }}</b-alert>
      </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    addNotification (
      type = 'success',
      title = 'This is Notify Title',
      message = 'This is Notify Message,<br>with html.'
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false })
    }
  }
}
</script>
