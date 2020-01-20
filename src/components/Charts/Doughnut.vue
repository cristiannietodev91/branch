<script>
import { Doughnut } from 'vue-chartjs'
import { doughnutChartOptions } from './config'
import { centerTextPlugin } from '../../utils'

export default {
  extends: Doughnut,
  props: ['data'],
  data () {
    return {
      options: doughnutChartOptions
    }
  },
  mounted () {
    this.addPlugin(centerTextPlugin)
    this.renderChart(this.data, this.options)
  }
}
</script>
