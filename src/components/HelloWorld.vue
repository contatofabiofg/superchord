<script setup>
import { ref } from 'vue'

const objetoCifra = ref({
  tom: 'C',
  cifra: [[]],
})
const chordToDrop = ref('')
const chordToErase = ref(null)

function dragAddBackground(e) {
  e.currentTarget.classList.add('hover')
}
function dragRemoveBackground(e) {
  e.currentTarget.classList.remove('hover')
}

function addChord(gradevalue, variationValue) {
  objetoCifra.value.cifra[objetoCifra.value.cifra.length - 1].push({
    grade: gradevalue,
    variation: variationValue,
    /* 
    indexLine: objetoCifra.value.cifra.length - 1,
    indexPosition:
      objetoCifra.value.cifra[objetoCifra.value.cifra.length - 1].length,
      */
  })
}

function changeChordBydrop(line, position) {
  objetoCifra.value.cifra[line][position] = {
    grade: chordToDrop.value.grade,
    variation: chordToDrop.value.variation,
  }
}
function addChordBydrop(line, position, e) {
  e.target.classList.remove('hover')
  objetoCifra.value.cifra[line].splice(position, 0, {
    grade: chordToDrop.value.grade,
    variation: chordToDrop.value.variation,
  })
}

function eraseChordByDrop() {
  objetoCifra.value.cifra[chordToErase.value.indexLinha].splice(
    chordToErase.value.indexAcorde,
    1
  )
}

function mutateChord(line, position) {
  let valueOfVariation = objetoCifra.value.cifra[line][position].variation
  let valueofGrade = objetoCifra.value.cifra[line][position].grade

  switch (valueOfVariation) {
    case null:
      objetoCifra.value.cifra[line][position] = {
        grade: valueofGrade,
        variation: 'm',
      }
      break
    case 'm':
      objetoCifra.value.cifra[line][position] = {
        grade: valueofGrade,
        variation: 'm7',
      }
      break
    case 'm7':
      objetoCifra.value.cifra[line][position] = {
        grade: valueofGrade,
        variation: 'm79',
      }
      break
    case 'm79':
      objetoCifra.value.cifra[line][position] = {
        grade: valueofGrade,
        variation: '7',
      }
      break
    case '7':
      objetoCifra.value.cifra[line][position] = {
        grade: valueofGrade,
        variation: '7M',
      }
      break
    case '7M':
      objetoCifra.value.cifra[line][position] = {
        grade: valueofGrade,
        variation: '7M9',
      }
      break
    case '7M9':
      objetoCifra.value.cifra[line][position] = {
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
      }
      break
  }
  return obj
}
</script>

<template>
  <div class="mt-5 w-full flex justify-center">
    <div class="flex text-xl">
      <div class="flex flex-col mr-10">
        <label for="tom">Escolha o tom</label>
        <select name="tom" id="tom" v-model="objetoCifra.tom">
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
          class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 m-2 select-none"
          @click="addChord(item.grade, item.variation)"
        >
          <span
            >{{ listaDeAcordes()[item.grade]
            }}<span>{{ item.variation }}</span></span
          >
        </div>
      </div>

      <div
        class="p-3 border border-slate-300 rounded cursor-pointer hover:bg-slate-100 m-2 select-none"
        @click="objetoCifra.cifra.push([])"
      >
        ↲
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
      class="w-40 bg-slate-100 h-screen"
    ></div>
    <div class="w-full flex flex-col items-center mt-20 text-3xl font-bold">
      <div
        v-for="(linha, indexLinha) in objetoCifra.cifra"
        :key="indexLinha"
        class="h-24 flex items-center"
      >
        <div v-for="(acorde, indexAcorde) in linha" :key="indexAcorde">
          <div class="flex items-center duration-100">
            <span
              class="w-3 h-16 duration-100"
              @dragover.prevent="dragAddBackground"
              @dragleave="dragRemoveBackground"
              @dragenter.prevent
              @drop="addChordBydrop(indexLinha, indexAcorde, $event)"
            ></span>
            <span
              draggable="true"
              @dragstart="chordToErase = { indexLinha, indexAcorde }"
              class="p-3 border-4 border-orange-200 rounded cursor-pointer hover:bg-slate-100 select-none hover:border-red-300 duration-100"
              @dragover.prevent
              @drop="changeChordBydrop(indexLinha, indexAcorde)"
              @click="mutateChord(indexLinha, indexAcorde)"
            >
              <span
                >{{ listaDeAcordes()[acorde.grade]
                }}<span>{{ acorde.variation }}</span></span
              >
            </span>

            <span
              class="w-3 h-16 duration-100"
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
      class="w-40 bg-slate-100 h-screen"
    ></div>
  </div>
</template>

<style scoped>
.hover {
  @apply w-6;
}
</style>
