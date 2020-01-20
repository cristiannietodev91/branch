<script>
import { Radar } from 'vue-chartjs'
import { radarChartOptions } from './config'

export default {
  extends: Radar,
  props: ['data'],
  data () {
    return {
      options: radarChartOptions
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
