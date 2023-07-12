import { ref, reactive } from "vue";
import axios from "axios";

const wallets = ref([]);
const reports = ref([]);
const statistics = ref([]);
const loader = reactive({
  all: true,
  form: false,
});

const allWallets = async () => {
  try {
    loader.all = true;
    const {
      data: {
        wallets: resWallet = [],
        reports: resReports = [],
        statistics: reStatistics = [],
      },
    } = await axios.get("/wallets");
    wallets.value = resWallet;
    reports.value = resReports;
    const months = [...Array(12).keys()].map((i) => i + 1);
    const newData = months.map((mes) => {
      const obj = reStatistics.find((e) => e.month == mes);
      return obj || { mes, Ingresos: 0, Gastos: 0 };
    });
    statistics.value = newData;
  } catch (error) {
    console.log(error);
  } finally {
    loader.all = false;
  }
};

const createOrUpdate = async (walletData, endpoint) => {
  try {
    loader.form = true;
    const { data } = await axios.post(`/wallets/${endpoint}`, walletData);
    return data;
  } catch (error) {
    throw new Error(`Failed to ${endpoint} wallet.`);
  } finally {
    loader.form = false;
  }
};

const createWallet = async (info) => {
  return createOrUpdate(info, "create");
};

const updateWallet = async (info) => {
  return createOrUpdate(info, "update");
};

const removeWallet = async (info) => {
  try {
    loader.form = true;
    const id = info.get("id");
    const { data } = await axios.delete(`/wallets/remove/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  } finally {
    loader.form = false;
  }
};

export {
  loader,
  wallets,
  reports,
  statistics,
  allWallets,
  createWallet,
  updateWallet,
  removeWallet,
};
