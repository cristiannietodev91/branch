<template>
<b-row>
    <b-colxx class="disable-text-selection">
        <b-row>
            <b-colxx xxs="12">
                <h1>{{ $t('menu.data-list') }}</h1>
                <div class="top-right-button-container">
                    <b-button v-b-modal.modalright variant="primary" size="lg" class="top-right-button">{{ $t('pages.add-new') }}</b-button>
                    <b-button-group>
                        <b-dropdown split right @click="selectAll(true)" class="check-button" variant="primary">
                            <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                                <input class="custom-control-input" type="checkbox" :checked="isSelectedAll" v-shortkey="{select: ['ctrl','a'], undo: ['ctrl','d']}" @shortkey="keymap">
                                <span :class="{
                'custom-control-label' :true,
                'indeterminate' : isAnyItemSelected
                }">&nbsp;</span>
                            </label>
                            <b-dropdown-item>{{$t('pages.delete')}}</b-dropdown-item>
                            <b-dropdown-item>{{$t('pages.another-action')}}</b-dropdown-item>
                        </b-dropdown>
                    </b-button-group>
                    <b-modal id="modalright" ref="modalright" :title="$t('pages.add-new-modal-title')" modal-class="modal-right">
                        <b-form>
                            <b-form-group :label="$t('pages.product-name')">
                                <b-form-input v-model="newItem.title" />
                            </b-form-group>
                            <b-form-group :label="$t('pages.category')">
                                <v-select :options="categories" v-model="newItem.category" />
                            </b-form-group>
                            <b-form-group :label="$t('pages.description')">
                                <b-textarea v-model="newItem.description" :rows="2" :max-rows="2" />
                            </b-form-group>
                            <b-form-group :label="$t('pages.status')">
                                <b-form-radio-group stacked class="pt-2" :options="statuses" v-model="newItem.status" />
                            </b-form-group>
                        </b-form>

                        <template slot="modal-footer">
                            <b-button variant="outline-secondary" @click="hideModal('modalright')">{{ $t('pages.cancel') }}</b-button>
                            <b-button variant="primary" @click="addNewItem()" class="mr-1">{{ $t('pages.submit') }}</b-button>
                        </template>
                    </b-modal>
                </div>
                <piaf-breadcrumb />
                <div class="mb-2 mt-2">
                    <b-button variant="empty" class="pt-0 pl-0 d-inline-block d-md-none" v-b-toggle.displayOptions>
                        {{ $t('pages.display-options') }}
                        <i class="simple-icon-arrow-down align-middle" />
                    </b-button>
                    <b-collapse id="displayOptions" class="d-md-block">
                        <span class="mr-3 d-inline-block float-md-left">
                            <a :class="{'mr-2 view-icon':true,'active': displayMode==='list'}" @click="changeDisplayMode('list')">
                                <data-list-icon />
                            </a>
                            <a :class="{'mr-2 view-icon':true,'active': displayMode==='thumb'}" @click="changeDisplayMode('thumb')">
                                <thumb-list-icon />
                            </a>
                            <a :class="{'mr-2 view-icon':true,'active': displayMode==='image'}" @click="changeDisplayMode('image')">
                                <image-list-icon />
                            </a>
                        </span>
                        <div class="d-block d-md-inline-block pt-1">
                            <b-dropdown id="ddown1" :text="`${$t('pages.orderby')} ${sort.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group" size="xs">
                                <b-dropdown-item v-for="(order,index) in sortOptions" :key="index" @click="changeOrderBy(order)">{{ order.label }}</b-dropdown-item>
                            </b-dropdown>

                            <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                                <b-input :placeholder="$t('menu.search')" v-model="search" />
                            </div>
                        </div>
                        <div class="float-md-right pt-1">
                            <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
                            <b-dropdown id="ddown2" right :text="`${perPage}`" variant="outline-dark" class="d-inline-block" size="xs">
                                <b-dropdown-item v-for="(size,index) in pageSizes" :key="index" @click="changePageSize(size)">{{ size }}</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </b-collapse>
                </div>
                <div class="separator mb-5" />
            </b-colxx>
        </b-row>
        <template v-if="isLoad">
            <b-row v-if="displayMode==='image'" key="image">
                <b-colxx sm="6" lg="4" xl="3" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
                    <image-list-item :key="item.id" :data="item" :selected-items="selectedItems" @toggle-item="toggleItem" v-contextmenu:contextmenu />
                </b-colxx>
            </b-row>
            <b-row v-else-if="displayMode==='thumb'" key="thumb">
                <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
                    <thumb-list-item :key="item.id" :data="item" :selected-items="selectedItems" @toggle-item="toggleItem" v-contextmenu:contextmenu />
                </b-colxx>
            </b-row>
            <b-row v-else-if="displayMode==='list'" key="list">
                <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
                    <data-list-item :key="item.id" :data="item" :selected-items="selectedItems" @toggle-item="toggleItem" v-contextmenu:contextmenu />
                </b-colxx>
            </b-row>
            <b-row v-if="lastPage>1">
                <b-colxx xxs="12">
                    <b-pagination-nav :number-of-pages="lastPage" :link-gen="linkGen" v-model="page" :per-page="perPage" align="center">
                        <template v-slot:next-text>
                            <i class="simple-icon-arrow-right" />
                        </template>
                        <template v-slot:prev-text>
                            <i class="simple-icon-arrow-left" />
                        </template>
                        <template v-slot:first-text>
                            <i class="simple-icon-control-start" />
                        </template>
                        <template v-slot:last-text>
                            <i class="simple-icon-control-end" />
                        </template>
                    </b-pagination-nav>
                </b-colxx>
            </b-row>
        </template>
        <template v-else>
            <div class="loading"></div>
        </template>
        <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu">
            <v-contextmenu-item @click="onContextCopy()">
                <i class="simple-icon-docs" />
                <span>Copy</span>
            </v-contextmenu-item>
            <v-contextmenu-item @click="onContextArchive()">
                <i class="simple-icon-drawer" />
                <span>Move to archive</span>
            </v-contextmenu-item>
            <v-contextmenu-item @click="onContextDelete()">
                <i class="simple-icon-trash" />
                <span>Delete</span>
            </v-contextmenu-item>
        </v-contextmenu>
    </b-colxx>
