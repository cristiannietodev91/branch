<script>
import { Bar } from 'vue-chartjs'
import { barChartOptions } from './config'

export default {
  extends: Bar,
  props: ['data'],
  data () {
    return {
      options: barChartOptions
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
