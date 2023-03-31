<template>
  <span>
    <button
      :id="id"
      class="btn btn-multiple-state btn-primary" :class="{'': true,
                                                          'show-spinner': status === 'processing',
                                                          'show-success':status === 'success',
                                                          'show-fail': status === 'fail' }" 
      :disabled="status != 'default'"
      @click="handleClick"
    >
      <span class="spinner d-inline-block">
        <span class="bounce1" />
        <span class="bounce2" />
        <span class="bounce3" />
      </span>
      <span class="icon success">
        <i class="simple-icon-check" />
      </span>
      <span class="icon fail">
        <i class="simple-icon-exclamation" />
      </span>
      <span class="label">
        <slot />
      </span>
    </button>
  </span>
</template>

<script>
export default {
    props: ['id', 'variant', 'click'],
    data() {
        return {
            status: 'default',
            message: '',
            messageShow: false
        }
    },
    methods: {
        handleClick() {
            this.status = 'processing'
            this.click()
                .then(res => {
                    this.status = 'success'
                    this.message = res
                })
                .catch(err => {
                    this.status = 'fail'
                    this.message = err
                })
                .finally(() => {
                    this.messageShow = true
                    setTimeout(() => {
                        this.messageShow = false
                        this.status = 'default'
                    }, 3000)
                })
        }
    }
}
</script>
