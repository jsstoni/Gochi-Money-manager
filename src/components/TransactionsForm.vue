<script setup>
import { reactive, computed } from "vue";

import { wallets } from "@/hooks/WalletsHooks";
import { singleNumbers } from "@/hooks/FunctionHooks";
import { gastos, ingresos } from "@/hooks/DataHooks.js";

const props = defineProps({
  form: {
    type: Object,
    default: {},
  },
});

let form = reactive({
  type: 1,
  recurrence: "none",
  ...props.form,
});

const category = computed(() => {
  return form.type == 1 ? ingresos : gastos;
});
</script>

<template>
  <input type="hidden" name="id" v-model="form.id" v-if="form.id" />
  <ul class="tabs">
    <li>
      <a
        href="#"
        :class="{ active: form.type == 1 }"
        @click.prevent="form.type = 1"
        >Ingreso</a
      >
    </li>
    <li>
      <a
        href="#"
        :class="{ active: form.type == 2 }"
        @click.prevent="form.type = 2"
        >Gasto</a
      >
    </li>
  </ul>

  <input type="hidden" name="tipo" v-model="form.type" />
  <label for="">Categoría</label>
  <select name="tag" v-model="form.category">
    <option :value="tag" v-for="(tag, index) in category" :key="index">
      {{ tag }}
    </option>
  </select>

  <div class="rows">
    <div class="col-6">
      <label for="">Billetera</label>
      <select name="wallet" v-model="form.wallet_id">
        <option :value="w.id" v-for="(w, index) in wallets" :key="index">
          {{ w.name }} - ${{ w.amount }}
        </option>
      </select>
    </div>
    <div class="col-6">
      <label for="">Monto</label>
      <input
        type="number"
        name="amount"
        v-model="form.amount"
        @keydown="singleNumbers"
      />
    </div>
  </div>

  <div class="rows">
    <div class="col-6">
      <label for="">Fecha</label>
      <input type="text" name="fecha" v-model="form.date" v-date />
    </div>
    <div class="col-6">
      <label for="">Recurrencia</label>
      <select name="recurrencia" v-model="form.recurrence">
        <option value="none">Nunca</option>
        <option value="1day">Cada día</option>
        <option value="2day">Cada 2 días</option>
        <option value="1week">Cada semana</option>
        <option value="2week">Cada 2 semanas</option>
        <option value="1month">Cada més</option>
        <option value="2month">Cada 2 meses</option>
        <option value="3month">Cada 3 meses</option>
        <option value="6month">Cada 6 meses</option>
        <option value="1year">Todos los años</option>
      </select>
    </div>
  </div>

  <label for="">Nota</label>
  <textarea name="desc" rows="4" v-model="form.description"></textarea>

  <template v-if="form.recurrence != 'none'">
    <input
      type="checkbox"
      value="1"
      true-value="1"
      false-value="0"
      name="permite"
      v-model="form.allow"
    /><label for=""
      >Permitir descontar o aumentar el saldo de la billetera</label
    >
  </template>
</template>

<style scoped>
.rows {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>