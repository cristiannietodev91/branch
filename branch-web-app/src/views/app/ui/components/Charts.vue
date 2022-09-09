<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <piaf-breadcrumb :heading="$t('menu.charts')" />
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('charts.line')">
                <b-row>
                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.shadow') }}</h6>
                        <div class="chart-container">
                            <line-shadow-chart :data="lineChartData" :height="300" />
                        </div>
                    </b-colxx>

                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.no-shadow') }}</h6>
                        <div class="chart-container">
                            <line-chart :data="lineChartData" :height="300" />
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>

        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('charts.polar')">
                <b-row>
                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.shadow') }}</h6>
                        <div class="chart-container">
                            <polar-area-shadow-chart :data="polarAreaChartData" :height="300" />
                        </div>
                    </b-colxx>

                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.no-shadow') }}</h6>
                        <div class="chart-container">
                            <polar-area-chart :data="polarAreaChartData" :height="300" />
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>

        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('charts.area')">
                <b-row>
                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.shadow') }}</h6>
                        <div class="chart-container">
                            <area-shadow-chart :data="areaChartData" :height="300" />
                        </div>
                    </b-colxx>

                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.no-shadow') }}</h6>
                        <div class="chart-container">
                            <area-chart :data="areaChartData" :height="300" />
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>

        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('charts.scatter')">
                <b-row>
                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.shadow') }}</h6>
                        <div class="chart-container">
                            <scatter-shadow-chart :data="scatterChartData" :height="300" />
                        </div>
                    </b-colxx>

                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.no-shadow') }}</h6>
                        <div class="chart-container">
                            <scatter-chart :data="scatterChartData" :height="300" />
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>

        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('charts.bar')">
                <b-row>
                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.shadow') }}</h6>
                        <div class="chart-container">
                            <bar-shadow-chart :data="barChartData" :height="300" />
                        </div>
                    </b-colxx>

                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.no-shadow') }}</h6>
                        <div class="chart-container">
                            <bar-chart :data="barChartData" :height="300" />
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>

        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('charts.radar')">
                <b-row>
                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.shadow') }}</h6>
                        <div class="chart-container">
                            <radar-shadow-chart :data="radarChartData" :height="300" />
                        </div>
                    </b-colxx>

                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.no-shadow') }}</h6>
                        <div class="chart-container">
                            <radar-chart :data="radarChartData" :height="300" />
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>

        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('charts.pie')">
                <b-row>
                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.shadow') }}</h6>
                        <div class="chart-container">
                            <pie-shadow-chart :data="pieChartData" :height="300" />
                        </div>
                    </b-colxx>

                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.no-shadow') }}</h6>
                        <div class="chart-container">
                            <pie-chart :data="pieChartData" :height="300" />
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>

        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('charts.doughnut')">
                <b-row>
                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.shadow') }}</h6>
                        <div class="chart-container">
                            <doughnut-shadow-chart :data="doughnutChartData" :height="300" />
                        </div>
                    </b-colxx>

                    <b-colxx xxs="12" lg="6" class="mb-4">
                        <h6 class="card-subtitle">{{ $t('charts.no-shadow') }}</h6>
                        <div class="chart-container">
                            <doughnut-chart :data="doughnutChartData" :height="300" />
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>

    </b-row>
</div>
</template>

<script>
import {
    lineChartData,
    polarAreaChartData,
    areaChartData,
    scatterChartData,
    barChartData,
    radarChartData,
    pieChartData,
    doughnutChartData
} from '../../../../data/charts'
import LineShadowChart from '../../../../components/Charts/LineShadow'
import LineChart from '../../../../components/Charts/Line'
import PolarAreaShadowChart from '../../../../components/Charts/PolarAreaShadow'
import PolarAreaChart from '../../../../components/Charts/PolarArea'
import AreaShadowChart from '../../../../components/Charts/AreaShadow'
import AreaChart from '../../../../components/Charts/Area'
import ScatterShadowChart from '../../../../components/Charts/ScatterShadow'
import ScatterChart from '../../../../components/Charts/Scatter'
import BarShadowChart from '../../../../components/Charts/BarShadow'
import BarChart from '../../../../components/Charts/Bar'
import RadarShadowChart from '../../../../components/Charts/RadarShadow'
import RadarChart from '../../../../components/Charts/Radar'
import PieShadowChart from '../../../../components/Charts/PieShadow'
import PieChart from '../../../../components/Charts/Pie'
import DoughnutShadowChart from '../../../../components/Charts/DoughnutShadow'
import DoughnutChart from '../../../../components/Charts/Doughnut'

export default {
    components: {
        'line-chart': LineChart,
        'line-shadow-chart': LineShadowChart,
        'polar-area-chart': PolarAreaChart,
        'polar-area-shadow-chart': PolarAreaShadowChart,
        'area-chart': AreaChart,
        'area-shadow-chart': AreaShadowChart,
        'scatter-shadow-chart': ScatterShadowChart,
        'scatter-chart': ScatterChart,
        'bar-shadow-chart': BarShadowChart,
        'bar-chart': BarChart,
        'radar-shadow-chart': RadarShadowChart,
        'radar-chart': RadarChart,
        'pie-shadow-chart': PieShadowChart,
        'pie-chart': PieChart,
        'doughnut-shadow-chart': DoughnutShadowChart,
        'doughnut-chart': DoughnutChart
    },
    data() {
        return {
            lineChartData,
            polarAreaChartData,
            areaChartData,
            scatterChartData,
            barChartData,
            radarChartData,
            pieChartData,
            doughnutChartData
        }
    }

}
</script>
