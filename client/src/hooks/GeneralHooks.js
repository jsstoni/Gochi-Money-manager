import axios from "axios";
import { reactive } from "vue";

const config = reactive({
  wallets: [],
  totalIngresos: 0,
  totalGastos: 0,
});

const generalConfig = async () => {
  const { data } = await axios.get("/config");
};

export { generalConfig };
