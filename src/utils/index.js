import { defaultDirection } from '../constants/config'

export const addCommas = nStr => {
  nStr += ''
  var x = nStr.split('.')
  var x1 = x[0]
  var x2 = x.length > 1 ? '.' + x[1] : ''
  var rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  }
  return x1 + x2
}

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key]
    var B = b[key]
    if (order.indexOf(A + '') > order.indexOf(B + '')) {
      return 1
    } else {
      return -1
    }
  })
  return array
}

export const getDateWithFormat = () => {
  const today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!

  var yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return dd + '.' + mm + '.' + yyyy
}

export const getCurrentTime = () => {
  const now = new Date()
  return now.getHours() + ':' + now.getMinutes()
}

export const ThemeColors = () => {
  let rootStyle = getComputedStyle(document.body)
  return {
    themeColor1: rootStyle.getPropertyValue('--theme-color-1').trim(),
    themeColor2: rootStyle.getPropertyValue('--theme-color-2').trim(),
    themeColor3: rootStyle.getPropertyValue('--theme-color-3').trim(),
    themeColor4: rootStyle.getPropertyValue('--theme-color-4').trim(),
    themeColor5: rootStyle.getPropertyValue('--theme-color-5').trim(),
    themeColor6: rootStyle.getPropertyValue('--theme-color-6').trim(),
    themeColor1_10: rootStyle.getPropertyValue('--theme-color-1-10').trim(),
    themeColor2_10: rootStyle.getPropertyValue('--theme-color-2-10').trim(),
    themeColor3_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor4_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor5_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor6_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    primaryColor: rootStyle.getPropertyValue('--primary-color').trim(),
    foregroundColor: rootStyle.getPropertyValue('--foreground-color').trim(),
    separatorColor: rootStyle.getPropertyValue('--separator-color').trim()
  }
}

export const chartTooltip = {
  backgroundColor: ThemeColors().foregroundColor,
  titleFontColor: ThemeColors().primaryColor,
  borderColor: ThemeColors().separatorColor,
  borderWidth: 0.5,
  bodyFontColor: ThemeColors().primaryColor,
  bodySpacing: 10,
  xPadding: 15,
  yPadding: 15,
  cornerRadius: 0.15
}

export const centerTextPlugin = {
  afterDatasetsUpdate: function (chart) {},
  beforeDraw: function (chart) {
    var width = chart.chartArea.right
    var height = chart.chartArea.bottom
    var ctx = chart.chart.ctx
    ctx.restore()

    var activeLabel = chart.data.labels[0]
    var activeValue = chart.data.datasets[0].data[0]
    var dataset = chart.data.datasets[0]
    var meta = dataset._meta[Object.keys(dataset._meta)[0]]
    var total = meta.total

    var activePercentage = parseFloat(((activeValue / total) * 100).toFixed(1))
    activePercentage = chart.legend.legendItems[0].hidden
      ? 0
      : activePercentage

    if (chart.pointAvailable) {
      activeLabel = chart.data.labels[chart.pointIndex]
      activeValue =
        chart.data.datasets[chart.pointDataIndex].data[chart.pointIndex]

      dataset = chart.data.datasets[chart.pointDataIndex]
      meta = dataset._meta[Object.keys(dataset._meta)[0]]
      total = meta.total
      activePercentage = parseFloat(((activeValue / total) * 100).toFixed(1))
      activePercentage = chart.legend.legendItems[chart.pointIndex].hidden
        ? 0
        : activePercentage
    }

    ctx.font = '36px Nunito, sans-serif'
    ctx.fillStyle = ThemeColors().primaryColor
    ctx.textBaseline = 'middle'

    var text = activePercentage + '%'
    var textX = Math.round((width - ctx.measureText(text).width) / 2)
    var textY = height / 2
    ctx.fillText(text, textX, textY)

    ctx.font = '14px Nunito, sans-serif'
    ctx.textBaseline = 'middle'

    var text2 = activeLabel
    var textX2 = Math.round((width - ctx.measureText(text2).width) / 2)
    var textY2 = height / 2 - 30
    ctx.fillText(text2, textX2, textY2)

    ctx.save()
  },
  beforeEvent: function (chart, event, options) {
    var firstPoint = chart.getElementAtEvent(event)[0]

    if (firstPoint) {
      chart.pointIndex = firstPoint._index
      chart.pointDataIndex = firstPoint._datasetIndex
      chart.pointAvailable = true
    }
  }
}
export const getDirection = () => {
  let direction = defaultDirection
  if (localStorage.getItem('direction')) {
    const localValue = localStorage.getItem('direction')
    if (localValue === 'rtl' || localValue === 'ltr') {
      direction = localValue
    }
  }
  return {
    direction,
    isRtl: direction === 'rtl'
  }
}

export const setDirection = localValue => {
  let direction = 'ltr'
  if (localValue === 'rtl' || localValue === 'ltr') {
    direction = localValue
  }
  localStorage.setItem('direction', direction)
}
