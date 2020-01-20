<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'
import { centerTextPlugin } from '../../utils'

import { doughnutChartOptions } from './config'

Chart.defaults.doughnutWithShadow = Chart.defaults.doughnut
Chart.controllers.doughnutWithShadow = Chart.controllers.doughnut.extend({
  draw: function (ease) {
    Chart.controllers.doughnut.prototype.draw.call(this, ease)
    let ctx = this.chart.chart.ctx
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 10
    ctx.responsive = true
    Chart.controllers.doughnut.prototype.draw.apply(this, arguments)
    ctx.restore()
  }
})

const DoughnutShadow = generateChart('doughnut-with-shadow', 'doughnutWithShadow')

export default {
  extends: DoughnutShadow,
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
