<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAuth,
  signInWithRedirect,
  signInWithEmailAndPassword,
  //FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth'

const router = useRouter()
const auth = getAuth()
const emailInput = ref('')
const passInput = ref(null)
//const providerFacebook = new FacebookAuthProvider()
const providerGoogle = new GoogleAuthProvider()
const loading = ref(true)

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    //const uid = user.uid;
    router.push({ name: 'Home' })
    // ...
  } else {
    loading.value = false
    // User is signed out
    // ...
  }
})

function login() {
  signInWithEmailAndPassword(auth, emailInput.value, passInput.value)
    .then(() => {
      if (auth.currentUser.emailVerified) {
        router.push({ name: 'Home' })
      } else {
        if (
          window.confirm(
            'Email não verificado. Gostaria de receber um email de verificação?'
          )
        ) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              alert('E-mail de verificação enviado! :)')
            })
            .catch((error) => {
              alert('E-mail de verificação não enviado! :(' + error)
            })
        } else {
          return false
        }
      }
    })
    .catch((error) => {
      alert(error)
    })
}

function resetPass() {
  let person = prompt('Insira seu email', '')

  if (person.length > 4) {
    sendPasswordResetEmail(auth, person)
      .then(() => {
        alert('Enviamos um link de redefinição para esse Email!')
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

// function handleFacebookLogin() {
//   signInWithRedirect(auth, providerFacebook)
// }

function handleGoogleLogin() {
  signInWithRedirect(auth, providerGoogle)
}
</script>

<template>
  <div
    class="flex flex-col justify-center w-[90vw] lg:w-[50vw] m-auto mt-20 p-5 bg-white drop-shadow-lg rounded-md"
  >
    <img src="../assets/superchord.png" alt="" class="w-60 m-auto mb-5" />

    <label for="email">Email</label>
    <input type="text" id="email" v-model="emailInput" @keyup.enter="login()" />
    <label for="pass">Senha</label>
    <input
      type="password"
      id="pass"
      v-model="passInput"
      @keyup.enter="login()"
    />
    <div class="flex justify-between text-xs my-2 font-bold">
      <a @click="router.push({ name: 'Siginup' })">Criar nova conta</a>
      <a @click="resetPass()">Esqueceu a senha?</a>
    </div>
    <a class="button2" @click="login()">Entrar</a>

    <div
      tabindex="0"
      class="w-full p-3 border-2 bg-white rounded-md border-zinc-300 mb-2 mt-4 text-center select-none"
      :class="'opacity-50'"
    >
      Entrar com Facebook
      <img
        src="../assets/facebook.png"
        alt=""
        role="presentation"
        class="w-5 ml-1 inline"
      />
    </div>
    <div
      tabindex="0"
      class="w-full p-3 border-2 bg-white rounded-md border-zinc-300 mb-2 mt-4 text-center select-none cursor-pointer select-none"
      @click="handleGoogleLogin"
    >
      Entrar com Google
      <img
        src="../assets/google.png"
        alt=""
        role="presentation"
        class="w-5 ml-1 inline"
      />
    </div>
  </div>
  <div
    v-if="loading"
    class="w-screen h-screen flex justify-center items-center bg-white/10 backdrop-blur-sm fixed left-0 top-0 z-10"
  >
    <img src="../assets/spinner.gif" alt="carregando" class="w-32" />
  </div>
</template>

<style scoped></style>
