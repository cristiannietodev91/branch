<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <piaf-breadcrumb :heading="$t('menu.ecommerce')" />
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
                    <doughnut-shadow-chart :data="doughnutChartData" :height="300" />
                </div>
            </b-card>
        </b-colxx>

        <b-colxx lg="4" md="6" class="mb-4">
            <b-card :title="$t('dashboards.tickets')" class="dashboard-link-list">
                <vue-perfect-scrollbar class="scroll dashboard-list-with-user" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                    <list-with-user-item v-for="(ticket, index) in tickets" :data="ticket" detail-path="/app/pages/product/details" :key="index" />
                </vue-perfect-scrollbar>
            </b-card>
        </b-colxx>

        <b-colxx lg="4" md="6" class="mb-4">
            <b-card :title="$t('dashboards.cakes')" class="dashboard-link-list">
                <two-column-list :data="cakes" />
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
                <vuetable-pagination-bootstrap ref="pagination" @vuetable-pagination:change-page="onChangePage"></vuetable-pagination-bootstrap>
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

import IconCard from '../../../components/Cards/IconCard'
import LineShadowChart from '../../../components/Charts/LineShadow'
import DoughnutShadowChart from '../../../components/Charts/DoughnutShadow'

import RecentOrderItem from '../../../components/Listing/RecentOrderItem'
import ListWithUserItem from '../../../components/Listing/ListWithUserItem'
import TwoColumnList from '../../../components/Listing/TwoColumnList'

import {
    lineChartData,
    doughnutChartData
} from '../../../data/charts'
import products from '../../../data/products'
import tickets from '../../../data/tickets'
import cakes from '../../../data/cakes'
import {
    apiUrl
} from '../../../constants/config'

export default {
    components: {
        'icon-card': IconCard,
        'glide-component' : GlideComponent,        
        'line-shadow-chart': LineShadowChart,
        'recent-order-item': RecentOrderItem,
        'list-with-user-item': ListWithUserItem,
        'calendar-view': CalendarView,
        'calendar-view-header': CalendarViewHeader,
        'vuetable': Vuetable,
        'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
        'two-column-list': TwoColumnList,
        'doughnut-shadow-chart': DoughnutShadowChart,
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
            doughnutChartData,
            products,
            cakes,
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
            }
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
