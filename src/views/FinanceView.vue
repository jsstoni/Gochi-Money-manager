<script setup>
import { onMounted, computed, reactive, watch } from "vue";
import { useStore } from "vuex";

import TableLoader from "@/components/TableLoader.vue";
import Modal from "@/components/ModalBox.vue";
import Transactions from "@/components/TransactionsForm.vue";
import Form from "@/components/FormApp.vue";

import { priceFormat, updateWalletAmount } from "@/hooks/FunctionHooks";
import {
  loader,
  transactions,
  allTransactions,
  createTransactions,
  updateTransactions,
  filterTransaction,
} from "@/hooks/TransactionsHooks";
import { success, error } from "@/hooks/ToastHooks";

const store = useStore();

const formAction = reactive({
  form: false,
  type: "",
  info: {},
  fn: (event) => {
    formAction.type == "update" ? updateFinance(event) : createFinance(event);
  },
});

const filter = reactive({
  tabs: [1, 0, 0],
  date: false,
  desde: null,
  hasta: null,
  origen: "0",
});

const transactionList = computed(() => {
  return transactions.list.map((e) => {
    e.color = e.type == 1 ? "#2ecc71" : "#c0392b";
    e.bg = e.type == 1 ? "#eafaf1" : "#f9ebea";
    e.signo = e.type == 1 ? "+" : "-";
    e.evento = e.type == 1 ? "Ingreso" : "Pago";
    return e;
  });
});

const editarModal = (index) => {
  formAction.type = "update";
  formAction.info = transactions.list[index];
  formAction.form = true;
};

const createModal = () => {
  formAction.type = "create";
  formAction.info = {};
  formAction.form = true;
};

const createFinance = async (event) => {
  const form = new FormData(event.target);
  const {
    permite = 0,
    tipo,
    amount,
    recurrencia,
  } = Object.fromEntries(form.entries());
  const { error: errormsg, message } = await createTransactions(form);
  if (errormsg) {
    error(errormsg);
  } else {
    formAction.form = false;
    if (
      permite == 1 ||
      (permite == "1" && recurrencia != "none") ||
      recurrencia == "none"
    ) {
      const total = updateWalletAmount(store.state.amount, amount, tipo);
      store.dispatch("amount", total);
    }
    success(message);
    allTransactions();
  }
};

const updateFinance = async (event) => {
  const form = new FormData(event.target);
  const { error: msgerror, message } = await updateTransactions(form);
  if (msgerror) {
    error(msgerror);
  } else {
    success(message);
  }
};

watch(filter, () => {
  if (filter.origen != "0" || filter.origen == "0") filterTransaction(filter);
});

onMounted(() => allTransactions());
</script>

<template>
  <div class="block" @click="filter.date = false">
    <div class="d-flex">
      <h1>Transacciones</h1>
      <div class="ml-auto">
        <ul class="links">
          <li class="ml-auto" style="position: relative">
            <a href="#" @click.stop="filter.date = true"
              ><i class="icon-calendar"></i
            ></a>
            <ul v-show="filter.date" @click.stop>
              <label for="">Desde</label>
              <input
                type="text"
                placeholder="desde"
                v-model="filter.desde"
                v-date
              />
              <label for="">Hasta</label>
              <input
                type="text"
                placeholder="hasta"
                v-model="filter.hasta"
                v-date
              />
            </ul>
          </li>
        </ul>
        <button class="btn btn-blue" @click="createModal">
          Crear transacción
        </button>
      </div>
    </div>

    <div class="box-content">
      <table class="table">
        <thead>
          <tr>
            <th>Billetera</th>
            <th>Concepto</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th></th>
          </tr>
        </thead>
        <table-loader :rows="6" :columns="6" v-if="loader.all" />
        <tbody v-if="!loader.all">
          <tr v-if="transactions.list.length <= 0">
            <td colspan="5">No hay registros</td>
          </tr>
          <tr v-for="(item, index) in transactionList" :key="index">
            <td data-label="Billetera" class="wallet-info">
              <p>
                <span>{{ item.wallet }}</span>
              </p>
            </td>
            <td data-label="Categoría">{{ item.category }}</td>
            <td data-label="Fecha">{{ item.date }}</td>
            <td data-label="Descripción">{{ item.description }}</td>
            <td data-label="Monto">
              <span
                style="padding: 5px 15px; border-radius: 20px"
                :style="{ color: item.color, background: item.bg }"
              >
                {{ `${item.signo}${priceFormat(item.amount)}` }}
              </span>
            </td>
            <td style="text-align: right">
              <i class="icon-edit" @click="editarModal(index)"></i>
              <i class="icon-remove"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal
      :show="formAction.form"
      size="450px"
      @close="formAction.form = false"
    >
      <template #body>
        <Form
          action="/"
          method="post"
          @send="formAction.fn"
          :loader="loader.form"
        >
          <template #other>
            <Transactions :form="formAction.info" />
          </template>
        </Form>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
@media only screen and (max-width: 767px) {
  .d-flex {
    display: block;
  }
  .d-flex h1 {
    margin-bottom: 15px;
  }
  .links li ul {
    left: 0;
    right: inherit;
  }
}
</style>
