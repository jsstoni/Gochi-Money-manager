<script setup>
defineProps({
  rows: Number,
  columns: Number,
});
</script>

<template>
  <tbody style="text-align: center">
    <tr v-for="index in rows" :key="index">
      <td v-for="td in columns" :key="td">
        <span>
          <div
            class="fill"
            :style="`width: ${Math.floor(Math.random() * 51) + 50}%;`"
          />
        </span>
      </td>
    </tr>
  </tbody>
</template>

<style>
@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

.fill {
  background: #ddd;
  height: 12px;
  border-radius: 8px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
