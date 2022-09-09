<template>
<div class="disable-text-selection">
    <b-row class="app-row survey-app pb-4">
        <b-colxx xxs="12" v-if="isLoadSurveys" key="surveyDetail">
            <h1 v-if="currentSurvey">
                <i :class="{
              'heading-icon': true,
              'simple-icon-check': currentSurvey.status === 'COMPLETED',
              'simple-icon-refresh': currentSurvey.status !== 'COMPLETED'
            }" />
                <span class="align-middle d-inline-block pt-1">
                    {{ currentSurvey.title }}
                </span>
            </h1>
            <div class="top-right-button-container">
                <b-button-group>
                    <b-button variant="outline-primary" size="lg" class="flex-grow-1 mr-1">{{ $t("survey.save") }}</b-button>
                    <b-dropdown right variant="outline-primary" toggle-class="spaced-content xs">
                        <b-dropdown-item>{{ $t("survey.delete") }}</b-dropdown-item>
                        <b-dropdown-item>{{ $t("survey.edit") }}</b-dropdown-item>
                    </b-dropdown>
                </b-button-group>
            </div>
            <piaf-breadcrumb />
            <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" v-model="tabIndex" :no-fade="true" v-if="isLoadSurveys" key="itemList">
                <b-tab :title="$t('survey.details')">
                    <b-row>
                        <b-colxx xxs="12" lg="4" class="mb-4">
                            <b-card class="mb-4" no-body>
                                <b-card-body>
                                    <p class="list-item-heading mb-4">
                                        {{ $t("survey.summary") }}
                                    </p>
                                    <p class="text-muted text-small mb-2">
                                        {{ $t("survey.title") }}
                                    </p>
                                    <p class="mb-3">{{ currentSurvey.title }}</p>
                                    <p class="text-muted text-small mb-2">
                                        {{ $t("survey.details-lowercase") }}
                                    </p>
                                    <p class="mb-3" v-html="currentSurvey.detail" />
                                    <p class="text-muted text-small mb-2">
                                        {{ $t("survey.category") }}
                                    </p>
                                    <p class="mb-3">{{ currentSurvey.category }}</p>
                                    <p class="text-muted text-small mb-2">
                                        {{ $t("survey.label") }}
                                    </p>
                                    <div>
                                        <p class="d-sm-inline-block mb-1">
                                            <b-badge :variant="currentSurvey.labelColor" pill>
                                                {{ currentSurvey.label }}</b-badge>
                                        </p>
                                        <p class="d-sm-inline-block mb-1" />
                                    </div>
                                </b-card-body>
                            </b-card>
                        </b-colxx>
                        <b-colxx xxs="12" lg="8">
                            <div class="sortable-survey">
                                <draggable type="ul" class="list-unstyled mb-4" :options="{ handle: '.drag' }">
                                    <question-builder class="drag" v-for="(question, index) in currentSurvey.questions" :key="`question_${index}`" :data="question" :sort="index + 1" />
                                </draggable>
                            </div>
                            <div class="text-center">
                                <b-button variant="outline-primary" class="mt-3" @click="addQuestion"><i class="simple-icon-plus btn-group-icon" />
                                    {{ $t("survey.add-question") }}</b-button>
                            </div>
                        </b-colxx>
                    </b-row>
                </b-tab>
                <b-tab :title="$t('survey.results')">
                    <b-row>
                        <b-colxx xxs="12" lg="4">
                            <b-card class="mb-4" no-body>
                                <b-card-body>
                                    <p class="list-item-heading mb-4">
                                        {{ $t("survey.quota") }}
                                    </p>
                                    <div class="mb-4">
                                        <p class="mb-2">Gender</p>
                                        <b-progress class="mb-3">
                                            <b-progress-bar :value="60" variant="theme-1"></b-progress-bar>
                                            <b-progress-bar :value="40" variant="theme-2"></b-progress-bar>
                                        </b-progress>

                                        <table class="table table-sm table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td class="p-0 pb-1 w-10">
                                                        <span class="log-indicator border-theme-1 align-middle"></span>
                                                    </td>
                                                    <td class="p-0 pb-1">
                                                        <span class="font-weight-medium text-muted text-small">105/125 Male</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="p-0 pb-1 w-10">
                                                        <span class="log-indicator border-theme-2 align-middle"></span>
                                                    </td>
                                                    <td class="p-0 pb-1">
                                                        <span class="font-weight-medium text-muted text-small">90/125 Female</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="mb-4">
                                        <p class="mb-2">Education</p>
                                        <b-progress class="mb-3">
                                            <b-progress-bar :value="80" variant="theme-1"></b-progress-bar>
                                            <b-progress-bar :value="20" variant="theme-2"></b-progress-bar>
                                        </b-progress>
                                        <table class="table table-sm table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td class="p-0 pb-1 w-10">
                                                        <span class="log-indicator border-theme-1 align-middle" />
                                                    </td>
                                                    <td class="p-0 pb-1">
                                                        <span class="font-weight-medium text-muted text-small">139/125 College</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="p-0 pb-1 w-10">
                                                        <span class="log-indicator border-theme-2 align-middle" />
                                                    </td>
                                                    <td class="p-0 pb-1">
                                                        <span class="font-weight-medium text-muted text-small">95/125 High School</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="mb-4">
                                        <p class="mb-2">Age</p>
                                        <b-progress class="mb-3">
                                            <b-progress-bar :value="35" variant="theme-1"></b-progress-bar>
                                            <b-progress-bar :value="25" variant="theme-2"></b-progress-bar>
                                            <b-progress-bar :value="40" variant="theme-3"></b-progress-bar>
                                        </b-progress>
                                        <table class="table table-sm table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td class="p-0 pb-1 w-10">
                                                        <span class="log-indicator border-theme-1 align-middle" />
                                                    </td>
                                                    <td class="p-0 pb-1">
                                                        <span class="font-weight-medium text-muted text-small">50/75 18-24</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="p-0 pb-1 w-10">
                                                        <span class="log-indicator border-theme-2 align-middle" />
                                                    </td>
                                                    <td class="p-0 pb-1">
                                                        <span class="font-weight-medium text-muted text-small">40/75 24-30</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="p-0 pb-1 w-10">
                                                        <span class="log-indicator border-theme-3 align-middle" />
                                                    </td>
                                                    <td class="p-0 pb-1">
                                                        <span class="font-weight-medium text-muted text-small">60/75 30-40</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </b-card-body>
                            </b-card>
                        </b-colxx>
                        <b-colxx xxs="12" lg="8">
                            <b-card class="mb-4" no-body>
                                <b-card-body>
                                    <h5 class="card-title">How old are you?</h5>
                                    <div class="chart-container">
                                        <doughnut-shadow-chart v-if="tabIndex == 1" :data="ageChartData" :height="300" />
                                    </div>
                                </b-card-body>
                            </b-card>
                            <b-card class="mb-4" no-body>
                                <b-card-body>
                                    <h5 class="card-title">What is your gender?</h5>
                                    <div class="chart-container">
                                        <doughnut-shadow-chart v-if="tabIndex == 1" :data="genderChartData" :height="300" />
                                    </div>
                                </b-card-body>
                            </b-card>
                            <b-card class="mb-4" no-body>
                                <b-card-body>
                                    <h5 class="card-title">What is your employment status?</h5>
                                    <div class="chart-container">
                                        <doughnut-shadow-chart v-if="tabIndex == 1" :data="workChartData" :height="300" />
                                    </div>
                                </b-card-body>
                            </b-card>
                            <b-card class="mb-4" no-body>
                                <b-card-body>
                                    <h5 class="card-title">
                                        What programming languages do you use?
                                    </h5>
                                    <div class="chart-container">
                                        <doughnut-shadow-chart v-if="tabIndex == 1" :data="codingChartData" :height="300" />
                                    </div>
                                </b-card-body>
                            </b-card>
                        </b-colxx>
                    </b-row>
                </b-tab>
            </b-tabs>
            <div v-else class="loading" key="itemLoading"></div>
        </b-colxx>
    </b-row>
    <application-menu>
        <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }">
            <div class="p-4">
                <p class="text-muted text-small mb-3">{{ $t("survey.status") }}</p>
                <ul class="list-unstyled mb-4">
                    <li class="nav-item">
                        <a href="#">
                            <i class="simple-icon-reload" />{{ $t("survey.all-surveys") }}
                            <span class="float-right" v-if="isLoadSurveys">{{
                  surveyItems.length
                }}</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#">
                            <i class="simple-icon-refresh" />{{
                  $t("survey.active-surveys")
                }}
                            <span class="float-right" v-if="isLoadSurveys">{{
                  surveyItems.filter(x => x.status === "PENDING").length
                }}</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#">
                            <i class="simple-icon-check" />{{
                  $t("survey.completed-surveys")
                }}
                            <span class="float-right" v-if="isLoadSurveys">{{
                  surveyItems.filter(x => x.status === "COMPLETED").length
                }}</span>
                        </a>
                    </li>
                </ul>
                <p class="text-muted text-small mb-1">
                    {{ $t("survey.categories") }}
                </p>
                <ul class="list-unstyled mb-4">
                    <b-form-radio-group stacked class="pt-2" :options="
                categories.map(c => {
                  return { text: c.label, value: c.value };
                })
              " />
                </ul>
                <p class="text-muted text-small mb-3">{{ $t("survey.labels") }}</p>
                <div>
                    <p class="d-sm-inline-block mb-1" v-for="(l, index) in labels" :key="index">
                        <a href="#" @click.prevent="">
                            <b-badge pill :variant="`outline-${l.color}`" class="mb-1 mr-1">{{ l.label }}</b-badge>
                        </a>
                    </p>
                </div>
            </div>
        </vue-perfect-scrollbar>
    </application-menu>
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations,
    mapActions
} from "vuex";
import DoughnutShadowChart from "../../../components/Charts/DoughnutShadow";

