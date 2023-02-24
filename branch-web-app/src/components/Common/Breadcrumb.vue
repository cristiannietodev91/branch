<template>
  <span>
    <h1 v-if="heading && heading.length>0">{{ heading }}</h1>
    <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
      <b-breadcrumb :items="items" />
    </b-nav>
  </span>
</template>

<script>
export default {
  name: 'bread-crumb',
  props: ['heading'],
  data () {
    return {
      items: []
    }
  },
  mounted () {
    let path = this.$route.path.substr(1)
    let rawPaths = path.split('/')

    for (var pName in this.$route.params) {
      if (rawPaths.includes(this.$route.params[pName])) {
        rawPaths = rawPaths.filter(x => x !== this.$route.params[pName])
      }
    }
    rawPaths.map((sub, index) => {      
      this.items.push({
        text: this.$t('menu.' + sub),
        to: this.getUrl(path, sub, index)
      })
    })
  },
  methods: {
    getUrl (path, sub) {
      var pathToGo = '/' + path.split(sub)[0] + sub
      if (pathToGo === '/app') {
        pathToGo = '/'
      }
      return pathToGo
    }
  }
}
</script>
