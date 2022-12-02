<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'

const router = useRouter()
const auth = getAuth()
const emailInput = ref(null)
const passInput = ref(null)

function createUser() {
  if (
    emailInput.value.toString().length > 3 &&
    passInput.value.toString().length > 5
  ) {
    createUserWithEmailAndPassword(auth, emailInput.value, passInput.value)
      .then(() => {
        // Signed in
        alert('Email cadastrado com sucesso!')
        try {
          sendEmailVerification(emailInput.value)
        } catch (e) {
          console.log(e)
        }
        router.push({ name: 'login' })
        // ...
      })
      .catch((error) => {
        alert(error)
      })
  }
}
</script>

<template>
  <div
    class="flex flex-col justify-center w-[500px] m-auto mt-20 p-5 bg-white drop-shadow-lg rounded-md"
  >
    <label for="email">E-mail</label>
    <input type="text" id="email" v-model="emailInput" />
    <label for="pass">Senha</label>
    <input type="password" id="pass" v-model="passInput" />
    <button @click="createUser">Cadastrar</button>
    <button @click="router.push('/')" class="w-full">Ir para a Home</button>
  </div>
</template>

<style scoped></style>
