<template>
  <div class="stepper-box">
    <div class="top">
      <!-- <div class="divider-line" :style="{width: `${(100/(steps.length) * (steps.length - 1)) - 10}%`}"></div> -->
      <div class="steps-wrapper">
        <!-- <template v-if="topButtons">
                    <div v-if="currentStep.index > 0" class="stepper-button-top previous" @click="backStep()">
                        <i class="material-icons">keyboard_arrow_left</i>
                    </div>
        </template>-->
        <template v-for="(step, index) in steps">
          <!-- eslint-disable vue/require-v-for-key -->
          <div
            :class="['step', isStepActive(index, step)]"
            :style="{width: `${100 / steps.length}%`}"
            @click="nextStep(index)"
          >
            <h4>
              <i class="material-icons md-18">{{ (step.completed) ? 'done' : step.icon }}</i>
              <span>{{ step.title }}</span>
            </h4>
          </div>
        </template>
        <div
          v-if="topButtons"
          :class="['stepper-button-top next', !canContinue ? 'deactivated' : '']"
          @click="nextStep()"
        >
          <i class="material-icons">keyboard_arrow_right</i>
        </div>
      </div>
    </div>
    <div class="content">
      <transition
        :enter-active-class="enterAnimation"
        :leave-active-class="leaveAnimation"
        mode="out-in"
      >
        <!--If keep alive-->
        <keep-alive v-if="keepAliveData">
          <component
            :is="steps[currentStep.index].component"
            :data="steps[currentStep.index].data"
            :clickedNext="nextButton[currentStep.name]"
            :current-step="currentStep"
            @can-continue="proceed"
            @change-next="changeNextBtnValue"
            @success-step="successStep"
          />
        </keep-alive>
        <!--If not show component and destroy it in each step change-->
        <component
          :is="steps[currentStep.index].component"
          v-else
          :data="steps[currentStep.index].data"
          :clickedNext="nextButton[currentStep.name]"
          :current-step="currentStep"
          @can-continue="proceed"
          @change-next="changeNextBtnValue"
          @success-step="successStep"
        />
      </transition>
    </div>
    <!--
        <div :class="['bottom', (currentStep.index > 0) ? '' : 'only-next']">
            <div v-if="currentStep.index > 0" class="btn top-right-button btn-primary btn-lg" @click="backStep()">
                <i class="material-icons">keyboard_arrow_left</i>
                <span>{{ 'back' | translate(locale) }}</span>
            </div>
            <div :class="['btn top-right-button btn-primary btn-lg', !canContinue ? 'deactivated' : '']" @click="nextStep()">
                <span>{{ (finalStep) ? 'finish' : 'next' | translate(locale) }}</span>
                <i class="material-icons">keyboard_arrow_right</i>
            </div>
        </div>
    -->
  </div>
</template>

<script>
import translations from "../../constants/Translations";
export default {
  name: "steeper-component",
  filters: {
    translate: function(value, locale) {
      return translations[locale][value];
    }
  },
  props: {
    locale: {
      type: String,
      default: "en"
    },
    topButtons: {
      type: Boolean,
      default: false
    },
    steps: {
      type: Array,
      default: () =>  []
    },
    keepAlive: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentStep: {},
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false,
      keepAliveData: this.keepAlive
    };
  },
  computed: {
    enterAnimation() {
      if (this.currentStep.index < this.previousStep.index) {
        return "animated quick fadeInLeft";
      } else {
        return "animated quick fadeInRight";
      }
    },
    leaveAnimation() {
      if (this.currentStep.index > this.previousStep.index) {
        return "animated quick fadeOutLeft";
      } else {
        return "animated quick fadeOutRight";
      }
    }
  },
  watch: {
    reset(val) {
      if (!val) {
        return;
      }
      this.keepAliveData = false;
      this.init();
      this.previousStep = {};
      this.$nextTick(() => {
        this.keepAliveData = this.keepAlive;
        this.$emit("reset", true);
      });
    }
  },
  created() {
    this.init();
  },
  methods: {
    isStepActive(index) {
      if (this.currentStep.index === index) {
        return "activated";
      } else {
        return "deactivated";
      }
    },
    activateStep(index, back = false) {
      if (this.steps[index]) {
        this.previousStep = this.currentStep;
        this.currentStep = {
          name: this.steps[index].name,
          index: index
        };

        if (index + 1 === this.steps.length) {
          this.finalStep = true;
        } else {
          this.finalStep = false;
        }
        if (!back) {
          this.$emit("completed-step", this.previousStep);
        }
      }
      this.$emit("active-step", this.currentStep);
    },
    nextStepAction(index) {
      if (index > this.currentStep.index) {
        if (this.canContinue) {
          if (this.finalStep) {
            this.$emit("stepper-finished", this.currentStep);
          }

          this.activateStep(index);
        }
        this.canContinue = false;
        this.$forceUpdate();
      } else {
        this.$emit("clicking-back");
        let currentIndex = index;
        if (currentIndex >= 0) {
          this.activateStep(currentIndex, true);
        }
      }
    },
    nextStep(index) {
      const { completed } = this.steps[index === 0 ? 0 : index - 1]; 
      if (completed) {
        this.nextStepAction(index);
      }
    },
    backStep() {
      this.$emit("clicking-back");
      let currentIndex = this.currentStep.index - 1;
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true);
      }
    },
    proceed(payload) {
      this.canContinue = payload.value;
    },
    changeNextBtnValue(payload) {
      this.nextButton[this.currentStep.name] = payload.nextBtnValue;
      this.$forceUpdate();
    },
    successStep() {
      this.$emit("completed-step", this.currentStep);
    },
    init() {
      // Initiate stepper
      this.activateStep(0);
      this.steps.forEach(step => {
        this.nextButton[step.name] = false;
      });
    }
  }
};
</script>

<style scoped>
/* fallback */
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: local("Material Icons"), local("MaterialIcons-Regular"),
    url(https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2)
      format("woff2");
}
.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}
</style>


