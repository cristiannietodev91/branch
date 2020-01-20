<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <piaf-breadcrumb :heading="$t('menu.content')" />
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xl="6" lg="12">
            <div class="icon-cards-row">
                <glide-component :settings="glideIconsOption">
                    <icon-card :title="$t('dashboards.pending-orders')" icon="iconsminds-clock" :value=14 />
                    <icon-card :title="$t('dashboards.completed-orders')" icon="iconsminds-basket-coins" :value=32 />
                    <icon-card :title="$t('dashboards.refund-requests')" icon="iconsminds-arrow-refresh" :value=74 />
                    <icon-card :title="$t('dashboards.new-comments')" icon="iconsminds-mail-read" :value=25 />
                </glide-component>
            </div>
            <b-row>
                <b-colxx md="12">
                    <b-card class="mb-4 dashboard-quick-post" :title="$t('dashboards.quick-post')">
                        <b-refresh-button @click="refreshButtonClick" />
                        <b-form @submit.prevent="quickPostSubmit">
                            <b-form-group horizontal label-cols="3" breakpoint="sm" :label="$t('dashboards.title')">
                                <b-form-input v-model="quickPost.title" :placeholder="$t('dashboards.title')"></b-form-input>
                            </b-form-group>
                            <b-form-group horizontal label-cols="3" breakpoint="sm" :label="$t('dashboards.content')">
                                <b-textarea v-model="quickPost.content" :placeholder="$t('dashboards.content')" :rows="4" :max-rows="4" />
                            </b-form-group>
                            <b-form-group horizontal label-cols="3" breakpoint="sm" :label="$t('dashboards.category')">
                                <v-select :options="selectData" :dir="direction" />
                            </b-form-group>
                            <b-button type="submit" variant="primary" class="float-right">{{ $t('dashboards.save-and-publish') }}</b-button>
                        </b-form>
                    </b-card>
                </b-colxx>
            </b-row>
        </b-colxx>

        <b-colxx lg="12" xl="6">
            <b-card :title="$t('dashboards.top-viewed-posts')">
                <vuetable ref="vuetable" :api-url="bestsellers.apiUrl" :fields="bestsellers.fields" :per-page="6" pagination-path="" @vuetable:pagination-data="onPaginationData"></vuetable>
                <vuetable-pagination-bootstrap ref="pagination" @vuetable-pagination:change-page="onChangePage" />
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx lg="4" md="6" class="mb-4">
            <b-card :title="$t('dashboards.cakes')" class="dashboard-link-list">
                <two-column-list :data="cakes" />
            </b-card>
        </b-colxx>

        <b-colxx lg="8" md="12" class="mb-4">
            <b-card :title="$t('dashboards.new-comments')" class="dashboard-link-list">
                <vue-perfect-scrollbar class="scroll dashboard-list-with-user" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                    <list-with-user-item v-for="(item, index) in comments" :data="item" detail-path="/app/pages/product/details" :key="index" />
                </vue-perfect-scrollbar>
            </b-card>
        </b-colxx>
    </b-row>

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
        <b-colxx lg="4" class="mb-4">
            <gradient-with-radial-progress-card icon="iconsminds-clock" :title="`5 ${$t('dashboards.posts')}`" :detail="$t('dashboards.pending-for-publish')" :percent="5*100/12" progressText="5/12" />
        </b-colxx>
        <b-colxx lg="4" class="mb-4">
            <gradient-with-radial-progress-card icon="iconsminds-male" :title="`4 ${$t('dashboards.users')}`" :detail="$t('dashboards.on-approval-process')" :percent="4*100/6" progressText="4/6" />
        </b-colxx>
        <b-colxx lg="4" class="mb-4">
            <gradient-with-radial-progress-card icon="iconsminds-bell" :title="`8 ${$t('dashboards.alerts')}`" :detail="$t('dashboards.waiting-for-notice')" :percent="8*100/10" progressText="8/10" />
        </b-colxx>
    </b-row>

</div>
</template>

<script>
import GlideComponent from '../../../components/Carousel/GlideComponent'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/Common/VuetablePaginationBootstrap'

import IconCard from '../../../components/Cards/IconCard'
import GradientWithRadialProgressCard from '../../../components/Cards/GradientWithRadialProgressCard'
import AreaShadowChart from '../../../components/Charts/AreaShadow'
import TwoColumnList from '../../../components/Listing/TwoColumnList'
import ListWithUserItem from '../../../components/Listing/ListWithUserItem'

import {
    areaChartData,
    conversionChartData
} from '../../../data/charts'
import cakes from '../../../data/cakes'
import {
    comments
} from '../../../data/comments'
import {
    getDirection
} from '../../../utils'
import {
    apiUrl
} from '../../../constants/config'

export default {
    components: {
        'glide-component': GlideComponent,
        'icon-card': IconCard,
        'v-select': vSelect,
        'vuetable': Vuetable,
        'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
        'two-column-list': TwoColumnList,
        'list-with-user-item': ListWithUserItem,
        'area-shadow-chart': AreaShadowChart,
        'gradient-with-radial-progress-card': GradientWithRadialProgressCard
    },
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
            quickPost: {
                title: '',
                content: '',
                category: ''
            },
            direction: getDirection().direction,
            areaChartData,
            conversionChartData,
            cakes,
            comments,
            bestsellers: {
                apiUrl: apiUrl + '/cakes/fordatatable',
                fields: [{
                    name: 'title',
                    sortField: 'title',
                    title: 'Name',
                    titleClass: '',
                    dataClass: 'list-item-heading'
                }, {
                    name: 'sales',
                    sortField: 'sales',
                    title: 'Sales',
                    titleClass: '',
                    dataClass: 'text-muted'
                }, {
                    name: 'stock',
                    sortField: 'stock',
                    title: 'Stock',
                    titleClass: '',
                    dataClass: 'text-muted'
                }, {
                    name: 'category',
                    sortField: 'category',
                    title: 'Category',
                    titleClass: '',
                    dataClass: 'text-muted'
                }]
            }
        }
    },
    methods: {
        refreshButtonClick() {
            console.log('refreshButtonClick')
        },
        onPaginationData(paginationData) {
            this.$refs.pagination.setPaginationData(paginationData)
        },
        onChangePage(page) {
            this.$refs.vuetable.changePage(page)
        },
        quickPostSubmit() {
            console.log(this.quickPost)
        }
    }
}
</script>
