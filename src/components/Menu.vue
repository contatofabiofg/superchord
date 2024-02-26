<script setup lang="ts">
import Dropdown from 'primevue/dropdown'
import { onMounted, ref, toRaw } from 'vue'
import { getAllChords, userCol } from '../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  tom: String,
})
const emit = defineEmits([
  'carregar',
  'selecionar-tom',
  'novoAcorde',
  'salvar',
  'imprimir',
])

const musicsToLoad = ref(false)
const chordList = ref([])

const selectedTune = ref('C')
const tunes = ref(['C', 'D', 'E', 'F', 'G', 'A', 'B'])

onMounted(() => {
  selectedTune.value = structuredClone(toRaw(props.tom))
})

function loadMusic(item) {
  emit('carregar', item)
}

async function getChords() {
  chordList.value = []
  let response = await getAllChords()
  if (response) {
    response.forEach((element) => {
      let chordJSON = JSON.parse(element.data().chord)
      let obj = {
        name: element.data().name,
        chord: chordJSON,
        tune: element.data().tune,
        id: element.data().id,
      }
      chordList.value.push(obj)
    })
  }
}

function carregarMusicas() {
  getChords()
  musicsToLoad.value = true
}

function selecionarTom() {
  emit('selecionar-tom', selectedTune.value)
}

function newChord() {
  emit('novoAcorde')
}

function saveOnline() {
  emit('salvar')
}

function print() {
  emit('imprimir')
}
</script>
<template>
  <div class="p-4">
    <img src="../assets/superchord.png" class="w-40 m-auto my-2" alt="" />
    <p class="text-center text-sm">Você está logado como:</p>
    <p class="text-center text-sm italic mb-4">
      {{ userCol || 'Convidado - Funcionalidades limitadas' }}
    </p>

    <div>
      <div class="flex gap-2">
        <a class="button2 block my-1" @click="newChord()" title="New Chord"
          >Nova Cifra</a
        >
        <a class="button2 block my-1" @click="saveOnline()" title="Save"
          >Salvar</a
        >
      </div>
      <div class="flex gap-2">
        <a class="button2 block my-1" @click="carregarMusicas()" title="Save"
          >Carregar</a
        >

        <a class="button2 block my-1" @click="print()" title="Apagar chord"
          >Imprimir</a
        >
      </div>
      <div class="flex">
        <a
          class="button2 block my-1"
          @click="router.push('/multichords')"
          title="MultiChords"
        >
          MultiChord
        </a>
      </div>
    </div>
    <div v-if="musicsToLoad" class="mt-3">
      <ul class="w-full h-[250px] overflow-y-scroll mb-3">
        <li
          v-for="(item, index) in chordList"
          :key="index"
          @click="loadMusic(item)"
          class="p-2 mb-2 w-[95%] bg-gradient-to-r from-zinc-200 to-white cursor-pointer hover:brightness-110 rounded-lg"
        >
          {{ item.name }}
        </li>
      </ul>
      <button class="button2 mb-2" @click="musicsToLoad = false">
        Fechar lista
      </button>
    </div>

    <label for="">Selecione o tom</label>
    <Dropdown
      v-model="selectedTune"
      :options="tunes"
      placeholder="C, D, E..."
      class="w-full border-2 border-zinc-300"
      @change="selecionarTom()"
    >
      <template #value="slotProps">
        <div class="p-2">
          {{ slotProps.value }}
        </div>
      </template>
      <template #option="slotProps">
        <div class="p-2">{{ slotProps.option }}</div>
      </template>
    </Dropdown>
  </div>
</template>
