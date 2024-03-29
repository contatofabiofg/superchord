/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app'
import { ref } from 'vue'

import {
  doc,
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore'
//import { ref, onUnmounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

//CONFIGURAÇÃO
const config = {
  apiKey: `${import.meta.env.VITE_APIKEY}`,
  authDomain: `${import.meta.env.VITE_AUTHDOMAIN}`,
  projectId: `${import.meta.env.VITE_PROJECTID}`,
  storageBucket: `${import.meta.env.VITE_STORAGEBUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_MESSAGINGSENDERID}`,
  appId: `${import.meta.env.VITE_APPID}`,
}
const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp)
export const auth = getAuth()
export const keyFire = ref(0)
export const userCol = ref(null)

async function getUser() {
  if (auth.currentUser) {
    userCol.value = auth.currentUser.email
    console.log(await auth.currentUser.getIdTokenResult())
  }
}

onAuthStateChanged(auth, () => {
  if (auth.currentUser) {
    getUser()
  }
})

//CRUD
export async function createChord(item) {
  await getUser()
  try {
    setDoc(doc(db, userCol.value, item.id), item).then(() => {
      alert(`Cifra "${item.name}" salva com sucesso!`)
      keyFire.value++
    })
  } catch (e) {
    alert(
      'Houve algum problema pra salvar sua cifra. Como a autenticação está em aberto, você pode não estar logado!'
    )
  }
}

export async function updateChord(item) {
  await getUser()
  try {
    updateDoc(doc(db, userCol.value, item.id), item).then(() => {
      alert(`Cifra "${item.name}" atualizada com sucesso!`)
      keyFire.value++
    })
  } catch (e) {
    alert(
      'Houve algum problema pra salvar sua cifra. Como a autenticação está em aberto, você pode não estar logado!'
    )
  }
}

export async function getAllChords() {
  debugger
  let responseData
  await getUser()
  if (userCol.value) {
    await getDocs(collection(db, userCol.value)).then((response) => {
      responseData = response
    })
  }

  return responseData
}

export async function searchChord(name) {
  let obj

  await getDocs(collection(db, userCol.value)).then((response) => {
    response.forEach((element) => {
      if (element.data().name.toLowerCase() == name.toLowerCase()) {
        obj = { name: element.data().name, chord: element.data().chord }
      }
    })
  })
  console.log(obj)
  return obj
}

/*

export const getName = async (id) => {
  const name = await namesCollection.doc(id).get();
  return name.exists ? name.data() : null;
};

export const updateName = (id, name) => {
  return namesCollection.doc(id).update(name);
};
*/
export async function deleteChord(col) {
  let list = []

  await getDocs(collection(db, col)).then(async (response) => {
    response.forEach((element) => {
      list.push(element.data().name)
    })
    for (let i = 0, j = list.length - 1; i <= j; i++) {
      await deleteDoc(doc(db, col, list[i]))
    }
  })
}
