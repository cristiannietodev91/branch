<script setup>
import { ref, onMounted, watch, onUnmounted, reactive } from 'vue'
import { Modal } from 'bootstrap'

const state = reactive({ open: false })
const emit = defineEmits(['close'])

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false,
  }
})

const modalRef = ref(null);
let modal;
onMounted(() => {
  if (modalRef.value) {
    modal = new Modal(modalRef.value);
    modalRef.value.addEventListener('hide.bs.modal', hide);
  }
})

onUnmounted(()=> {
  if (modalRef.value) {
    modalRef.value.removeListener('hide.bs.modal', hide);
  }
})

watch(() => state.open, (stateValue) => {
  if (stateValue) {
    modal.show()
  } else {
    modal.hide()
  }
})

watch(() => props.show, (modelValue) => {
  if (modelValue) {
    showModal();
  } else {
    hide();
  }
})

const showModal = ()=> {
  state.open = true;
}

const hide = ()=> {
  state.open = false;
  emit('close');
}

defineExpose({
  show: showModal,
  hide,
});

</script>

<template>
  <div
    :id="id" ref="modalRef" class="modal" tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ title }}
          </h5>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
