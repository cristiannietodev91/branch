<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'

import { pieChartOptions } from './config'

Chart.defaults.pieWithShadow = Chart.defaults.pie
Chart.controllers.pieWithShadow = Chart.controllers.pie.extend({
  draw: function (ease) {
    Chart.controllers.pie.prototype.draw.call(this, ease)
    let ctx = this.chart.chart.ctx
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 10
    ctx.responsive = true
    Chart.controllers.pie.prototype.draw.apply(this, arguments)
    ctx.restore()
  }
})

const PieShadow = generateChart('pie-with-shadow', 'pieWithShadow')

export default {
  extends: PieShadow,
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
