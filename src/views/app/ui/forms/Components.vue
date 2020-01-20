<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <piaf-breadcrumb :heading="$t('menu.form-components')" />
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('form-components.custom-inputs')">
                <b-form-group :label="$t('form-components.checkboxes')">
                    <b-form-checkbox-group stacked>
                        <b-form-checkbox value="first">Check this custom checkbox</b-form-checkbox>
                        <b-form-checkbox value="second">Or this one</b-form-checkbox>
                        <b-form-checkbox value="third" disabled>But not this disabled one</b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
                <b-form-group :label="$t('form-components.radios')">
                    <b-form-radio-group stacked>
                        <b-form-radio value="first">Select this custom radio</b-form-radio>
                        <b-form-radio value="second">Or this one</b-form-radio>
                        <b-form-radio value="third" disabled>But not this disabled one</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
                <b-form-group :label="$t('form-components.inline')">
                    <b-form-checkbox-group>
                        <b-form-checkbox value="first">An inline custom input</b-form-checkbox>
                        <b-form-checkbox value="second">and another one</b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('form-components.vue-select')">
                <b-form>
                    <b-row>
                        <b-colxx xxs="12" md="4">
                            <b-form-group :label="$t('form-components.state-single')">
                                <v-select v-model="vueSelectForm.single" :options="selectData" :dir="direction" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx xxs="12" md="4">
                            <b-form-group :label="$t('form-components.state-multiple')">
                                <v-select v-model="vueSelectForm.multiple" multiple :options="selectData" :dir="direction" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx xxs="12" md="4">
                            <b-form-group :label="$t('form-components.state-multiple')">
                                <v-select label="name" :filterable="false" :options="vueSelectOptions" @search="fetchOptions" :dir="direction">
                                    <template slot="no-options">
                                        type to search GitHub repositories..
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                            <img :src='option.owner.avatar_url' height="25" />
                                            {{ option.full_name }}
                                        </div>
                                    </template>
                                    <template slot="selected-option" slot-scope="option">
                                        <div class="selected d-center">
                                            <img :src='option.owner.avatar_url' height="18" />
                                            {{ option.full_name }}
                                        </div>
                                    </template>
                                    <template slot="spinner" slot-scope="spinner">
                                        <div class="spinner-border text-primary" v-show="spinner"></div>
                                    </template>
                                </v-select>
                            </b-form-group>
                        </b-colxx>

                    </b-row>
                </b-form>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('form-components.vue-autosuggest')">
                <b-form>
                    <b-row>
                        <b-colxx xxs="12" md="6">
                            <vue-autosuggest class="autosuggest" :suggestions="filteredOptions" @selected="onAutosuggestSelected" :render-suggestion="renderSuggestion" :get-suggestion-value="getSuggestionValue" :limit="6" :input-props="{id:'autosuggest__input', class:'form-control', onInputChange: this.onAutoSuggestInputChange, placeholder:$t('form-components.type-a-cake')}" />
                        </b-colxx>
                    </b-row>
                </b-form>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xxs="12" xl="8" class="mb-4">
            <b-card :title="$t('form-components.date-picker')">
                <b-form>
                    <b-row class="mb-5">
                        <b-colxx xxs="12">
                            <label>{{$t('form-components.date')}}</label>
                        </b-colxx>
                        <b-colxx xxs="12">
                            <v-date-picker mode="single" v-model="selectedValueSingle" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
                        </b-colxx>
                    </b-row>

                    <b-row class="mb-5">
                        <b-colxx xxs="12">
                            <label>{{$t('form-components.date-range')}}</label>
                        </b-colxx>
                        <b-colxx xxs="12">
                            <v-date-picker mode="range" v-model="selectedValueRange" :input-props="{ class: 'form-control', placeholder: $t('form-components.date-range')}"></v-date-picker>
                        </b-colxx>
                    </b-row>

                    <b-row class="mb-5">
                        <b-colxx xxs="12">
                            <label>{{$t('form-components.disabled-dates')}}</label>
                        </b-colxx>
                        <b-colxx xxs="12">
                            <v-date-picker mode="single" v-model="selectedValueDisabled" :disabled-dates="{ weekdays: [1, 7] }" :input-props="{ class: 'form-control', placeholder: $t('form-components.disabled-dates')}"></v-date-picker>
                        </b-colxx>
                    </b-row>
                </b-form>
            </b-card>
        </b-colxx>

        <b-colxx xxs="12" xl="4" class="mb-4">
            <b-card :title="$t('form-components.embedded')">
                <b-form>
                    <b-row class="mb-0">
                        <b-colxx xxs="12">
                            <b-form-group>
                                <v-date-picker mode="single" class="is-expanded" v-model="selectedValueSingleInline" :is-inline="true" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
                            </b-form-group>
                        </b-colxx>
                    </b-row>
                </b-form>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('form-components.dropzone')">
                <b-form>
                    <b-row>
                        <b-colxx xxs="12">
                            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
                        </b-colxx>
                    </b-row>
                </b-form>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('form-components.tags')">
                <b-form>
                    <b-row>
                        <b-colxx xxs="12">
                            <input-tag v-model="tags" :placeholder="$t('form-components.tags')"></input-tag>
                        </b-colxx>
                    </b-row>
                </b-form>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('form-components.switch')">
                <b-form>
                    <b-row class="mb-3">
                        <b-colxx xxs="6">
                            <b-row>
                                <b-colxx xxs="12">
                                    <label>{{$t('form-components.primary')}}</label>
                                </b-colxx>
                                <b-colxx xxs="12">
                                    <switches v-model="switches.primary" theme="custom" color="primary"></switches>
                                </b-colxx>
                            </b-row>
                        </b-colxx>
                        <b-colxx xxs="6">
                            <b-row>
                                <b-colxx xxs="12">
                                    <label>{{$t('form-components.secondary')}}</label>
                                </b-colxx>
                                <b-colxx xxs="12">
                                    <switches v-model="switches.secondary" theme="custom" color="secondary"></switches>
                                </b-colxx>
                            </b-row>
                        </b-colxx>
                    </b-row>

                    <b-row>
                        <b-colxx xxs="6">
                            <b-row>
                                <b-colxx xxs="12">
                                    <label>{{$t('form-components.primary-inverse')}}</label>
                                </b-colxx>
                                <b-colxx xxs="12">
                                    <switches v-model="switches.primaryInverse" theme="custom" color="primary-inverse"></switches>
                                </b-colxx>
                            </b-row>
                        </b-colxx>
                        <b-colxx xxs="6">
                            <b-row>
                                <b-colxx xxs="12">
                                    <label>{{$t('form-components.secondary-inverse')}}</label>
                                </b-colxx>
                                <b-colxx xxs="12">
                                    <switches v-model="switches.secondaryInverse" theme="custom" color="secondary-inverse"></switches>
                                </b-colxx>
                            </b-row>
                        </b-colxx>
                    </b-row>
                </b-form>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('form-components.slider')">
                <b-row class="mb-3">
                    <b-colxx xxs="12" sm="6">
                        <b-row>
                            <b-colxx xxs="12">
                                <label>{{$t('form-components.double-slider')}}</label>
                            </b-colxx>
                            <b-colxx xxs="12" class="mb-5">
                                <vue-slider ref="slider" v-model="sliderDoubleValue" tooltip-dir="['bottom']" :piecewise="true" :data="sliderData" :direction=direction></vue-slider>
                            </b-colxx>
                        </b-row>
                    </b-colxx>
                    <b-colxx xxs="12" sm="6">
                        <b-row>
                            <b-colxx xxs="12">
                                <label>{{$t('form-components.single-slider')}}</label>
                            </b-colxx>
                            <b-colxx xxs="12" class="mb-5">
                                <vue-slider ref="sliderSingle" v-model="sliderValue" tooltip-dir="['bottom']" :min="10" :max="100" :direction=direction></vue-slider>
                            </b-colxx>
                        </b-row>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('form-components.rating')">
                <b-row>
                    <b-colxx xxs="12" sm="6">
                        <b-row>
                            <b-colxx xxs="12">
                                <label>{{$t('form-components.interactive')}}</label>
                            </b-colxx>
                            <b-colxx xxs="12">
                                <stars v-model="rate"></stars>
                            </b-colxx>
                        </b-row>
                    </b-colxx>
                    <b-colxx xxs="12" sm="6">
                        <b-row>
                            <b-colxx xxs="12">
                                <label>{{$t('form-components.readonly')}}</label>
                            </b-colxx>
                            <b-colxx xxs="12">
                                <stars v-model="disabledRate" :disabled="true"></stars>
                            </b-colxx>
                        </b-row>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import {
    VueAutosuggest
} from 'vue-autosuggest'
import VueDropzone from 'vue2-dropzone'
import InputTag from '../../../../components/Form/InputTag'
import Switches from 'vue-switches'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import Stars from '../../../../components/Common/Stars'
import {
    setTimeout
} from 'timers'
import {
    getDirection
} from '../../../../utils'
export default {
    components: {
        'v-select': vSelect,
        'vue-autosuggest': VueAutosuggest,
        'vue-dropzone': VueDropzone,
        'input-tag': InputTag,
        'switches': Switches,
        'vue-slider': VueSlider,
        'stars': Stars
    },
    data() {
        return {
            rate: 3,
            disabledRate: 4,
            sliderValue: 65,
            sliderDoubleValue: [100, 400],
            sliderData: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
            selectedValueSingle: new Date(),
            selectedValueDisabled: new Date(),
            selectedValueSingleInline: new Date(),
            selectedValueRange: {
                start: new Date(2018, 12, 9),
                end: new Date(2018, 12, 18)
            },
            vueSelectForm: {
                single: '',
                multiple: []
            },
            vueSelectOptions: [],
            direction: getDirection().direction,
            selectData: [
                'Chocolate',
                'Vanilla',
                'Strawberry',
                'Caramel',
                'Cookies and Cream',
                'Peppermint'
            ],
            vueAutosuggestForm: {
                selected: {}
            },
            filteredOptions: [],
            suggestions: [{
                data: [{
                        id: 1,
                        name: 'Marble Cake'
                    },
                    {
                        id: 2,
                        name: 'Fruitcake'
                    },
                    {
                        id: 3,
                        name: 'Chocolate Cake'
                    },
                    {
                        id: 4,
                        name: 'Fat Rascal'
                    },
                    {
                        id: 5,
                        name: 'Financier'
                    },
                    {
                        id: 6,
                        name: 'Genoise'
                    },
                    {
                        id: 7,
                        name: 'Gingerbread'
                    },
                    {
                        id: 8,
                        name: 'Goose Breast'
                    },
                    {
                        id: 9,
                        name: 'Parkin'
                    },
                    {
                        id: 10,
                        name: 'Petit Gâteau'
                    },
                    {
                        id: 11,
                        name: 'Salzburger Nockerl'
                    },
                    {
                        id: 12,
                        name: 'Soufflé'
                    },
                    {
                        id: 13,
                        name: 'Streuselkuchen'
                    },
                    {
                        id: 14,
                        name: 'Tea Loaf'
                    },
                    {
                        id: 15,
                        name: 'Napoleonshat'
                    },
                    {
                        id: 16,
                        name: 'Merveilleux'
                    },
                    {
                        id: 17,
                        name: 'Magdalena'
                    },
                    {
                        id: 18,
                        name: 'Cremeschnitte'
                    },
                    {
                        id: 19,
                        name: 'Cheesecake'
                    },
                    {
                        id: 20,
                        name: 'Bebinca'
                    }
                ]
            }],
            dropzoneOptions: {
                url: 'https://httpbin.org/post',
                thumbnailHeight: 160,
                maxFilesize: 2,
                previewTemplate: this.dropzoneTemplate(),
                headers: {
                    'My-Awesome-Header': 'header value'
                }
            },
            tags: [],
            switches: {
                primary: true,
                secondary: false,
                primaryInverse: false,
                secondaryInverse: true
            }
        }
    },
    mounted() {
        const that = this
        setTimeout(() => {
            that.$refs.slider.refresh()
            that.$refs.sliderSingle.refresh()
        }, 500)
    },
    methods: {
        onAutoSuggestInputChange(text, oldText) {
            if (text === null) {
                /* Maybe the text is null but you wanna do
                 *  something else, but don't filter by null.
                 */
                return
            }

            const filteredData = this.suggestions[0].data.filter(option => {
                return option.name.toLowerCase().indexOf(text.toLowerCase()) > -1
            })

            // Store data in one property, and filtered in another
            this.filteredOptions = [{
                data: filteredData
            }]
        },

        onAutosuggestSelected(item) {
            this.vueAutosuggestForm.selected = item
        },
        renderSuggestion(suggestion) {
            const character = suggestion.item
            return character.name /* renderSuggestion will override the default suggestion template slot. */
        },
        getSuggestionValue(suggestion) {
            return suggestion.item.name
        },

        dropzoneTemplate() {
            return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `
        },
        fetchOptions(search, loading) {
            loading(true)
            setTimeout(() => {
                fetch(
                    `https://api.github.com/search/repositories?q=${escape(search)}`
                ).then(res => {
                    res.json().then(json => (this.vueSelectOptions = json.items))
                    loading(false)
                })
            }, 1000)
        }

    }
}
</script>
