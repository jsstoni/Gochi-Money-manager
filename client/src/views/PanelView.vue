<script setup>
import { onMounted, computed } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useStore } from "vuex";

import { allWallets, reports } from "@/hooks/WalletsHooks";
import { priceFormat } from "@/hooks/FunctionHooks";

const store = useStore();

const listReports = computed(() => {
  return reports.value.map((e) => {
    let copy = JSON.parse(JSON.stringify(e));
    copy.bg = copy.type == 1 ? "#eafaf1" : "#fdedec";
    copy.type = copy.type == 1 ? "Ingresos" : "Gastos";
    console.log(copy.type);
    return copy;
  });
});

onMounted(() => allWallets());
</script>
<template>
  <div>
    <div class="header">
      <div class="h-center">
        <div class="desktop">
          <img src="@/assets/new.svg" height="22" />
        </div>

        <div class="header-menu">
          <nav class="menu">
            <ul>
              <li>
                <router-link
                  :to="{ name: 'dashboard' }"
                  exact-active-class="active"
                  ><i class="icon-grid"></i> <span>Dashboard</span></router-link
                >
              </li>
              <li>
                <router-link
                  :to="{ name: 'finance' }"
                  exact-active-class="active"
                  ><i class="icon-trending-up"></i>
                  <span>Transacciones</span></router-link
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="desktop">
          <ul>
            <li class="dropdown">
              <a href="#" class="">Usuario</a>
              <ul>
                <li>
                  <a href="#" @click.prevent="store.commit('logout')">Salir</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="content">
      <div
        style="
          background: #e7e7ec;
          height: 90px;
          margin: 0 -15px;
          margin-bottom: -70px;
          padding: 20px;
        "
        class="mobile"
      >
        <img src="@/assets/new.svg" height="22" />
      </div>

      <div class="flex-content">
        <div class="rows" style="margin-bottom: 20px">
          <div class="col-4 col-sm-12">
            <strong>Balance total</strong>
            <h1>CLP {{ priceFormat(store.state.amount) }}</h1>
          </div>
          <div
            class="col-4 col-sm-6"
            v-for="(item, index) in listReports"
            :key="index"
          >
            <strong>{{ item.type }}</strong>
            <h1>{{ priceFormat(item.total) }}</h1>
          </div>
        </div>
        <RouterView />
      </div>
    </div>
  </div>
</template>