</b-row>
</template>

<script>
import {
    DataListIcon,
    ThumbListIcon,
    ImageListIcon
} from '../../../../components/Svg'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import axios from 'axios'

import ImageListItem from '../../../../components/Listing/ImageListItem'
import ThumbListItem from '../../../../components/Listing/ThumbListItem'
import DataListItem from '../../../../components/Listing/DataListItem'
import {
    apiUrl
} from '../../../../constants/config'

export default {
    components: {
        'data-list-icon': DataListIcon,
        'thumb-list-icon': ThumbListIcon,
        'image-list-icon': ImageListIcon,
        'v-select': vSelect,
        'image-list-item': ImageListItem,
        'thumb-list-item': ThumbListItem,
        'data-list-item': DataListItem
    },
    data() {
        return {
            isLoad: false,
            apiBase: apiUrl + '/cakes/fordatatable',
            displayMode: 'list',
            sort: {
                column: 'title',
                label: 'Product Name'
            },
            sortOptions: [{
                    column: 'title',
                    label: 'Product Name'
                },
                {
                    column: 'category',
                    label: 'Category'
                },
                {
                    column: 'status',
                    label: 'Status'
                }
            ],
            page: 1,
            perPage: 4,
            search: '',
            from: 0,
            to: 0,
            total: 0,
            lastPage: 0,
            items: [],
            pageSizes: [4, 8, 12],
            selectedItems: [],
            categories: [{
                    label: 'Cakes',
                    value: 'Cakes'
                },
                {
                    label: 'Cupcakes',
                    value: 'Cupcakes'
                },
                {
                    label: 'Desserts',
                    value: 'Desserts'
                }
            ],
            statuses: [{
                    text: 'ON HOLD',
                    value: 'ON HOLD'
                },
                {
                    text: 'PROCESSED',
                    value: 'PROCESSED'
                }
            ],
            newItem: {
                title: '',
                category: '',
                description: '',
                status: ''
            }
        }
    },
    methods: {
        loadItems() {
            this.isLoad = false

            axios
                .get(this.apiUrl)
                .then(response => {
                    return response.data
                })
                .then(res => {
                    this.total = res.total
                    this.from = res.from
                    this.to = res.to
                    this.items = res.data
                    this.perPage = res.per_page
                    this.selectedItems = []
                    this.lastPage = res.last_page
                    this.isLoad = true
                })
        },
        hideModal(refname) {
            this.$refs[refname].hide()
        },
        changeDisplayMode(displayType) {
            this.displayMode = displayType
        },
        changePageSize(perPage) {
            this.perPage = perPage
        },
        changeOrderBy(sort) {
            this.sort = sort
        },
        addNewItem() {
            console.log('adding item : ', this.newItem)
        },
        selectAll(isToggle) {
            if (this.selectedItems.length >= this.items.length) {
                if (isToggle) this.selectedItems = []
            } else {
                this.selectedItems = this.items.map(x => x.id)
            }
        },
        keymap(event) {
            switch (event.srcKey) {
                case 'select':
                    this.selectAll(false)
                    break
                case 'undo':
                    this.selectedItems = []
                    break
            }
        },
        getIndex(value, arr, prop) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][prop] === value) {
                    return i
                }
            }
            return -1
        },
        toggleItem(event, itemId) {
            if (event.shiftKey && this.selectedItems.length > 0) {
                let itemsForToggle = this.items
                var start = this.getIndex(itemId, itemsForToggle, 'id')
                var end = this.getIndex(
                    this.selectedItems[this.selectedItems.length - 1],
                    itemsForToggle,
                    'id'
                )
                itemsForToggle = itemsForToggle.slice(
                    Math.min(start, end),
                    Math.max(start, end) + 1
                )
                this.selectedItems.push(
                    ...itemsForToggle.map(item => {
                        return item.id
                    })
                )
            } else {
                if (this.selectedItems.includes(itemId)) {
                    this.selectedItems = this.selectedItems.filter(x => x !== itemId)
                } else this.selectedItems.push(itemId)
            }
        },
        handleContextmenu(vnode) {
            if (!this.selectedItems.includes(vnode.key)) {
                this.selectedItems = [vnode.key]
            }
        },
        onContextCopy() {
            console.log(
                'context menu item clicked - Copy Items: ',
                this.selectedItems
            )
        },
        onContextArchive() {
            console.log(
                'context menu item clicked - Move to Archive Items: ',
                this.selectedItems
            )
        },
        onContextDelete() {
            console.log(
                'context menu item clicked - Delete Items: ',
                this.selectedItems
            )
        },
        linkGen(pageNum) {
            return '#page-' + pageNum
        }
    },
    computed: {
        isSelectedAll() {
            return this.selectedItems.length >= this.items.length
        },
        isAnyItemSelected() {
            return (
                this.selectedItems.length > 0 &&
                this.selectedItems.length < this.items.length
            )
        },
        apiUrl() {
            return `${this.apiBase}?sort=${this.sort.column}&page=${
        this.page
      }&per_page=${this.perPage}&search=${this.search}`
        }
    },
    watch: {
        search() {
            this.page = 1
        },
        apiUrl() {
            this.loadItems()
        }
    },
    mounted() {
        this.loadItems()
    }
}
</script>