import Draggable from "vuedraggable";

import QuestionBuilder from "../../../components/SurveyApp/QuestionBuilder";
import ApplicationMenu from "../../../components/Common/ApplicationMenu";
import {
    ThemeColors
} from "../../../utils";
const colors = ThemeColors();
export default {
    components: {
        draggable: Draggable,
        "question-builder": QuestionBuilder,
        "application-menu": ApplicationMenu,
        "doughnut-shadow-chart": DoughnutShadowChart
    },
    data() {
        return {
            categories: [{
                    label: "Development",
                    value: "Development"
                },
                {
                    label: "Workplace",
                    value: "Workplace"
                },
                {
                    label: "Hardware",
                    value: "Hardware"
                }
            ],
            labels: [{
                    label: "EDUCATION",
                    value: "EDUCATION",
                    color: "secondary"
                },
                {
                    label: "NEW FRAMEWORK",
                    value: "NEW FRAMEWORK",
                    color: "primary"
                },
                {
                    label: "PERSONAL",
                    value: "PERSONAL",
                    color: "info"
                }
            ],
            statuses: [{
                    text: "ACTIVE",
                    value: "ACTIVE"
                },
                {
                    text: "COMPLETED",
                    value: "COMPLETED"
                }
            ],
            currentSurvey: null,
            tabIndex: 0,

            ageChartData: {
                labels: ["12-24", "24-30", "30-40", "40-50", "50-60"],
                datasets: [{
                    label: "",
                    borderColor: [
                        colors.themeColor1,
                        colors.themeColor2,
                        colors.themeColor3,
                        colors.themeColor4,
                        colors.themeColor5
                    ],
                    backgroundColor: [
                        colors.themeColor1_10,
                        colors.themeColor2_10,
                        colors.themeColor3_10,
                        colors.themeColor4_10,
                        colors.themeColor5_10
                    ],
                    borderWidth: 2,
                    data: [15, 25, 20, 30, 14]
                }]
            },
            genderChartData: {
                labels: ["Male", "Female", "Other"],
                datasets: [{
                    label: "",
                    borderColor: [
                        colors.themeColor1,
                        colors.themeColor2,
                        colors.themeColor3
                    ],
                    backgroundColor: [
                        colors.themeColor1_10,
                        colors.themeColor2_10,
                        colors.themeColor3_10
                    ],
                    borderWidth: 2,
                    data: [85, 45, 20]
                }]
            },
            workChartData: {
                labels: [
                    "Employed for wages",
                    "Self-employed",
                    "Looking for work",
                    "Retired"
                ],
                datasets: [{
                    label: "",
                    borderColor: [
                        colors.themeColor1,
                        colors.themeColor2,
                        colors.themeColor3,
                        colors.themeColor4
                    ],
                    backgroundColor: [
                        colors.themeColor1_10,
                        colors.themeColor2_10,
                        colors.themeColor3_10,
                        colors.themeColor4_10
                    ],
                    borderWidth: 2,
                    data: [15, 25, 20, 8]
                }]
            },
            codingChartData: {
                labels: ["Python", "JavaScript", "PHP", "Java", "C#"],
                datasets: [{
                    label: "",
                    borderColor: [
                        colors.themeColor1,
                        colors.themeColor2,
                        colors.themeColor3,
                        colors.themeColor4,
                        colors.themeColor5
                    ],
                    backgroundColor: [
                        colors.themeColor1_10,
                        colors.themeColor2_10,
                        colors.themeColor3_10,
                        colors.themeColor4_10,
                        colors.themeColor4_10
                    ],
                    borderWidth: 2,
                    data: [15, 25, 20, 8, 25]
                }]
            }
        };
    },
    computed: {
        ...mapGetters(["isLoadSurveys", "surveyItems", "surveyError"])
    },
    methods: {
        ...mapActions(["getSurveyItems"]),
        ...mapMutations(["addSurveyItem"]),
        addQuestion() {
            this.currentSurvey.questions.push({
                id: this.currentSurvey.questions.length + 1,
                title: "New Question",
                question: "Question",
                answerType: 0,
                answers: []
            });
        }
    },
    mounted() {
        this.getSurveyItems()
        document.body.classList.add("right-menu");
    },
    beforeDestroy() {
        document.body.classList.remove("right-menu");
    },
    watch: {
        isLoadSurveys(val) {
            if (val === true) {
                this.currentSurvey = this.surveyItems[0];
            }
        }
    }
};
</script>
