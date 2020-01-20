<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'

import { smallLineChartOptions } from './config'
import { addCommas } from '../../utils'

Chart.defaults.lineWithLine = Chart.defaults.line
Chart.controllers.lineWithLine = Chart.controllers.line.extend({
  draw: function (ease) {
    Chart.controllers.line.prototype.draw.call(this, ease)

    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
      var activePoint = this.chart.tooltip._active[0]
      var ctx = this.chart.ctx
      var x = activePoint.tooltipPosition().x
      var topY = this.chart.scales['y-axis-0'].top
      var bottomY = this.chart.scales['y-axis-0'].bottom

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x, topY)
      ctx.lineTo(x, bottomY)
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'
      ctx.stroke()
      ctx.restore()
    }
  }
})

const SmallLine = generateChart('small-line', 'lineWithLine')
export default {
  extends: SmallLine,
  props: ['data'],
  data () {
    return {
      options: smallLineChartOptions
    }
  },

  mounted () {
    const $that = this

    const tooltips = {
      intersect: false,
      enabled: false,
      custom: function (tooltipModel, data) {
        if (tooltipModel && tooltipModel.dataPoints) {
          var yLabel = tooltipModel.dataPoints[0].yLabel
          var xLabel = tooltipModel.dataPoints[0].xLabel
          var label = tooltipModel.body[0].lines[0].split(':')[0]
          $that.$emit('on-chart-mouse-over', { labelx: label + '-' + xLabel, labely: addCommas(yLabel) })
        }
      }
    }

    this.addPlugin({
      afterInit: function (chart, options) {
        var yLabel = chart.data.datasets[0].data[0]
        var xLabel = chart.data.labels[0]
        var label = chart.data.datasets[0].label
        $that.$emit('on-chart-mouse-over', { labelx: label + '-' + xLabel, labely: addCommas(yLabel) })
      }
    })
    this.renderChart(this.data, Object.assign({ ...this.options }, { tooltips: tooltips }))
  }
}
</script>
