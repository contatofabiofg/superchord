<script setup>
import { ref, onMounted, watch } from 'vue'
import { tunes, intervals, dissonants, listaDeAcordes } from '../data/utils.js'
import { jsPDF } from 'jspdf'
import { polyfill } from 'mobile-drag-drop'
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour'

import {
  createChord,
  getAllChords,
  updateChord,
  keyFire,
  userCol,
} from '../firebase'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
})

const auth = getAuth()
const router = useRouter()

watch(keyFire, () => {
  getChords()
})

const tune = ref('C')
const chord = ref([])
const chordToDrop = ref('')
const chordToErase = ref(null)
const musicName = ref('Nome da Música')
const eraseArea = ref(false)
const pressModel = ref(true)
const zoom = ref(false)
const hide = ref(false)
const idChord = ref(null)
const chordList = ref([])
const modal = ref(false)
const modalTunes = ref(false)
const showMusicList = ref(false)
const status = ref(null)

onMounted(() => {
  getChords()
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      //if esc key was not pressed in combination with ctrl or alt or shift
      closeModal()
    }
  })
})

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

function dragAddBackground(e) {
  e.currentTarget.classList.add('hover')
}
function dragRemoveBackground(e) {
  e.currentTarget.classList.remove('hover')
}

function addChord(gradevalue, variationValue) {
  if (chord.value.length == 0) {
    chord.value.push([])
  }

  if (chord.value[chord.value.length - 1].length < 6) {
    chord.value[chord.value.length - 1].push({
      grade: gradevalue,
      variation: variationValue,
    })
  } else {
    chord.value.push([])
    chord.value[chord.value.length - 1].push({
      grade: gradevalue,
      variation: variationValue,
    })
  }
}

function print() {
  let doc = new jsPDF()
  pressModel.value = true

  let elementHTML = document.querySelector('#imprimir')

  doc.html(elementHTML, {
    callback: function (doc) {
      // Save the PDF
      doc.save(musicName.value + '.pdf')
    },
    // x: 15,
    // y: 15,
    //width: 595, //target width in the PDF document
    // windowWidth: 650, //window width in CSS pixels
  })

  closeModal()
}

function logout() {
  auth.signOut()

  router.push({ name: 'Login' })
}

/*
function downloadFile(filename, text) {
  let element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

function download() {
  let json = [tune.value]
  json.push(JSON.stringify(chord.value))
  if (musicName.value.length > 0) {
    json.push(musicName.value)
  }

  downloadFile(musicName.value || 'chord', JSON.stringify(json))
}
*/

function saveOnline() {
  createChord()

  let json = [tune.value]
  json.push(JSON.stringify(chord.value))
  if (musicName.value.length > 0) {
    json.push(musicName.value)
  }

  let item = {
    tune: tune.value,
    chord: JSON.stringify(chord.value),
    name: musicName.value,
  }

  if (idChord.value) {
    item.id = idChord.value
    status.value = 'updated'
    updateChord(item).then(() => {
      closeModal()
    })
  } else {
    idChord.value = new Date().getTime().toString()
    status.value = 'created'
    item.id = idChord.value
    createChord(item).then(() => {
      closeModal()
    })
  }
}

function showModal() {
  modal.value = true
  document.querySelector('body').style.overflow = 'hidden'
}

function showModalTunes() {
  modalTunes.value = true
  document.querySelector('body').style.overflow = 'hidden'
}

function loadMusic(item) {
  tune.value = item.tune
  chord.value = item.chord
  musicName.value = item.name
  idChord.value = item.id
}

function closeModal() {
  modal.value = false
  showMusicList.value = false
  document.querySelector('body').style.overflow = 'auto'
}

