<script setup>
const props = defineProps({
  loader: Boolean,
  fields: {
    type: Array,
    default: [],
  },
  action: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  button: {
    type: String,
    default: "Guardar",
  },
  handler: Function,
});

const emit = defineEmits(["send"]);

const saved = (event) => {
  emit("send", event);
};
</script>

<template>
  <form :action="action" :method="method" @submit.prevent="saved">
    <div class="load" v-if="loader">
      <span class="loader"></span>
    </div>
    <template v-for="(field, index) in fields" :key="index">
      <label v-if="field.type != 'hidden'">{{ field.label }}</label>
      <input
        :type="field.type"
        :name="field.name"
        :value="field?.value"
        v-if="field.tag == 'input'"
      />
      <select name="" v-if="field.tag == 'select'" :value="field?.value">
        <option
          v-for="(option, io) in field.options"
          :key="io"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
    </template>
    <slot name="other"></slot>
    <button type="submit" class="btn btn-green">{{ button }}</button>
  </form>
</template>

<style>
form {
  position: relative;
}

.load {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9;
  text-align: center;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #ddd;
  border-bottom-color: #ff3d00;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
