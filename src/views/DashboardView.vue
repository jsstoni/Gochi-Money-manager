<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Chart from "chart.js/auto";

import Modal from "@/components/ModalBox.vue";
import Form from "@/components/FormApp.vue";

import { error, success } from "@/hooks/ToastHooks";
import { priceFormat, updateWalletAmount } from "@/hooks/FunctionHooks";
import {
  loader,
  statistics,
  wallets,
  allWallets,
  createWallet,
  updateWallet,
  removeWallet,
} from "@/hooks/WalletsHooks";

const store = useStore();

const walletFields = ref([]);
const graphic = ref();

const formAction = reactive({
  form: false,
  type: "",
  info: {},
  fn: (event) => {
    formAction.type == "update" ? editWallet(event) : formWallets(event);
  },
});

const modalWallet = (type, index) => {
  index = wallets.value[index] || {};
  formAction.type = type;
  formAction.info = index;
  formAction.form = true;
};

const formWallets = async (event) => {
  const form = new FormData(event.target);
  const { amount } = Object.fromEntries(form.entries());
  const { error: errormsg, message } = await createWallet(form);
  if (errormsg) {
    error(errormsg);
  } else {
    formAction.form = false;
    const total = updateWalletAmount(store.state.amount, amount, 1);
    store.dispatch("amount", total);
    success(message);
    allWallets();
  }
};

const editWallet = (event) => {
  const form = new FormData(event.target);
  const { id, tag, amount } = Object.fromEntries(form.entries());
  const { error, message } = updateWallet(form);
  if (error) {
    alert(error);
  } else {
    formAction.form = false;
    const indice = wallets.value.findIndex((tag) => tag.id == id);
    wallets.value[indice].name = tag;
    wallets.value[indice].amount = amount;
    const amount = wallets.value.reduce(
      (acc, va) => acc + parseInt(va.amount),
      0
    );
    store.dispatch("amount", amount);
    success(message);
  }
};

const modalRemove = (id) => {
  formAction.form = true;
  formAction.type = "remove";
  walletFields.value = [
    {
      tag: "input",
      type: "hidden",
      name: "id",
      value: id,
    },
  ];
};

const borrarWallet = async (event) => {
  const form = new FormData(event.target);
  const { id } = Object.fromEntries(form.entries());
  const { error: msgerror, message } = await removeWallet(form);
  if (msgerror) {
    error(error);
  } else {
    formAction.form = false;
    success(message);
    const indice = wallets.value.findIndex((tag) => tag.id == id);
    const total = updateWalletAmount(
      store.state.amount,
      wallets.value[indice].amount,
      2
    );
    store.dispatch("amount", total);
    wallets.value.splice(indice, 1);
  }
};

onMounted(async () => {
  await allWallets();
  const ctx = graphic.value.getContext("2d");
  const incomeData = statistics.value.map(({ Ingresos }) => Ingresos);
  const expensesData = statistics.value.map(({ Gastos }) => Gastos);
  const incomeDataset = {
    label: "Ingresos",
    data: incomeData,
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgba(54, 162, 235, 1)",
    borderWidth: 1,
  };

  const expensesDataset = {
    label: "Gastos",
    data: expensesData,
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgba(255, 99, 132, 1)",
    borderWidth: 1,
  };
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      datasets: [incomeDataset, expensesDataset],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
</script>

<template>
  <div class="block">
    <div class="rows">
      <div class="col-9">
        <h1>Estadisticas</h1>
        <canvas ref="graphic" width="100%" height="140"></canvas>
      </div>
      <div class="col-3">
        <h3>Billeteras</h3>
        <button class="btn btn-blue btn-block" @click="modalWallet('create')">
          Crear billetera
        </button>
        <hr />
        <div v-for="(item, index) in wallets" :key="item.id" class="wallet">
          <p>
            {{ priceFormat(item.amount) }}
            <small>{{ item.name }}</small>
          </p>
          <i class="icon-edit" @click="modalWallet('update', index)"></i>
          <i class="icon-remove" @click="modalRemove(item.id)"></i>
        </div>
      </div>
    </div>

    <Modal :show="formAction.form" @close="formAction.form = false">
      <template #body>
        <div v-if="formAction.type == 'update' || formAction.type == 'create'">
          <Form
            action="/wallets/create"
            method="post"
            button="Guardar"
            @send="formAction.fn"
            :loader="loader.form"
          >
            <template #other>
              <input
                type="hidden"
                name="id"
                v-model="formAction.info.id"
                v-if="formAction.info.id"
              />

              <label>Nombre</label>
              <input type="text" name="tag" v-model="formAction.info.name" />

              <label>Monto</label>
              <input
                type="number"
                name="amount"
                v-model="formAction.info.amount"
                @keydown="singleNumbers"
              />
            </template>
          </Form>
        </div>
        <div v-if="formAction.type == 'remove'">
          <p>
            ¡ Seguro quieres borrar tu billetera, se eliminaran todas las
            trasacciones que has hecho con ella !
          </p>
          <Form
            action="/wallets/remove"
            method="delete"
            button="Confirmar"
            :loader="loader.form"
            :fields="walletFields"
            @send="borrarWallet"
          />
        </div>
      </template>
    </Modal>
  </div>
</template>

<style>
.wallet {
  background: #fff;
  border: #e0e6ed solid 1px;
  box-shadow: 0 0 3px #ddd;
  border-radius: 8px;
  padding: 10px 15px;
  margin: 0 0 10px 0;
  overflow: auto;
}
.wallet p {
  float: left;
  font-size: 18px;
}
.wallet small {
  display: block;
  font-size: 12px;
  color: #555;
}
.wallet i {
  float: right;
  font-size: 16px;
  margin: 0 0 0 6px;
}

.box {
  padding: 10px 25px;
  font-size: 14px;
  font-weight: 500;
  background: #fff;
  border: #e0e6ed solid 1px;
  border-radius: 8px;
  margin: 6px 0 8px 0;
}
</style>
