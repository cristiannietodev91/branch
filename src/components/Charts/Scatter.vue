<script>
import { Scatter } from 'vue-chartjs'
import { scatterChartOptions } from './config'

export default {
  extends: Scatter,
  props: ['data'],
  data () {
    return {
      options: scatterChartOptions
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
