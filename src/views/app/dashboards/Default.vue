/* eslint-disable vue/no-unused-components */
<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <piaf-breadcrumb :heading="$t('menu.default')" />
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xl="6" lg="12">
            <div class="icon-cards-row">
                <glide-component :settings="glideIconsOption">
                    <icon-card :title="$t('dashboards.pending-orders')" icon="iconsminds-clock" :value="14" />
                    <icon-card :title="$t('dashboards.completed-orders')" icon="iconsminds-basket-coins" :value="32" />
                    <icon-card :title="$t('dashboards.refund-requests')" icon="iconsminds-arrow-refresh" :value="74" />
                    <icon-card :title="$t('dashboards.new-comments')" icon="iconsminds-mail-read" :value="25" />
                </glide-component>
            </div>
            <b-row>
                <b-colxx md="12" class="mb-4">
                    <b-card :title="$t('dashboards.sales')">
                        <b-refresh-button @click="refreshButtonClick" />
                        <div class="dashboard-line-chart">
                            <line-shadow-chart :data="lineChartData" :height="300" />
                        </div>
                    </b-card>
                </b-colxx>
            </b-row>
        </b-colxx>

        <b-colxx lg="12" xl="6" class="mb-4">
            <b-card :title="$t('dashboards.recent-orders')">
                <b-refresh-button @click="refreshButtonClick" />
                <vue-perfect-scrollbar class="scroll dashboard-list-with-thumbs" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                    <recent-order-item v-for="(order,index) in products.slice(0,6)" :order="order" detail-path="/app/pages/product/details" :key="index" />
                </vue-perfect-scrollbar>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx lg="4" md="12" class="mb-4">
            <b-card :title="$t('dashboards.product-categories')">
                <div class="dashboard-donut-chart">
                    <polar-area-shadow-chart :data="polarAreaChartData" :height="270" />
                </div>
            </b-card>
        </b-colxx>

        <b-colxx lg="4" md="6" class="mb-4">
            <b-card :title="$t('dashboards.logs')">
                <vue-perfect-scrollbar class="dashboard-logs scroll" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                    <log-list :logs="logs" />
                </vue-perfect-scrollbar>
            </b-card>
        </b-colxx>

        <b-colxx lg="4" md="6" class="mb-4">
            <b-card :title="$t('dashboards.tickets')">
                <vue-perfect-scrollbar class="scroll dashboard-list-with-user" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                    <list-with-user-item v-for="(ticket, index) in tickets" :data="ticket" detail-path="/app/pages/product/details" :key="index" />
                </vue-perfect-scrollbar>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xl="6" lg="12" class="mb-4">
            <b-card :title="$t('dashboards.calendar')">
                <calendar-view style="min-height:500px" :events="calendar.events" :show-date="calendar.showDate" :time-format-options="{hour: 'numeric', minute:'2-digit'}" :enable-drag-drop="true" :show-event-times="true" display-period-uom="month" :starting-day-of-week="1" current-period-label="Today" @drop-on-date="onDropDate" @click-date="onClickDay" @click-event="onClickEvent">
                    <calendar-view-header slot="header" slot-scope="t" :header-props="t.headerProps" @input="setShowDate" />
                </calendar-view>
            </b-card>
        </b-colxx>
        <b-colxx xl="6" lg="12" class="mb-4">
            <b-card :title="$t('dashboards.best-sellers')">
                <vuetable ref="vuetable" :api-url="bestsellers.apiUrl" :fields="bestsellers.fields" :per-page="6" pagination-path @vuetable:pagination-data="onPaginationData"></vuetable>
                <vuetable-pagination-bootstrap ref="pagination" @vuetable-pagination:change-page="onChangePage" />
            </b-card>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx sm="12" lg="4" class="mb-4">
            <b-card :title="$t('dashboards.profile-status')">
                <div v-for="(s,index) in profileStatuses" :key="index" class="mb-4">
                    <p class="mb-2">
                        {{ s.title }}
                        <span class="float-right text-muted">{{s.status}}/{{s.total}}</span>
                    </p>
                    <b-progress :value="(s.status / s.total) * 100"></b-progress>
                </div>
            </b-card>
        </b-colxx>

        <b-colxx md="6" lg="4" class="mb-4">
            <gradient-card>
                <b-badge pill variant="theme-3" class="align-self-start mb-3">{{ $t('dashboards.piaf') }}</b-badge>
                <p class="lead text-white">{{ $t('dashboards.magic-is-in-the-details') }}</p>
                <p class="text-white">{{ $t('dashboards.yes-it-is-indeed') }}</p>
            </gradient-card>
        </b-colxx>

        <b-colxx md="6" lg="4" class="mb-4">
            <b-card :title="$t('dashboards.cakes')" class="dashboard-link-list">
                <two-column-list :data="cakes" />
            </b-card>
        </b-colxx>
    </b-row>

    <draggable class="row">
        <b-colxx xl="3" lg="6" class="mb-4">
            <radial-progress-card :title="$t('dashboards.payment-status')" :percent="64" />
        </b-colxx>
        <b-colxx xl="3" lg="6" class="mb-4">
            <radial-progress-card :title="$t('dashboards.work-progress')" :percent="75" />
        </b-colxx>
        <b-colxx xl="3" lg="6" class="mb-4">
            <radial-progress-card :title="$t('dashboards.tasks-completed')" :percent="32" />
        </b-colxx>
        <b-colxx xl="3" lg="6" class="mb-4">
            <radial-progress-card :title="$t('dashboards.payments-done')" :percent="45" />
        </b-colxx>
    </draggable>

    <b-row>
        <b-colxx sm="12" md="6" class="mb-4">
            <b-card class="dashboard-filled-line-chart" no-body>
                <b-card-body>
                    <div class="float-left float-none-xs">
                        <div class="d-inline-block">
                            <h5 class="d-inline">{{ $t('dashboards.website-visits') }}</h5>
                            <span class="text-muted text-small d-block">{{ $t('dashboards.unique-visitors') }}</span>
                        </div>
                    </div>
                    <b-dropdown id="ddown5" :text="$t('dashboards.this-week')" size="xs" variant="outline-primary" class="float-right float-none-xs mt-2">
                        <b-dropdown-item>{{ $t('dashboards.last-week') }}</b-dropdown-item>
                        <b-dropdown-item>{{ $t('dashboards.this-month') }}</b-dropdown-item>
                    </b-dropdown>
                </b-card-body>
                <div class="chart card-body pt-0">
                    <area-shadow-chart :data="areaChartData" :height="195" />
                </div>
            </b-card>
        </b-colxx>
        <b-colxx sm="12" md="6" class="mb-4">
            <b-card class="dashboard-filled-line-chart" no-body>
                <b-card-body>
                    <div class="float-left float-none-xs">
                        <div class="d-inline-block">
                            <h5 class="d-inline">{{ $t('dashboards.conversion-rates') }}</h5>
                            <span class="text-muted text-small d-block">{{ $t('dashboards.per-session') }}</span>
                        </div>
                    </div>
                    <b-dropdown id="ddown5" :text="$t('dashboards.this-week')" size="xs" variant="outline-secondary" class="float-right float-none-xs mt-2">
                        <b-dropdown-item>{{ $t('dashboards.last-week') }}</b-dropdown-item>
                        <b-dropdown-item>{{ $t('dashboards.this-month') }}</b-dropdown-item>
                    </b-dropdown>
                </b-card-body>
                <div class="chart card-body pt-0">
                    <area-shadow-chart :data="conversionChartData" :height="195" />
                </div>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx lg="12" md="6" xl="4">
            <b-row>
                <b-colxx lg="4" xl="12" class="mb-4">
                    <gradient-with-radial-progress-card icon="iconsminds-clock" :title="`5 ${$t('dashboards.files')}`" :detail="$t('dashboards.pending-for-print')" :percent="5*100/12" progressText="5/12" />
                </b-colxx>
                <b-colxx lg="4" xl="12" class="mb-4">
                    <gradient-with-radial-progress-card icon="iconsminds-male" :title="`4 ${$t('dashboards.orders')}`" :detail="$t('dashboards.on-approval-process')" :percent="4*100/6" progressText="4/6" />
                </b-colxx>
                <b-colxx lg="4" xl="12" class="mb-4">
                    <gradient-with-radial-progress-card icon="iconsminds-bell" :title="`8 ${$t('dashboards.alerts')}`" :detail="$t('dashboards.waiting-for-notice')" :percent="8*100/10" progressText="8/10" />
                </b-colxx>
            </b-row>
        </b-colxx>

        <b-colxx lg="6" md="6" xl="4" sm="12" class="mb-4">
            <b-card class="dashboard-search" no-body>
                <b-card-body>
                    <h5 class="card-title text-white">{{ $t('dashboards.advanced-search') }}</h5>
                    <b-form class="form-container">
                        <b-form-group :label="$t('dashboards.toppings')">
                            <v-select :options="selectData" />
                        </b-form-group>
                        <b-form-group :label="$t('dashboards.type')">
                            <v-select :options="selectData" />
                        </b-form-group>
                        <b-form-group :label="$t('dashboards.keyword')">
                            <b-form-input type="text" :placeholder="$t('dashboards.keyword')"></b-form-input>
                        </b-form-group>
                        <b-form-group>
                            <b-form-checkbox>{{ $t('forms.custom-checkbox') }}</b-form-checkbox>
                        </b-form-group>
                        <b-form-group class="text-center">
                            <b-button type="submit" variant="primary" class="mt-4 btn-lg">{{ $t('dashboards.search') }}</b-button>
                        </b-form-group>
                    </b-form>
                </b-card-body>
            </b-card>
        </b-colxx>

        <b-colxx lg="6" xl="4" class="mb-4">
            <b-row>
                <b-colxx xxs="6" class="mb-4">
                    <small-line-chart-card class="dashboard-small-chart" label-prefix="$" :data="smallChartData1" />
                </b-colxx>
                <b-colxx xxs="6" class="mb-4">
                    <small-line-chart-card class="dashboard-small-chart" label-prefix="$" :data="smallChartData2" />
                </b-colxx>
                <b-colxx xxs="6" class="mb-4">
                    <small-line-chart-card class="dashboard-small-chart" label-prefix="$" :data="smallChartData3" />
                </b-colxx>
                <b-colxx xxs="6" class="mb-4">
                    <small-line-chart-card class="dashboard-small-chart" label-prefix="$" :data="smallChartData4" />
                </b-colxx>
            </b-row>

            <b-card class="dashboard-top-rated" :title="$t('dashboards.top-rated-items')">
                <glide-component :settings="glideTopRatedOption">
                    <top-rated-slide-item image="/assets/img/carousel-1.jpg" order="1" title="Cheesecake" rate="5" rate-count="48" />
                    <top-rated-slide-item image="/assets/img/carousel-2.jpg" order="2" title="Chocolate Cake" rate="4" rate-count="24" />
                    <top-rated-slide-item image="/assets/img/carousel-3.jpg" order="3" title="Cremeschnitte" rate="4" rate-count="18" />
                </glide-component>
            </b-card>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import GlideComponent from '../../../components/Carousel/GlideComponent'

