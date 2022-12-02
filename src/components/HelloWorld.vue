<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import { polyfill } from 'mobile-drag-drop'
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour'
import { createChord } from '../firebase'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'

const auth = getAuth()
const router = useRouter()

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
})

const tom = ref('C')
const cifra = ref([])
const chordToDrop = ref('')
const chordToErase = ref(null)
const musicName = ref('')
const submenu = ref(false)
const eraseArea = ref(false)
const pressModel = ref(true)
const zoom = ref(false)
const hide = ref(false)
const idChord = ref(null)

function dragAddBackground(e) {
  e.currentTarget.classList.add('hover')
}
function dragRemoveBackground(e) {
  e.currentTarget.classList.remove('hover')
}

function addChord(gradevalue, variationValue) {
  if (cifra.value.length == 0) {
    cifra.value.push([])
  }

  if (cifra.value[cifra.value.length - 1].length < 6) {
    cifra.value[cifra.value.length - 1].push({
      grade: gradevalue,
      variation: variationValue,
    })
  } else {
    cifra.value.push([])
    cifra.value[cifra.value.length - 1].push({
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
      doc.save('sample-document.pdf')
    },
    x: 15,
    y: 15,
    width: 170, //target width in the PDF document
    windowWidth: 650, //window width in CSS pixels
  })
}

function logout() {
  auth.signOut()

  router.push({ name: 'login' })
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
  let json = [tom.value]
  json.push(JSON.stringify(cifra.value))
  if (musicName.value.length > 0) {
    json.push(musicName.value)
  }

  downloadFile(musicName.value || 'cifra', JSON.stringify(json))
}
*/

function saveOnline() {
  let json = [tom.value]
  json.push(JSON.stringify(cifra.value))
  if (musicName.value.length > 0) {
    json.push(musicName.value)
  }

  let item = {
    tom: tom.value,
    cifra: JSON.stringify(cifra.value),
    name: musicName.value,
  }

  if (idChord.value) {
    item.id = idChord.value
  } else {
    item.id = new Date().getTime().toString()
  }

  createChord(item)
}

