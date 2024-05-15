<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";

import Modal from "@/components/ModalBox.vue";
import Form from "@/components/FormApp.vue";

const fieldsUser = [
  {
    label: "Nombre",
    tag: "input",
    type: "text",
    name: "nombre",
  },
  {
    label: "Email",
    tag: "input",
    type: "text",
    name: "email",
  },
  {
    label: "Contraseña",
    tag: "input",
    type: "password",
    name: "password",
  },
  {
    label: "Repetir contraseña",
    tag: "input",
    type: "password",
    name: "repass",
  },
];

const userLogin = ref(false);

const store = useStore();
const router = useRouter();

async function hacerLogin(event) {
  const form = new FormData(event.target);
  const url = event.target.getAttribute("action");
  try {
    const {
      data: { error, message },
    } = await axios.post(url, form);
    if (error) {
      alert(error);
    } else {
      store.dispatch("login", message);
      router.push({ name: "finance" });
    }
  } catch (error) {
    console.log(error.message)
  }
}

async function createUser(event) {
  const form = new FormData(event.target);
  const url = event.target.getAttribute("action");
  const {
    data: { error, message },
  } = await axios.post(url, form);
  if (error) {
    alert(error);
  } else {
    alert(message);
  }
}
</script>

<template>
  <main class="container">
    <div class="col-5 col-sm-11 center">
      <div class="login">
        <img src="@/assets/new.svg" alt="" />
        <h3>Hola ! Bienvenido de nuevo.</h3>
        <small>Ingresa tus datos de inicio de sesión</small>
        <form action="/login" method="post" @submit.prevent="hacerLogin">
          <label for="">Correo electrónico</label>
          <input type="text" name="email" placeholder="correo@live.com" />
          <label for="">Contraseña</label>
          <input type="password" name="password" placeholder="*****" />
          <button type="submit" class="btn btn-block btn-blue">Ingresar</button>
          <p>
            ¿ Aún no estás registrado ?
            <a href="#" @click="userLogin = true">¡Registro !</a>
          </p>
        </form>
      </div>
    </div>

    <Modal :show="userLogin" @close="userLogin = false">
      <template #body>
        <Form
          action="/register"
          method="post"
          :fields="fieldsUser"
          @send="createUser"
        />
      </template>
    </Modal>
  </main>
</template>

<style>
.center {
  margin: 0 auto;
}
.login {
  background: #fff;
  box-shadow: 0 0 3px #ddd;
  padding: 25px 50px;
}
.login img {
  margin: 0 0 25px 0;
}
.login h3 {
  font-size: 20px;
  margin: 0 0 15px 0;
}
.login label {
  margin: 10px 0 0 0;
}
.login .btn {
  margin: 20px 0;
}
</style>