import {
    CalendarView,
    CalendarViewHeader,
    CalendarMathMixin
} from 'vue-simple-calendar'

import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/Common/VuetablePaginationBootstrap'

import Draggable from 'vuedraggable'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import IconCard from '../../../components/Cards/IconCard'
import GradientCard from '../../../components/Cards/GradientCard'
import GradientWithRadialProgressCard from '../../../components/Cards/GradientWithRadialProgressCard'
import SmallLineChartCard from '../../../components/Cards/SmallLineChartCard'

import RadialProgressCard from '../../../components/Cards/RadialProgressCard'
import LineShadowChart from '../../../components/Charts/LineShadow'
import PolarAreaShadowChart from '../../../components/Charts/PolarAreaShadow'
import AreaShadowChart from '../../../components/Charts/AreaShadow'

import RecentOrderItem from '../../../components/Listing/RecentOrderItem'
import LogList from '../../../components/Listing/LogList'
import ListWithUserItem from '../../../components/Listing/ListWithUserItem'
import TwoColumnList from '../../../components/Listing/TwoColumnList'
import TopRatedSlideItem from '../../../components/Listing/TopRatedSlideItem'

import {
    lineChartData,
    polarAreaChartData,
    areaChartData,
    conversionChartData,
    smallChartData1,
    smallChartData2,
    smallChartData3,
    smallChartData4
} from '../../../data/charts'
import logs from '../../../data/logs'
import products from '../../../data/products'
import tickets from '../../../data/tickets'
import profileStatuses from '../../../data/profileStatuses'
import cakes from '../../../data/cakes'
import {
    apiUrl
} from '../../../constants/config'

