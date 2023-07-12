import { reactive } from "vue";
import axios from "axios";

const transactions = reactive({
  list: [],
  page: 0,
  numPage: 0,
});

const loader = reactive({
  all: false,
  form: false,
});

const allTransactions = async () => {
  try {
    loader.all = true;
    const {
      data: { finance = [] },
    } = await axios.get("/finance");
    transactions.list = finance;
  } catch (error) {
    console.log(error);
  } finally {
    loader.all = false;
  }
};

const filterTransaction = async (filterData) => {
  const {
    data: { finance = [] },
  } = await axios.get("/finance/filter", {
    params: {
      wallet: filterData.wallet,
      desde: filterData.desde,
      hasta: filterData.hasta,
      origen: filterData.origen,
      concepto: filterData.concepto,
    },
  });
  transactions.list = finance;
};

const formTransactions = async (transactionData, endpoint) => {
  try {
    loader.form = true;
    const { data } = await axios.post(`/finance/${endpoint}`, transactionData);
    return data;
  } catch (error) {
    throw new Error(`Failed to ${endpoint} transaction.`);
  } finally {
    loader.form = false;
  }
};

const createTransactions = async (info) => {
  return formTransactions(info, "create");
};

const updateTransactions = async (info) => {
  return formTransactions(info, "update");
};

const removeTransactions = async (info) => {};

export {
  loader,
  transactions,
  allTransactions,
  createTransactions,
  updateTransactions,
  removeTransactions,
  filterTransaction,
};
