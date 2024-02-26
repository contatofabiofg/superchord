<script setup>
import { ref, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import { getAllChords } from '../firebase'

const multiChord = ref([])
const chordList = ref([])
const pressModel = ref(true)
const zoom = ref({})
const mobileView = ref(true)
const menuOpen = ref(true)
const windowWidthScreen = ref(620)

onMounted(() => {
  getChords()
  if (window.innerWidth > 900) {
    mobileView.value = false
    windowWidthScreen.value = 650
  }
})

async function getChords() {
  let response = await getAllChords()
  chordList.value = []
  response.forEach((element) => {
    let chordJSON = JSON.parse(element.data().chord)
    let obj = {
      name: element.data().name,
      chord: chordJSON,
      tune: element.data().tune,
    }
    chordList.value.push(obj)
  })
}

function adicionar(item) {
  multiChord.value.push(item)
}

function deleteChord(index) {
  multiChord.value.splice(index, 1)
}

function print() {
  let doc = new jsPDF()
  pressModel.value = true

  let elementHTML = document.querySelector('#printArea')

  doc.html(elementHTML, {
    callback: function (doc) {
      // Save the PDF
      doc.save('superchord.pdf')
    },
    x: 15,
    y: 15,
    width: 200, //target width in the PDF document
    windowWidth: windowWidthScreen.value, //window width in CSS pixels
  })
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

function listaDeAcordes(tune) {
  let obj
  switch (tune) {
    case 'G':
      obj = {
        I: 'G',
        II: 'A',
        III: 'B',
        IV: 'C',
        V: 'D',
        VI: 'E',
        VII: 'F#',
        Ia: 'G#',
        IIIm: 'A#',
        IVa: 'C#',
        Va: 'D#',
        VIIm: 'F',
      }
      break
    case 'A':
      obj = {
        I: 'A',
        II: 'B',
        III: 'C#',
        IV: 'D',
        V: 'E',
        VI: 'F#',
        VII: 'G#',
        Ia: 'A#',
        IIIm: 'C',
        IVa: 'D#',
        Va: 'F',
        VIIm: 'G',
      }
      break
    case 'B':
      obj = {
        I: 'B',
        II: 'C#',
        III: 'D#',
        IV: 'E',
        V: 'F#',
        VI: 'G#',
        VII: 'A#',
        Ia: 'C',
        IIIm: 'D',
        IVa: 'F',
        Va: 'G',
        VIIm: 'A',
      }
      break
    case 'C':
      obj = {
        I: 'C',
        II: 'D',
        III: 'E',
        IV: 'F',
        V: 'G',
        VI: 'A',
        VII: 'B',
        Ia: 'C#',
        IIIm: 'D#',
        IVa: 'F#',
        Va: 'G#',
        VIIm: 'A#',
      }
      break
    case 'D':
      obj = {
        I: 'D',
        II: 'E',
        III: 'F#',
        IV: 'G',
        V: 'A',
        VI: 'B',
        VII: 'C#',
        Ia: 'D#',
        IIIm: 'F',
        IVa: 'G#',
        Va: 'A#',
        VIIm: 'C',
      }
      break
    case 'E':
      obj = {
        I: 'E',
        II: 'F#',
        III: 'G#',
        IV: 'A',
        V: 'B',
        VI: 'C#',
        VII: 'D#',
        Ia: 'F',
        IIIm: 'G',
        IVa: 'A#',
        Va: 'C',
        VIIm: 'D',
      }
      break
    case 'F':
      obj = {
        I: 'F',
        II: 'G',
        III: 'A',
        IV: 'Bb',
        V: 'C',
        VI: 'D',
        VII: 'Eº',
        Ia: 'F#',
        IIIm: 'G',
        IVa: 'B',
        Va: 'C#',
        VIIm: 'D#',
      }
      break
  }
  return obj
}
</script>

<template>
  <a @click="print()" v-if="!mobileView">
    <img
      src="../assets/printer.png"
      class="fixed top-3 right-3 w-12 p-2 rounded-full bg-white drop-shadow-lg cursor-pointer z-10"
      alt=""
    />
  </a>

  <!-- Sidebar -->

  <div
    class="fixed w-full lg:w-[300px] lg:h-auto lg:top-0 bottom-0 bg-zinc-800 drop-shadow-2xl p-3 lg:overflow-hidden z-10 duration-100"
    :class="[menuOpen ? 'h-[30%]' : 'h-[0%]']"
  >
    <div class="flex justify-between mx-2">
      <h1
        :class="[menuOpen ? '' : 'opacity-0']"
        @click="getChords()"
        class="text-xl text-white font-bold mb-4"
      >
        Suas Cifras
      </h1>
      <div class="flex" v-if="mobileView">
        <img
          src="../assets/printer.png"
          alt="Print"
          class="w-5 h-5 invert mr-4"
          :class="[menuOpen ? '' : 'opacity-0']"
          @click="print()"
        />
        <img
          src="../assets/undo.png"
          alt="Backspace"
          class="w-5 h-5 invert mr-4"
          :class="[menuOpen ? '' : 'opacity-0']"
          @click="multiChord.pop()"
        />
        <img
          src="../assets/down.png"
          alt="Down button"
          class="relative w-4 h-5 z-10"
          :class="[menuOpen ? 'top-0 invert' : '-top-10']"
          @click="menuOpen = !menuOpen"
        />
      </div>
    </div>
    <ul class="h-[150px] lg:h-[90vh] w-[115%] overflow-y-scroll">
      <li
        v-for="(item, index) in chordList"
        :key="index"
        @click="adicionar(item)"
        class="p-2 text-white w-[90%] mb-2 cursor-pointer rounded-lg border border-zinc-600 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:brightness-125"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>

  <!-- Área de exibição -->

  <div
    class="m-auto lg:scale-100 p-1 lg:p-3 w-[80vw] lg:w-[580px] h-[550px] lg:h-[900px] lg:ml-[500px] mt-5 lg:mb-10 bg-white lg:mt-5 drop-shadow-lg"
  >
    <div class="w-full h-full flex flex-col flex-wrap">
      <div
        class="relative h-fit p-1 lg:p-3 border border-slate-400 inline"
        v-for="(item, index) in multiChord"
        :key="index"
      >
        <div
          class="text-[8px] lg:text-xl px-2 absolute top-0 left-0 border border-slate-400"
        >
          {{ item.name }}
          <img
            v-if="!zoom[index]"
            src="../assets/zoomin.png"
            class="w-3 lg:w-5 absolute top-1 -right-5 lg:-right-7 cursor-pointer"
            alt=""
            @click="zoom[index] = true"
          />
          <img
            v-else
            src="../assets/zoomout.png"
            class="w-3 lg:w-5 absolute top-1 -right-4 lg:-right-7 cursor-pointer"
            alt=""
            @click="zoom[index] = false"
          />
        </div>
        <div
          class="text-[10px] lg:text-xl px-1 lg:px-2 absolute top-0 right-0 border border-slate-400 cursor-pointer"
          @click="deleteChord(index)"
        >
          X
        </div>

        <div class="mt-8">
          <div
            v-for="(linha, indexLinha) in item.chord"
            :key="indexLinha"
            class="flex items-center"
            :class="[linha[0] == 'text' ? 'h-3 lg:h-5' : 'h-6 lg:h-10 ']"
          >
            <div
              v-if="linha[0] == 'text'"
              class="h-full text-center text-[10px] lg:text-lg -mt-12 lg:-ml-2"
            >
              <span @click="chord.splice(indexLinha, 1)">{{ linha[1] }}</span>
            </div>
            <div
              v-else
              v-for="(acorde, indexAcorde) in linha"
              :key="indexAcorde"
              class="font-bold"
            >
              <div
                class="flex"
                :class="[
                  zoom[index]
                    ? 'text-[11px] lg:text-lg'
                    : 'text-[9px] lg:text-sm',
                ]"
              >
                <span class="w-0.5 lg:w-2 h-16"></span>
                <span v-if="acorde.char == '('">(</span>
                <span
                  >{{ listaDeAcordes(item.tune)[acorde.grade]
                  }}<span>{{ acorde.variation }}</span>
                  <span v-if="acorde.bass"
                    >/{{ listaDeAcordes(item.tune)[acorde.bass] }}</span
                  >
                  <span v-if="acorde.char == ')'">)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Area de impressão -->

  <div class="fixed top-0 -right-[2000px]">
    <div id="printArea" class="w-[550px] h-[900px] absolute -ml-4 -mt-8">
      <img
        src="../assets/superchord.png"
        class="mx-auto w-36 mb-4 ml-64"
        alt=""
      />
      <div class="w-full h-full flex flex-col flex-wrap">
        <div
          class="relative h-fit p-3 border border-slate-400 inline"
          v-for="(item, index) in multiChord"
          :key="index"
        >
          <div class="text-xl absolute top-0 left-2">
            <span class="text-orange-600">{{ item.name }}</span>
            <div></div>
          </div>

          <div class="mt-8">
            <div
              v-for="(linha, indexLinha) in item.chord"
              :key="indexLinha"
              class="flex items-center"
              :class="[linha[0] == 'text' ? 'h-5' : 'h-10 ']"
            >
              <div
                v-if="linha[0] == 'text'"
                class="h-full text-center -mt-10 -ml-2"
              >
                <span @click="chord.splice(indexLinha, 1)">{{ linha[1] }}</span>
              </div>
              <div v-for="(acorde, indexAcorde) in linha" :key="indexAcorde">
                <div
                  class="flex font-bold"
                  :class="[zoom[index] ? 'text-xl' : 'text-md']"
                >
                  <span class="w-1 lg:w-3 h-16"></span>
                  <span v-if="acorde.char == '('">(</span>
                  <span
                    >{{ listaDeAcordes(item.tune)[acorde.grade]
                    }}<span>{{ acorde.variation }}</span>
                    <span v-if="acorde.bass"
                      >/{{ listaDeAcordes(item.tune)[acorde.bass] }}</span
                    >
                    <span v-if="acorde.char == ')'">)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