export default {
    components: {
        'glide-component': GlideComponent,
        'icon-card': IconCard,
        'gradient-card': GradientCard,
        'line-shadow-chart': LineShadowChart,
        'recent-order-item': RecentOrderItem,
        'polar-area-shadow-chart': PolarAreaShadowChart,
        'area-shadow-chart': AreaShadowChart,
        'log-list': LogList,
        'list-with-user-item': ListWithUserItem,
        'calendar-view': CalendarView,
        'calendar-view-header': CalendarViewHeader,
        'vuetable': Vuetable,
        'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
        'two-column-list': TwoColumnList,
        'draggable': Draggable,
        'radial-progress-card': RadialProgressCard,
        'gradient-with-radial-progress-card': GradientWithRadialProgressCard,
        'v-select': vSelect,
        'small-line-chart-card': SmallLineChartCard,
        'top-rated-slide-item': TopRatedSlideItem
    },
    mixins: [CalendarMathMixin],
    data() {
        return {
            glideIconsOption: {
                gap: 5,
                perView: 4,
                type: "carousel",
                breakpoints: {
                    320: {
                        perView: 1
                    },
                    576: {
                        perView: 2
                    },
                    1600: {
                        perView: 3
                    },
                    1800: {
                        perView: 4
                    }
                },
                hideNav: true
            },
            lineChartData,
            products,
            polarAreaChartData,
            logs,
            tickets,
            calendar: {
                showDate: this.thisMonth(1),
                events: [{
                        id: 'e2',
                        startDate: this.thisMonth(15),
                        title: 'Meeting',
                        classes: 'secondary'
                    },
                    {
                        id: 'e3',
                        startDate: this.thisMonth(8, 9, 25),
                        endDate: this.thisMonth(9, 16, 30),
                        title: 'Sales',
                        classes: 'primary'
                    },
                    {
                        id: 'e5',
                        startDate: this.thisMonth(5),
                        endDate: this.thisMonth(12),
                        title: 'Tax Days',
                        classes: 'secondary'
                    },
                    {
                        id: 'e10',
                        startDate: this.thisMonth(27),
                        title: 'My Birthday!'
                    }
                ]
            },
            bestsellers: {
                apiUrl: apiUrl + '/cakes/fordatatable',
                fields: [{
                        name: 'title',
                        sortField: 'title',
                        title: 'Name',
                        titleClass: '',
                        dataClass: 'list-item-heading'
                    },
                    {
                        name: 'sales',
                        sortField: 'sales',
                        title: 'Sales',
                        titleClass: '',
                        dataClass: 'text-muted'
                    },
                    {
                        name: 'stock',
                        sortField: 'stock',
                        title: 'Stock',
                        titleClass: '',
                        dataClass: 'text-muted'
                    },
                    {
                        name: 'category',
                        sortField: 'category',
                        title: 'Category',
                        titleClass: '',
                        dataClass: 'text-muted'
                    }
                ]
            },
            profileStatuses,
            cakes,
            areaChartData,
            conversionChartData,
            selectData: [{
                    label: 'Chocolate',
                    value: 'chocolate'
                },
                {
                    label: 'Vanilla',
                    value: 'vanilla'
                },
                {
                    label: 'Strawberry',
                    value: 'strawberry'
                },
                {
                    label: 'Caramel',
                    value: 'caramel'
                },
                {
                    label: 'Cookies and Cream',
                    value: 'cookiescream'
                },
                {
                    label: 'Peppermint',
                    value: 'peppermint'
                }
            ],
            smallChartData1,
            smallChartData2,
            smallChartData3,
            smallChartData4,
            glideTopRatedOption: {
                gap: 5,
                perView: 1,
                type: "carousel",
                peek: {
                    before: 0,
                    after: 100
                },
                breakpoints: {
                    480: {
                        perView: 1
                    },
                    992: {
                        perView: 2
                    },
                    1200: {
                        perView: 1
                    }
                },
                hideNav: true
            },
        }
    },

    methods: {
        refreshButtonClick() {
            console.log('refreshButtonClick')
        },
        thisMonth(d, h, m) {
            const t = new Date()
            return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
        },
        onClickDay(d) {
            console.log(`You clicked: ${d.toLocaleDateString()}`)
        },
        onClickEvent(e) {
            console.log(`You clicked: ${e.title}`)
        },
        setShowDate(d) {
            this.calendar.showDate = d
        },
        onDropDate(event, date) {
            console.log(`You dropped ${event.id} on ${date.toLocaleDateString()}`)

            const eLength = this.dayDiff(event.startDate, date)
            event.originalEvent.startDate = this.addDays(event.startDate, eLength)
            event.originalEvent.endDate = this.addDays(event.endDate, eLength)
        },
        onPaginationData(paginationData) {
            this.$refs.pagination.setPaginationData(paginationData)
        },
        onChangePage(page) {
            this.$refs.vuetable.changePage(page)
        }
    }
}
</script>
