<template>
  <b-card class="question d-flex mb-4 edit-quesiton" no-body>
    <div class="d-flex flex-grow-1 min-width-zero">
      <div class="card-body align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
        <div class="list-item-heading mb-0 truncate w-80 mb-1 mt-1">
          <span class="heading-number d-inline-block">{{ sort }}</span>{{ title }}
        </div>
      </div>

      <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
        <b-button v-if="mode=='edit'" variant="outline-theme-3" class="icon-button" @click="changeMode('preview')">
          <i class="simple-icon-eye" />
        </b-button>
        <b-button v-if="mode=='preview'" variant="outline-theme-3" class="icon-button" @click="changeMode('edit')">
          <i class="simple-icon-pencil" />
        </b-button>

        <b-button
          variant="outline-theme-3" class="icon-button rotate-icon-click rotate"
          :aria-controls="`questionCollapse${sort}`"
          :aria-expanded="showDetail ? 'true' : 'false'"
          @click="showDetail = !showDetail"
        >
          <i :class="{'with-rotate-icon':true,'simple-icon-arrow-down':!showDetail,'simple-icon-arrow-up':showDetail}" />
        </b-button>
      </div>
    </div>
    <b-collapse :id="`questionCollapse${sort}`" v-model="showDetail" class="question-collapse">
      <div class="card-body pt-0">
        <div v-if="mode=='edit'" key="edit">
          <div class="form-group mb-3">
            <label>Title</label>
            <b-input v-model="title" />
          </div>
          <div class="form-group mb-5">
            <label>Question</label>
            <b-input v-model="question" />
          </div>

          <div class="separator mb-4" />

          <div class="form-group">
            <label class="d-block">Answer Type</label>
            <v-select v-model="answerType" :options="questionTypes">
              <template #option="option">
                {{ option.label }}
              </template>
            </v-select>
          </div>

          <div v-if="answerType.options" class="form-group">
            <label class="d-block">Answers</label>
            <draggable type="div" class="answers mb-3 sortable" :options="{handle:'.handle'}">
              <div v-for="(a,index) in answers" :key="index" class="mb-1 position-relative">
                <b-input :value="a.label" />
                <div class="input-icons">
                  <span class="badge badge-pill handle pr-0 mr-0"><i class="simple-icon-cursor-move" /></span>
                  <span class="badge badge-pill" @click="deleteAnswer(a.value)"><i class="simple-icon-ban" /></span>
                </div>
              </div>
            </draggable>

            <div class="text-center">
              <b-button variant="outline-primary" size="sm" class="mb-2" @click="addAnswer">
                <i class="simple-icon-plus btn-group-icon" /> Add Answer
              </b-button>
            </div>
          </div>
        </div>
        <div v-else-if="mode=='preview'" key="preview">
          <label>{{ question }}</label>

          <b-input v-if="answerType.value==0" key="text-input-preview" />
          <v-select v-else-if="answerType.value==1" key="single-select-preview" :options="answers" />
          <v-select v-else-if="answerType.value==2" key="multiple-select-preview" :options="answers" />
          <b-form-checkbox-group v-else-if="answerType.value==3" key="checkbox-preview" stacked>
            <b-form-checkbox v-for="(a,index) in answers" :key="`ans_${index}`" :value="a.value">
              {{ a.label }}
            </b-form-checkbox>
          </b-form-checkbox-group>
          <b-form-radio-group v-else-if="answerType.value==4" key="radiobutton-preview" stacked>
            <b-form-radio v-for="(a,index) in answers" :key="`ans_${index}`" :value="a.value">
              {{ a.label }}
            </b-form-radio>
          </b-form-radio-group>
        </div>
      </div>
    </b-collapse>
  </b-card>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Draggable from 'vuedraggable'

const questionTypes = [{ label: 'Text Input', value: 0, options: false },
  { label: 'Single Select', value: 1, options: true },
  { label: 'Multiple Select', value: 2, options: true },
  { label: 'Checkbox', value: 3, options: true },
  { label: 'Radiobutton', value: 4, options: true }]

export default {
  components: {
    'v-select' :vSelect,
    'draggable' :Draggable
  },
  props: ['data', 'sort'],
  data () {
    return {
      questionTypes,
      mode: 'edit', // edit,
      showDetail: false,
      title: '',
      question: '',
      answers: null,
      answerType: questionTypes[0]
    }
  },
  watch: {
    showDetail () {
    }
  },
  mounted () {
    this.title = this.data.title
    this.question = this.data.question
    this.answers = this.data.answers
    this.answerType = questionTypes.find(x => x.value === this.data.answerType)
  },
  methods: {
    changeMode (mode) {
      this.mode = mode
      this.showDetail = true
    },
    deleteAnswer (value) {
      this.answers = this.answers.filter(x => x.value !== value)
    },
    addAnswer () {
      this.answers.push({ value: this.answers.length + 1, label: '' })
    }
  }
}
</script>
