<script>
import { PolarArea } from 'vue-chartjs'
import { polarAreaChartOptions } from './config'

export default {
  extends: PolarArea,
  props: ['data'],
  data () {
    return {
      options: polarAreaChartOptions
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
