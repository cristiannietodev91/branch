<template>
<b-card no-body>
    <b-card-body>
        <p class="lead color-theme-1 mb-1 value">{{labelPrefix}}{{labely}}</p>
        <p class="mb-0 label text-small">{{labelx}}</p>
        <div class="chart">
            <small-line-chart :data="data" :height="60" @on-chart-mouse-over="onChartMouseOver" />
        </div>
    </b-card-body>
</b-card>
</template>

<script>
import SmallLineChart from '../Charts/SmallLine'

export default {
    props: ['labelPrefix', 'data'],
    components: {
        'small-line-chart' : SmallLineChart
    },
    data() {
        return {
            labelx: '',
            labely: ''
        }
    },
    methods: {
        onChartMouseOver({
            labelx,
            labely
        }) {
            this.labelx = labelx
            this.labely = labely
        }
    }
}
</script>