function handleFileSelect(event) {
  const reader = new FileReader()
  reader.onload = handleFileLoad
  reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {
  let json = JSON.parse(event.target.result)
  chord.value = []
  tune.value = json[0]
  if (json[2]) {
    musicName.value = json[2]
  }
  JSON.parse(json[1]).forEach((element) => chord.value.push(element))
}

function bassChordBydrop(line, position) {
  if (chordToDrop.value.char) {
    chord.value[line][position].char = chordToDrop.value.char
  } else {
    chord.value[line][position].bass = chordToDrop.value.grade
  }
}

function addChordBydrop(line, position, e) {
  if (chord.value[line].length < 6) {
    e.target.classList.remove('hover')
    chord.value[line].splice(position, 0, {
      grade: chordToDrop.value.grade,
      variation: chordToDrop.value.variation,
    })
  } else {
    e.target.classList.remove('hover')
  }
}

function eraseChordByDrop() {
  if (chordToErase.value) {
    chord.value[chordToErase.value.indexLinha].splice(
      chordToErase.value.indexAcorde,
      1
    )
    eraseArea.value = false
    chordToErase.value = ''
  } else {
    eraseArea.value = false
  }
}

function reset() {
  if (chord.value.length > 0) {
    if (window.confirm('Quer apagar toda esta chord?')) {
      while (chord.value.length > 0) {
        chord.value[0].forEach(() => chord.value.pop())
      }
    }
  }
}

function newChord() {
  if (chord.value.length > 0) {
    if (
      window.confirm(
        'Ao começar uma nova chord, todo progresso não salvo será perdido. Continuar?'
      )
    ) {
      musicName.value = 'Nome da música'
      idChord.value = null
      closeModal()
      while (chord.value.length > 0) {
        chord.value[0].forEach(() => chord.value.pop())
      }
    }
  }
}

function backspace() {
  if (chord.value[chord.value.length - 1].length - 1 > 0) {
    chord.value[chord.value.length - 1].pop()
  } else {
    chord.value.pop()
  }
}

function mutateChord(line, position) {
  let valueOfVariation = chord.value[line][position].variation
  let valueofGrade = chord.value[line][position].grade

  switch (valueOfVariation) {
    case null:
      chord.value[line][position] = {
        grade: valueofGrade,
        variation: 'm',
      }
      break
    case 'm':
      chord.value[line][position] = {
        grade: valueofGrade,
        variation: 'm7',
      }
      break
    case 'm7':
      chord.value[line][position] = {
        grade: valueofGrade,
        variation: 'm79',
      }
      break
    case 'm79':
      chord.value[line][position] = {
        grade: valueofGrade,
        variation: '7',
      }
      break
    case '7':
      chord.value[line][position] = {
        grade: valueofGrade,
        variation: '7M',
      }
      break
    case '7M':
      chord.value[line][position] = {
        grade: valueofGrade,
        variation: '7M9',
      }
      break
    case '7M9':
      chord.value[line][position] = {
        grade: valueofGrade,
        variation: 'º',
      }
      break
    case 'º':
      chord.value[line][position] = {
        grade: valueofGrade,
        variation: null,
      }
      break
  }
}

function inserirTexto(index) {
  let text = prompt('Insira aqui o seu texto')
  if (text.length > 2) {
    chord.value.splice(index, 0, ['text', text])
  }
}
</script>

<template>
  <a @click="logout()">
    <img
      src="../assets/logout.png"
      class="fixed top-3 left-3 w-10 p-2 rounded-full bg-white drop-shadow-lg z-20 cursor-pointer"
      alt="Sair"
    />
  </a>

  <!--MODAL MENU-->
  <transition
    appear
    enter-active-class="duration-300 ease-out"
    enter-from-class="transform  opacity-0"
    enter-to-class="opacity-100 "
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="modal"
      class="fixed top-0 left-0 right-0 bottom-0 z-20 w-screen h-screen bg-black/50 overflow-hidden flex justify-center items-center"
    >
      <transition
        appear
        enter-active-class="duration-300 ease-out"
        enter-from-class="transform -translate-x-1/4 opacity-0"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="duration-200 ease-out"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="transform -translate-x-1/4 opacity-0"
      >
        <div
          class="relative bg-white p-3 w-[300px] h-fit overflow-hidden drop-shadow-lg rounded-md"
        >
          <img src="../assets/superchord.png" class="w-40 m-auto my-2" alt="" />
          <p class="text-center text-sm">Você está logado como:</p>
          <p class="text-center text-sm italic mb-4">
            {{ userCol || 'Convidado - Funcionalidades limitadas' }}
          </p>

          <div v-if="!showMusicList">
            <div class="flex">
              <a class="button2 block m-1" @click="newChord()" title="New Chord"
                >New</a
              >
              <a class="button2 block m-1" @click="saveOnline()" title="Save"
                >Save</a
              >
            </div>
            <div class="flex">
              <a
                class="button2 block m-1"
                @click="showMusicList = true"
                title="Save"
                >Load</a
              >

              <a class="button2 block m-1" @click="print()" title="Apagar chord"
                >Print</a
              >
            </div>
            <div class="flex">
              <a
                class="button2 block m-1"
                @click="router.push('/multichords')"
                title="MultiChords"
              >
                MultiChords
              </a>

              <a
                class="button2 block m-1"
                @click=";(hide = true), closeModal()"
                title="Apagar chord"
                >Hide</a
              >
            </div>
          </div>
          <ul v-else class="w-[300px] h-[250px] overflow-y-scroll">
            <li
              v-for="(item, index) in chordList"
              :key="index"
              @click="loadMusic(item), closeModal()"
              class="p-2 mb-1 w-[95%] bg-gradient-to-r from-zinc-200 to-white cursor-pointer hover:brightness-110"
            >
              {{ item.name }}
            </li>
            <img
              src="../assets/arrow-left.png"
              class="absolute top-5 left-4 w-6 bg-white rounded-full p-1 cursor-pointer"
              alt="Back to menu"
              @click="showMusicList = false"
            />
          </ul>
          <img
            src="../assets/close.png"
            class="absolute top-5 right-4 w-6 bg-white rounded-full p-1 cursor-pointer"
            alt="Back to menu"
            @click="closeModal()"
          />
        </div>
      </transition>
    </div>
  </transition>

  <!--TONE PICKER-->
  <div
    class="z-10 w-full flex-col lg:justify-center lg:py-3 fixed bottom-0 shadow-[0_25px_60px_-15px_rgba(0,0,0,1)] bg-gradient-to-r from-zinc-800 to-zinc-700"
    :class="[hide ? 'h-0' : '']"
  >
    <div
      v-if="!hide"
      class="flex flex-wrap text-xl lg:justify-center lg:items-center"
    >
      <div v-for="(item, index) in intervals" :key="index">
        <button
          class="button"
          draggable="true"
          @dragstart="chordToDrop = item"
          @click="addChord(item.grade, item.variation)"
        >
          <span
            >{{ listaDeAcordes(tune)[item.grade]
            }}<span>{{ item.variation }}</span></span
          >
        </button>
      </div>

      <div v-for="(item, index) in dissonants" :key="index">
        <button
          class="button dissonant"
          draggable="true"
          @dragstart="chordToDrop = item"
          @click="addChord(item.grade, item.variation)"
        >
          <span
            >{{ listaDeAcordes(tune)[item.grade]
            }}<span>{{ item.variation }}</span></span
          >
        </button>
      </div>
      <button
        class="button"
        draggable="true"
        @dragstart="chordToDrop = { char: '(' }"
      >
        <span>(</span>
      </button>
      <button
        class="button"
        draggable="true"
        @dragstart="chordToDrop = { char: ')' }"
      >
        <span>)</span>
      </button>

      <button class="buttonbig" @click="showModalTunes()">
        Tune: {{ tune }}
      </button>

      <button class="button" @click="chord.push([])" title="Pular linha">
        ↲
      </button>

      <button class="button" @click="backspace()" title="Apagar acorde">
        ←
      </button>

      <button class="button" @click="reset()" title="Apagar chord">X</button>

      <button class="button" @click="showModal()" title="Menu">
        <img src="../assets/menu.png" alt="" class="w-7 m-auto" />
      </button>

      <button class="button" title="fire">
        <img src="../assets/fire.png" alt="" class="w-7 m-auto" />
      </button>

      <form enctype="multipart/form-data">
        <input
          type="file"
          id="upload"
          class="hidden"
          @change="handleFileSelect"
        />
      </form>
    </div>

    <div
      class="absolute z-10 right-8 -top-10 w-5 h-10 cursor-pointer text-3xl"
      @click="zoom = !zoom"
    >
      <img v-if="!zoom" src="../assets/zoomin.png" alt="zoom in" class="w-5" />
      <img v-else src="../assets/zoomout.png" alt="zoom out" class="w-5" />
    </div>
  </div>

  <!--MODAL TOM-->
  <transition
    appear
    enter-active-class="duration-300 ease-out"
    enter-from-class="transform  opacity-0"
    enter-to-class="opacity-100 "
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="modalTunes"
      class="fixed top-0 left-0 right-0 bottom-0 z-20 w-screen h-screen bg-black/50 overflow-hidden flex justify-center items-center"
    >
      <transition
        appear
        enter-active-class="duration-300 ease-out"
        enter-from-class="transform -translate-x-1/4 opacity-0"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="duration-200 ease-out"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="transform -translate-x-1/4 opacity-0"
      >
        <div
          class="relative flex flex-col items-center bg-white p-3 w-[300px] h-fit overflow-hidden drop-shadow-lg rounded-md"
        >
          <h2 class="mb-3">Escolha o Tom</h2>

          <div v-for="t in tunes" :key="t" class="w-full">
            <button
              class="buttonTune"
              :class="tune == t ? 'bg-orange-400' : ''"
              @click="
                () => {
                  tune = t
                  modalTunes = false
                }
              "
              :title="t"
            >
              {{ t.toUpperCase() }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

  <!--AREA DE EXIBIÇÃO-->

  <!-- eraseArea -->
  <div
    :class="[eraseArea ? 'bg-red-100' : 'bg-zinc-200', hide ? 'h-0' : 'h-16']"
    id="eraseTop"
    @dragover.prevent="eraseArea = true"
    @dragenter.prevent
    @dragleave="eraseArea = false"
    @drop="eraseChordByDrop()"
    class="flex fixed top-0 w-full justify-center items-center duration-100 overflow-hidden z-10"
  >
    <img
      src="../assets/trash.png"
      alt="trash"
      class="duration-100 w-8"
      :class="[eraseArea ? 'opacity-100' : 'opacity-10']"
    />
  </div>

  <div class="w-full my-24 lg:my-32"></div>

  <!-- folha -->

  <div
    class="-mt-[340px] w-[357px] h-[505px] lg:w-[840px] lg:h-[1188px] flex flex-col items-center bg-white drop-shadow-lg m-auto lg:pb-48 duration-100"
    :class="[hide ? '-mt-16' : 'mt-0']"
  >
    <div
      class="w-full h-full flex flex-col items-center scale-[42%] lg:scale-[100%] -mt-[140px] lg:-mt-0"
    >
      <input
        class="text-[44px] my-10 ml-5 border-0 p-0 font-bold drop-shadow-none bg-transparent"
        :style="'width:' + (musicName.length + 2) + 'ch'"
        v-model="musicName"
      />
      <div
        v-for="(linha, indexLinha) in chord"
        :key="indexLinha"
        class="flex items-center font-bold mb-[20px]"
        :class="[
          zoom ? ' transform scale-[135%]' : 'transform scale-[100%]',

          linha[0] == 'text' ? 'h-[60px] ' : 'h-12 text-[32px]',
        ]"
      >
        <span
          v-if="linha[0] != 'text'"
          @click="inserirTexto(indexLinha)"
          class="opacity-50 cursor-pointer"
          >+</span
        >
        <div v-if="linha[0] == 'text'" class="text-[30px]">
          <span @click="chord.splice(indexLinha, 1)">{{ linha[1] }}</span>
        </div>
        <div
          v-else
          v-for="(acorde, indexAcorde) in linha"
          :key="indexAcorde"
          class="h-full"
        >
          <div class="flex items-center duration-100 h-full">
            <span
              class="w-[16px] h-full duration-100"
              @dragover.prevent="dragAddBackground"
              @dragleave="dragRemoveBackground"
              @dragenter.prevent
              @drop="addChordBydrop(indexLinha, indexAcorde, $event)"
            ></span>
            <span
              draggable="true"
              @dragstart="
                ;(chordToErase = { indexLinha, indexAcorde }),
                  (chordToDrop = acorde)
              "
              class="rounded cursor-pointer p-[4px] hover:bg-slate-100 select-none duration-100"
              @dragover.prevent
              @dragenter.prevent
              @drop="bassChordBydrop(indexLinha, indexAcorde)"
              @click="mutateChord(indexLinha, indexAcorde)"
            >
              <span v-if="acorde.char == '('">(</span>
              <span
                >{{ listaDeAcordes(tune)[acorde.grade]
                }}<span>{{ acorde.variation }}</span>
                <span v-if="acorde.bass"
                  >/{{ listaDeAcordes(tune)[acorde.bass] }}</span
                >
              </span>
              <span v-if="acorde.char == ')'">)</span>
            </span>

            <span
              class="w-[16px] h-full duration-100"
              @dragover.prevent="dragAddBackground"
              @dragleave="dragRemoveBackground"
              @dragenter.prevent
              @drop="addChordBydrop(indexLinha, indexAcorde + 1, $event)"
            ></span>
          </div>
        </div>
        <img
          v-if="indexLinha + 1 == chord.length"
          src="../assets/insertion.gif"
          class="w-1 max-h-[40px] inline"
          alt=""
        />
      </div>
    </div>
  </div>

  <div class="h-[200px] lg:h-[100px]"></div>

  <!--AREA DE IMPRESSÃO-->
  <!-- top-0 -right-[2000px]-->
  <div class="fixed top-60 left-40 scale-[200%] hidden">
    <div
      v-if="pressModel"
      id="imprimir"
      class="w-[210px] h-[297px] bg-white flex flex-col items-center pb-64"
    >
      <h1 class="text-[12px] my-[9px] font-bold">{{ musicName }}</h1>

      <div
        v-for="(linha, indexLinha) in chord"
        :key="indexLinha"
        class="flex items-center font-bold mb-[3px]"
        :class="[
          zoom ? ' transform scale-[135%]' : 'transform scale-[100%]',

          linha[0] == 'text' ? 'h-4 ' : 'h-12 text-[8px]',
        ]"
      >
        <div v-if="linha[0] == 'text'" class="text-[8px]">
          <span @click="chord.splice(indexLinha, 1)">{{ linha[1] }}</span>
        </div>
        <div v-else v-for="(acorde, indexAcorde) in linha" :key="indexAcorde">
          <div class="flex items-center duration-100">
            <span
              class="w-[4px] h-full duration-100"
              @dragover.prevent="dragAddBackground"
              @dragleave="dragRemoveBackground"
              @dragenter.prevent
              @drop="addChordBydrop(indexLinha, indexAcorde, $event)"
            ></span>
            <span
              draggable="true"
              @dragstart="
                ;(chordToErase = { indexLinha, indexAcorde }),
                  (chordToDrop = acorde)
              "
              class="rounded cursor-pointer select-none duration-100 p-[1px]"
              @dragover.prevent
              @drop="bassChordBydrop(indexLinha, indexAcorde)"
              @click="mutateChord(indexLinha, indexAcorde)"
            >
              <span v-if="acorde.char == '('">(</span>
              <span
                >{{ listaDeAcordes(tune)[acorde.grade]
                }}<span>{{ acorde.variation }}</span>
                <span v-if="acorde.bass"
                  >/{{ listaDeAcordes(tune)[acorde.bass] }}</span
                >
                <span v-if="acorde.char == ')'">)</span>
              </span>
            </span>
            <span
              class="w-[4px] h-full duration-100"
              @dragover.prevent="dragAddBackground"
              @dragleave="dragRemoveBackground"
              @dragenter.prevent
              @drop="addChordBydrop(indexLinha, indexAcorde + 1, $event)"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover {
  @apply w-[25px];
}
</style>
