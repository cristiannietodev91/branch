<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'

import { barChartOptions } from './config'

Chart.defaults.barWithShadow = Chart.defaults.bar
Chart.controllers.barWithShadow = Chart.controllers.bar.extend({
  draw: function (ease) {
    Chart.controllers.bar.prototype.draw.call(this, ease)
    var ctx = this.chart.ctx
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.2)'
    ctx.shadowBlur = 7
    ctx.shadowOffsetX = 5
    ctx.shadowOffsetY = 7
    ctx.responsive = true
    Chart.controllers.bar.prototype.draw.apply(this, arguments)
    ctx.restore()
  }
})

const BarShadow = generateChart('bar-with-shadow', 'barWithShadow')

export default {
  extends: BarShadow,
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
