<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import { polyfill } from 'mobile-drag-drop'
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour'

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
})

function print() {
  let doc = new jsPDF()
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

const objetoCifra = ref({
  tom: 'C',
  cifra: [],
})
const cifra = objetoCifra.value.cifra
const chordToDrop = ref('')
const chordToErase = ref(null)
const musicName = ref('')
const submenu = ref(false)

function dragAddBackground(e) {
  e.currentTarget.classList.add('hover')
}
function dragRemoveBackground(e) {
  e.currentTarget.classList.remove('hover')
}

function addChord(gradevalue, variationValue) {
  if (cifra.length == 0) {
    cifra.push([])
  }

  if (cifra[cifra.length - 1].length < 6) {
    cifra[cifra.length - 1].push({
      grade: gradevalue,
      variation: variationValue,
    })
  } else {
    cifra.push([])
    cifra[cifra.length - 1].push({
      grade: gradevalue,
      variation: variationValue,
    })
  }
}

function bassChordBydrop(line, position) {
  cifra[line][position].bass = chordToDrop.value.grade
}
function addChordBydrop(line, position, e) {
  if (cifra[line].length < 6) {
    e.target.classList.remove('hover')
    cifra[line].splice(position, 0, {
      grade: chordToDrop.value.grade,
      variation: chordToDrop.value.variation,
    })
  } else {
    e.target.classList.remove('hover')
  }
}

function eraseChordByDrop() {
  cifra[chordToErase.value.indexLinha].splice(chordToErase.value.indexAcorde, 1)
}

function reset() {
  if (cifra.length > 0) {
    if (window.confirm('Quer apagar toda esta cifra?')) {
      cifra[0].forEach(() => cifra.pop())
    }
  }
}

function backspace() {
  if (cifra[cifra.length - 1].length - 1 > 0) {
    cifra[cifra.length - 1].pop()
  } else {
    console.log('apagou')
    cifra.pop()
  }
}

function mutateChord(line, position) {
  let valueOfVariation = cifra[line][position].variation
  let valueofGrade = cifra[line][position].grade

  switch (valueOfVariation) {
    case null:
      cifra[line][position] = {
        grade: valueofGrade,
        variation: 'm',
      }
      break
    case 'm':
      cifra[line][position] = {
        grade: valueofGrade,
        variation: 'm7',
      }
      break
    case 'm7':
      cifra[line][position] = {
        grade: valueofGrade,
        variation: 'm79',
      }
      break
    case 'm79':
      cifra[line][position] = {
        grade: valueofGrade,
        variation: '7',
      }
      break
    case '7':
      cifra[line][position] = {
        grade: valueofGrade,
        variation: '7M',
      }
      break
    case '7M':
      cifra[line][position] = {
        grade: valueofGrade,
        variation: '7M9',
      }
      break
    case '7M9':
      cifra[line][position] = {
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
  switch (objetoCifra.value.tom) {
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
  <!--TONE PICKER-->
  <div
    class="w-full flex-col justify-center py-3 fixed bottom-0 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,1)]"
  >
    <div class="flex flex-wrap text-xl justify-center lg:items-center">
      <div class="flex flex-col mr-2 lg:mr-10">
        <label for="tom">Escolha o tom</label>
        <select
          name="tom"
          id="tom"
          class="border border-slate-300"
          v-model="objetoCifra.tom"
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
        @click="objetoCifra.cifra.push([])"
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
        @click="print()"
        title="Apagar cifra"
      >
        Imprimir pdf
      </div>
    </div>
    <div
      class="absolute z-10 right-8 -top-10 lg:top-7 w-5 h-10 cursor-pointer text-3xl"
      @click="submenu = !submenu"
    >
      ⏷
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
    </div>
  </div>

  <!--AREA DE EXIBIÇÃO-->

  <div class="flex w-full">
    <div
      id="eraseLeft"
      @dragover.prevent
      @dragenter.prevent
      @drop="eraseChordByDrop()"
      class="w-14 lg:w-40 bg-slate-100 h-screen"
    ></div>
    <div
      id="imprimir"
      class="w-full flex flex-col items-center mt-20 text-md lg:text-3xl font-bold"
    >
      <h1 class="text-3xl mb-5">{{ musicName }}</h1>

      <div
        v-for="(linha, indexLinha) in objetoCifra.cifra"
        :key="indexLinha"
        class="h-14 lg:h-24 flex items-center"
      >
        <div v-for="(acorde, indexAcorde) in linha" :key="indexAcorde">
          <div class="flex items-center duration-100">
            <span
              class="w-1 lg:w-3 h-16 duration-100"
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
              class="px-3 border-2 lg:border-4 border-orange-200 rounded cursor-pointer hover:bg-slate-100 select-none hover:border-red-300 duration-100"
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

            <span
              class="w-1 lg:w-3 h-16 duration-100"
              @dragover.prevent="dragAddBackground"
              @dragleave="dragRemoveBackground"
              @dragenter.prevent
              @drop="addChordBydrop(indexLinha, indexAcorde + 1, $event)"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <div
      id="eraseRight"
      @dragover.prevent
      @dragenter.prevent
      @drop="eraseChordByDrop()"
      class="w-14 lg:w-40 bg-slate-100 h-screen"
    ></div>
  </div>
</template>

<style scoped>
.hover {
  @apply w-6;
}
</style>
