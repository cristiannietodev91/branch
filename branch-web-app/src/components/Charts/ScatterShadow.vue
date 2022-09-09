<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'

import { scatterChartOptions } from './config'

Chart.defaults.scatterWithShadow = Chart.defaults.scatter
Chart.controllers.scatterWithShadow = Chart.controllers.scatter.extend({
  draw: function (ease) {
    Chart.controllers.scatter.prototype.draw.call(this, ease)
    let ctx = this.chart.chart.ctx
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.2)'
    ctx.shadowBlur = 7
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 7
    ctx.responsive = true
    Chart.controllers.scatter.prototype.draw.apply(this, arguments)
    ctx.restore()
  }
})

const ScatterShadow = generateChart('scatter-with-shadow', 'scatterWithShadow')

export default {
  extends: ScatterShadow,
  props: ['data'],
  data () {
    return {
      options: scatterChartOptions
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
