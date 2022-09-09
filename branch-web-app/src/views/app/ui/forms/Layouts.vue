<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.forms')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('forms.basic')">
          <b-form @submit.prevent="onBasicSubmit">
            <b-form-group :label="$t('forms.email')" :description="$t('forms.email-muted')">
              <b-form-input type="email" v-model="basicForm.email" :placeholder="$t('forms.email')" />
            </b-form-group>
            <b-form-group :label="$t('forms.password')">
              <b-form-input type="password" v-model="basicForm.password" :placeholder="$t('forms.password')"/>
            </b-form-group>
            <b-form-group>
              <b-form-checkbox v-model="basicForm.checked">{{ $t('forms.custom-checkbox') }}</b-form-checkbox>
            </b-form-group>
            <b-button type="submit" variant="primary" class="mt-4">{{ $t('forms.submit') }}</b-button>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>

  <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('forms.horizontal')">
          <b-form @submit.prevent="onHorizontalSubmit">
            <b-form-group label-cols="2" horizontal :label="$t('forms.email')">
              <b-form-input v-model="horizontalForm.email" :placeholder="$t('forms.email')"></b-form-input>
            </b-form-group>
            <b-form-group label-cols="2" horizontal :label="$t('forms.password')">
              <b-form-input type="password" v-model="horizontalForm.password" :placeholder="$t('forms.password')"/>
            </b-form-group>
            <b-form-group label-cols="2" horizontal :label="$t('forms.radios')">
              <b-form-radio-group stacked class="pt-2" :options="horizontalFormRadios" v-model="horizontalForm.radio" />
            </b-form-group>
            <b-form-group label-cols="2" horizontal :label="$t('forms.checkbox')">
              <b-form-checkbox v-model="horizontalForm.checked">{{ $t('forms.custom-checkbox') }}</b-form-checkbox>
            </b-form-group>
            <b-button type="submit" variant="primary" class="mt-4">{{ $t('forms.signin') }}</b-button>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>

  <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('forms.top-labels-over-line')">
          <b-form @submit.prevent="onTopLabelsOverLineFormSubmit">
            <label class="form-group has-float-label">
              <input type="email" class="form-control" v-model="topLabelsOverLineForm.email">
              <span>{{ $t('forms.email') }}</span>
            </label>
            <label class="form-group has-float-label">
              <input type="password" class="form-control" v-model="topLabelsOverLineForm.password">
              <span>{{ $t('forms.password') }}</span>
            </label>
            <div class="form-group has-float-label">
              <input-tag v-model="topLabelsOverLineForm.tags"></input-tag>
              <span>{{ $t('forms.tags') }}</span>
            </div>
            <div class="form-group has-float-label">
               <v-date-picker
                  mode="single"
                  v-model="topLabelsOverLineForm.date"
                  :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
              <span>{{ $t('forms.date') }}</span>
            </div>
            <div class="form-group has-float-label">
              <v-select v-model="topLabelsOverLineForm.select" :options="selectData" :dir="direction"/>
              <span>{{ $t('forms.state') }}</span>
            </div>
            <b-button type="submit" variant="primary" class="mt-4">{{ $t('forms.submit') }}</b-button>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>

  <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('forms.top-labels-in-input')">
          <b-form @submit.prevent="onTopLabelsInInputFormSubmit">
            <label class="form-group has-top-label">
              <input type="email" class="form-control" v-model="topLabelsInInputForm.email">
              <span>{{ $t('forms.email-u') }}</span>
            </label>
            <label class="form-group has-top-label">
              <input type="password" class="form-control" v-model="topLabelsInInputForm.password">
              <span>{{ $t('forms.password-u') }}</span>
            </label>
            <div class="form-group has-top-label">
              <input-tag v-model="topLabelsInInputForm.tags"></input-tag>
              <span>{{ $t('forms.tags-u') }}</span>
            </div>
            <div class="form-group has-top-label">
              <v-date-picker
                  mode="single"
                  v-model="topLabelsInInputForm.date"
                  :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
              <span>{{ $t('forms.date-u') }}</span>
            </div>
            <div class="form-group has-top-label">
              <v-select v-model="topLabelsInInputForm.select" :options="selectData" :dir="direction"/>
              <span>{{ $t('forms.state-u') }}</span>
            </div>
            <b-button type="submit" variant="primary" class="mt-4">{{ $t('forms.submit') }}</b-button>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>

  <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('forms.grid')">
          <b-form @submit.prevent="onGridFormSubmit">
            <b-row>

              <b-colxx sm="6">
                <b-form-group :label="$t('forms.email')">
                  <b-form-input type="email" v-model="gridForm.email" />
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group :label="$t('forms.password')">
                  <b-form-input type="password" v-model="gridForm.password"/>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group :label="$t('forms.address')">
                  <b-form-input v-model="gridForm.address1" ></b-form-input>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group :label="$t('forms.address2')">
                  <b-form-input v-model="gridForm.address2" ></b-form-input>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="6">
                <b-form-group :label="$t('forms.city')">
                  <b-form-input v-model="gridForm.city" ></b-form-input>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="4">
                <b-form-group :label="$t('forms.state')">
                  <b-form-select v-model="gridForm.state" :options="stateOptions" plain  />
                </b-form-group>
              </b-colxx>
              <b-colxx sm="2">
                <b-form-group :label="$t('forms.zip')">
                  <b-form-input v-model="gridForm.zip" ></b-form-input>
                </b-form-group>
              </b-colxx>
            </b-row>

            <b-button type="submit" variant="primary" class="mt-4">{{ $t('forms.signin') }}</b-button>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>

    <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('forms.inline')">
          <b-form @submit.prevent="onInlineSubmit" inline>
            <b-input-group>
              <b-form-input type="text" v-model="inlineForm.fullname" :placeholder="$t('forms.firstname')" class="mb-2 mr-sm-2 mb-sm-0" />
            </b-input-group>
            <b-input-group prepend="@">
              <b-form-input  type="text" v-model="inlineForm.lastname" :placeholder="$t('forms.lastname')" class="mb-2 mr-sm-2 mb-sm-0"/>
            </b-input-group>
            <b-form-group>
              <b-form-checkbox v-model="inlineForm.checked" class="mb-2 mr-sm-2 mb-sm-0">{{ $t('forms.custom-checkbox') }}</b-form-checkbox>
            </b-form-group>
            <b-button type="submit" variant="outline-primary" size="sm">{{ $t('forms.submit') }}</b-button>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>


  </div>
