<script>
import { Line } from 'vue-chartjs'
import { areaChartOptions } from './config'

export default {
  extends: Line,
  props: ['data'],
  data () {
    return {
      options: areaChartOptions
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
