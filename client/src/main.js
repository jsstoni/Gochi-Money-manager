import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import datePicker from "@/datePicker";

import "./assets/style.scss";
import "vue3-toastify/dist/index.css";

axios.defaults.baseURL = "http://localhost:9000";
axios.interceptors.request.use((config) => {
  if (store.state.session) {
    config.headers.Authorization = store.state.session;
  }
  return config;
});

axios.interceptors.response.use((response) => {
  if (!(response.data instanceof Object)) {
    throw new Error(
      "Error en la respuesta del servidor: " + response.data
    );
  }
  return response;
}, error => {
  return Promise.reject(error);
});

const app = createApp(App);
app.directive("date", datePicker);

app.use(router);
app.use(store);

app.mount("#app");