</template>
<script>
import InputTag from '../../../../components/Form/InputTag'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { getDirection } from '../../../../utils'

export default {
  components: {
    'input-tag' : InputTag,
    'v-select' : vSelect
  },
  data () {
    return {
      name: '',
      age: 0,
      basicForm: {
        email: '',
        password: '',
        checked: false
      },
      horizontalForm: {
        email: '',
        password: '',
        radio: '',
        checked: false
      },
      topLabelsOverLineForm: {
        email: '',
        password: '',
        tags: [],
        date: null,
        select: '',
        checked: false
      },
      topLabelsInInputForm: {
        email: '',
        password: '',
        tags: [],
        date: null,
        select: '',
        checked: false
      },
      gridForm: {
        email: '',
        password: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: ''
      },
      inlineForm: {
        fullname: '',
        lastname: '',
        checked: false
      },
      direction: getDirection().direction,
      horizontalFormRadios: [
        this.$t('forms.first-radio'),
        this.$t('forms.second-radio'),
        { text: this.$t('forms.third-radio-disabled'), disabled: true }
      ],
      selectData: [
        { label: 'Chocolate', value: 'chocolate' },
        { label: 'Vanilla', value: 'vanilla' },
        { label: 'Strawberry', value: 'strawberry' },
        { label: 'Caramel', value: 'caramel' },
        { label: 'Cookies and Cream', value: 'cookiescream' },
        { label: 'Peppermint', value: 'peppermint' }
      ],
      stateOptions: ['', 'Option1', 'Option2', 'Option3', 'Option4', 'Option5']
    }
  },
  
  methods: {
    onBasicSubmit () {
      console.log(JSON.stringify(this.basicForm))
    },
    onHorizontalSubmit () {
      console.log(JSON.stringify(this.horizontalForm))
    },
    onTopLabelsOverLineFormSubmit () {
      console.log(JSON.stringify(this.topLabelsOverLineForm))
    },
    onTopLabelsInInputFormSubmit () {
      console.log(JSON.stringify(this.topLabelsInInputForm))
    },
    onGridFormSubmit () {
      console.log(JSON.stringify(this.gridForm))
    },
    onInlineSubmit () {
      console.log(JSON.stringify(this.inlineForm))
    },
    
  }
}
</script>
