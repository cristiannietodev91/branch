<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'

import { polarAreaChartOptions } from './config'

Chart.defaults.polarWithShadow = Chart.defaults.polarArea
Chart.controllers.polarWithShadow = Chart.controllers.polarArea.extend({
  draw: function (ease) {
    Chart.controllers.radar.prototype.draw.call(this, ease)
    let ctx = this.chart.chart.ctx
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.2)'
    ctx.shadowBlur = 7
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 7
    ctx.responsive = true
    Chart.controllers.radar.prototype.draw.apply(this, arguments)
    ctx.restore()
  }
})

const PolarAreaShadow = generateChart('polar-with-shadow', 'polarWithShadow')

export default {
  extends: PolarAreaShadow,
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
