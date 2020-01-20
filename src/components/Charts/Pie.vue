<script>
import { Pie } from 'vue-chartjs'
import { pieChartOptions } from './config'

export default {
  extends: Pie,
  props: ['data'],
  data () {
    return {
      options: pieChartOptions
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
