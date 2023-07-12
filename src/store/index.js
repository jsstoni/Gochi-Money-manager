import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import router from "@/router";

export default createStore({
  state: {
    session: null,
    amount: 0,
  },
  mutations: {
    setSession(state, { token, amount }) {
      state.session = token;
      state.amount = amount;
    },
    setAmount(state, amount) {
      state.amount = amount;
    },
    logout(state) {
      state.session = null;
      router.push("/");
    },
  },
  actions: {
    login({ commit }, data) {
      commit("setSession", data);
    },
    amount({ commit }, data) {
      commit("setAmount", data);
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  getters: {
    isAuth: (state) => !!state.session,
  },
  plugins: [createPersistedState()],
});