function handleFileSelect(event) {
  const reader = new FileReader()
  reader.onload = handleFileLoad
  reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {
  let json = JSON.parse(event.target.result)
  cifra.value = []
  tom.value = json[0]
  if (json[2]) {
    musicName.value = json[2]
  }
  JSON.parse(json[1]).forEach((element) => cifra.value.push(element))
}

function bassChordBydrop(line, position) {
  cifra.value[line][position].bass = chordToDrop.value.grade
}
function addChordBydrop(line, position, e) {
  if (cifra.value[line].length < 6) {
    e.target.classList.remove('hover')
    cifra.value[line].splice(position, 0, {
      grade: chordToDrop.value.grade,
      variation: chordToDrop.value.variation,
    })
  } else {
    e.target.classList.remove('hover')
  }
}

function eraseChordByDrop() {
  if (chordToErase.value) {
    cifra.value[chordToErase.value.indexLinha].splice(
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
  if (cifra.value.length > 0) {
    if (window.confirm('Quer apagar toda esta cifra?')) {
      while (cifra.value[0].length > 0) {
        cifra.value[0].forEach(() => cifra.value.pop())
      }
    }
  }
}

function backspace() {
  if (cifra.value[cifra.value.length - 1].length - 1 > 0) {
    cifra.value[cifra.value.length - 1].pop()
  } else {
    console.log('apagou')
    cifra.value.pop()
  }
}

function mutateChord(line, position) {
  let valueOfVariation = cifra.value[line][position].variation
  let valueofGrade = cifra.value[line][position].grade

  switch (valueOfVariation) {
    case null:
      cifra.value[line][position] = {
        grade: valueofGrade,
        variation: 'm',
      }
      break
    case 'm':
      cifra.value[line][position] = {
        grade: valueofGrade,
        variation: 'm7',
      }
      break
    case 'm7':
      cifra.value[line][position] = {
        grade: valueofGrade,
        variation: 'm79',
      }
      break
    case 'm79':
      cifra.value[line][position] = {
        grade: valueofGrade,
        variation: '7',
      }
      break
    case '7':
      cifra.value[line][position] = {
        grade: valueofGrade,
        variation: '7M',
      }
      break
    case '7M':
      cifra.value[line][position] = {
        grade: valueofGrade,
        variation: '7M9',
      }
      break
    case '7M9':
      cifra.value[line][position] = {
        grade: valueofGrade,
        variation: null,
      }
      break
  }
}

const intervals = ref([
  { grade: 'I', variation: null },
  { grade: 'II', variation: 'm' },
  { grade: 'III', variation: 'm' },
  { grade: 'IV', variation: null },
  { grade: 'V', variation: null },
  { grade: 'VI', variation: 'm' },
  { grade: 'VII', variation: 'º' },
])

const dissonants = ref([
  { grade: 'Ia', variation: null },
  { grade: 'IIIm', variation: null },
  { grade: 'IVa', variation: null },
  { grade: 'Va', variation: null },
  { grade: 'VIIm', variation: null },
])

function listaDeAcordes() {
  let obj
  switch (tom.value) {
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

function tamanhoDaFonte(linha) {
  let retorno
  switch (linha.length) {
    case 1:
      retorno = 'text-3xl'
      break
    case 2:
      retorno = 'text-3xl'
      break
    case 3:
      retorno = 'text-2xl'
      break
    case 4:
      retorno = 'text-2xl'
      break
    case 5:
      retorno = 'text-lg'
      break
    case 6:
      retorno = 'text-md'
      break
  }
  return retorno
}
</script>

<template>
  <button @click="logout()">
    <img
      src="../assets/logout.png"
      class="fixed top-3 left-3 w-12 p-2 rounded-full bg-white drop-shadow-lg z-20"
      alt=""
    />
  </button>

  <!--TONE PICKER-->
  <div
    class="z-10 w-full flex-col justify-center py-3 fixed bottom-0 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,1)]"
    :class="[hide ? 'h-0' : '']"
  >
    <div
      v-if="!hide"
      class="flex flex-wrap text-xl justify-center lg:items-center"
    >
      <div class="flex flex-col mr-2 lg:mr-10">
        <label for="tom">Escolha o tom</label>
        <select
          name="tom"
          id="tom"
          class="border border-slate-300"
          v-model="tom"
        >
          <option value="C" selected>C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </div>

      <div v-for="(item, index) in intervals" :key="index">
        <div
          draggable="true"
          @dragstart="chordToDrop = item"
          class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
          @click="addChord(item.grade, item.variation)"
        >
          <span
            >{{ listaDeAcordes()[item.grade]
            }}<span>{{ item.variation }}</span></span
          >
        </div>
      </div>

      <div
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
        @click="cifra.push([])"
        title="Pular linha"
      >
        ↲
      </div>

      <div
        @click="backspace()"
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
        title="Apagar acorde"
      >
        ←
      </div>

      <div
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
        @click="reset()"
        title="Apagar cifra"
      >
        X
      </div>
      <div
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
        @click="saveOnline()"
        title="Save"
      >
        Save
      </div>
      <div
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
        onclick="document.getElementById('upload').click();"
        title="Apagar cifra"
      >
        Load
      </div>
      <div
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
        @click="print()"
        title="Apagar cifra"
      >
        Print
      </div>
      <div
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
        @click="hide = true"
        title="Apagar cifra"
      >
        Hide
      </div>

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
      @click=";[(submenu = !submenu), (hide = false)]"
    >
      <img src="../assets/down.png" alt="Down button" class="w-5" />
    </div>
    <div
      class="absolute z-10 right-8 -top-20 w-5 h-10 cursor-pointer text-3xl"
      @click="zoom = !zoom"
    >
      <img v-if="!zoom" src="../assets/zoomin.png" alt="zoom in" class="w-5" />
      <img v-else src="../assets/zoomout.png" alt="zoom out" class="w-5" />
    </div>
    <div
      :class="[submenu ? 'h-18 p-2' : 'h-0']"
      class="w-full overflow-hidden duration-100 flex justify-center flex-wrap"
    >
      <div class="flex flex-col mr-2 lg:mr-10">
        <label for="musicName">Escreva o nome da música</label>
        <input
          type="text"
          class="border border-slate-300 p-1 outline-none"
          v-model="musicName"
        />
      </div>

      <div v-for="(item, index) in dissonants" :key="index">
        <div
          draggable="true"
          @dragstart="chordToDrop = item"
          class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
          @click="addChord(item.grade, item.variation)"
        >
          <span
            >{{ listaDeAcordes()[item.grade]
            }}<span>{{ item.variation }}</span></span
          >
        </div>
      </div>
      <div
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 lg:m-2 select-none"
        @click="router.push('/multichords')"
        title="MultiChords"
      >
        MultiChords
      </div>
    </div>
  </div>

  <!--AREA DE EXIBIÇÃO-->
  <div
    :class="[eraseArea ? 'bg-red-100' : 'bg-slate-50']"
    id="eraseTop"
    @dragover.prevent="eraseArea = true"
    @dragenter.prevent
    @dragleave="eraseArea = false"
    @drop="eraseChordByDrop()"
    class="fixed top-0 w-full flex justify-center items-center h-16 lg:h-24 duration-100"
  >
    <img
      src="../assets/trash.png"
      alt="trash"
      class="duration-100 w-8"
      :class="[eraseArea ? 'opacity-100' : 'opacity-10']"
    />
  </div>

  <div class="w-full my-24 lg:my-32"></div>

  <div class="w-full flex flex-col items-center">
    <h1 class="text-xl lg:text-3xl mb-5 font-bold">{{ musicName }}</h1>

    <div
      v-for="(linha, indexLinha) in cifra"
      :key="indexLinha"
      class="h-14 lg:h-24 flex items-center lg:text-4xl font-bold"
      :class="[
        zoom ? ' transform scale-[135%]' : 'transform scale-[100%]',
        tamanhoDaFonte(linha),
      ]"
    >
      <div v-for="(acorde, indexAcorde) in linha" :key="indexAcorde">
        <div class="flex items-center duration-100">
          <span
            class="w-1 lg:w-4 h-16 duration-100"
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
            class="px-1 lg:px-2 rounded cursor-pointer hover:bg-slate-100 select-none hover:border-red-300 duration-100"
            @dragover.prevent
            @dragenter.prevent
            @drop="bassChordBydrop(indexLinha, indexAcorde)"
            @click="mutateChord(indexLinha, indexAcorde)"
          >
            <span
              >{{ listaDeAcordes()[acorde.grade]
              }}<span>{{ acorde.variation }}</span>
              <span v-if="acorde.bass"
                >/{{ listaDeAcordes()[acorde.bass] }}</span
              >
            </span>
          </span>

          <span
            class="w-1 lg:w-4 h-16 duration-100"
            @dragover.prevent="dragAddBackground"
            @dragleave="dragRemoveBackground"
            @dragenter.prevent
            @drop="addChordBydrop(indexLinha, indexAcorde + 1, $event)"
          ></span>
        </div>
      </div>
    </div>
  </div>

  <!--AREA DE IMPRESSÃO-->
  <div class="fixed top-0 -right-[2000px]">
    <div
      v-if="pressModel"
      id="imprimir"
      class="w-full flex flex-col items-center"
    >
      <h1 class="text-3xl mb-5 font-bold">{{ musicName }}</h1>

      <div
        v-for="(linha, indexLinha) in cifra"
        :key="indexLinha"
        class="h-24 flex items-center text-4xl font-bold"
      >
        <div v-for="(acorde, indexAcorde) in linha" :key="indexAcorde">
          <div class="flex items-center duration-100">
            <span
              draggable="true"
              @dragstart="
                ;(chordToErase = { indexLinha, indexAcorde }),
                  (chordToDrop = acorde)
              "
              class="px-3 rounded cursor-pointer select-none duration-100"
              @dragover.prevent
              @drop="bassChordBydrop(indexLinha, indexAcorde)"
              @click="mutateChord(indexLinha, indexAcorde)"
            >
              <span
                >{{ listaDeAcordes()[acorde.grade]
                }}<span>{{ acorde.variation }}</span>
                <span v-if="acorde.bass"
                  >/{{ listaDeAcordes()[acorde.bass] }}</span
                >
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover {
  @apply w-6;
}
</style>
