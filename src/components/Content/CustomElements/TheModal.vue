<script setup>
import {defineProps, defineEmits} from 'vue'
const props = defineProps({
    isActive: Boolean,
})

const emit = defineEmits(['toggle'])

const closeModal = () => {
    emit('toggle')
}

</script>

<template>
      <div v-if="props.isActive" >
        <div class="modal-background" @click="closeModal" />
  
        <div class="modal-content">
        <button class="modal-close-button" @click="closeModal">Х</button>
            <slot></slot>
        </div>
      </div>
  </template>

<style lang="scss" scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem;
  z-index: 2;
}

.modal-close-button {
    position: absolute;
    right: 10px;
    top: 10px;
    display: grid;
    place-items: center;
    line-height: 1;
    width: 25px;
    height: 25px;
    background: transparent;
    border: 1px solid #000;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #000;
      color: #fff;
    }
}

</style>