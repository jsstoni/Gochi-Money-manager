<script setup>
defineProps({
  show: Boolean,
  size: {
    default: "450px",
  },
});
</script>

<template>
  <Transition name="slide">
    <div class="modal" v-if="show">
      <div class="modal-body" :style="{ maxWidth: size }">
        <a href="#" @click.prevent="$emit('close')"><i class="icon-x"></i></a>
        <slot name="body"></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@media only screen and (max-width: 767px) {
  .modal-body {
    width: 100%;
  }
}
.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
