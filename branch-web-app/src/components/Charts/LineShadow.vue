<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'

import { lineChartOptions } from './config'

Chart.defaults.lineWithShadow = Chart.defaults.line
Chart.controllers.lineWithShadow = Chart.controllers.line.extend({
  draw: function (ease) {
    Chart.controllers.line.prototype.draw.call(this, ease)
    var ctx = this.chart.ctx
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 10
    ctx.responsive = true
    ctx.stroke()
    Chart.controllers.line.prototype.draw.apply(this, arguments)
    ctx.restore()
  }
})

const LineShadow = generateChart('line-with-shadow', 'lineWithShadow')

export default {
  extends: LineShadow,
  props: ['data'],
  data () {
    return {
      options: lineChartOptions
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
