<script setup>
import { jsPDF } from 'jspdf'

function imprimir(cifra) {}

const doc = new jsPDF()

doc.text('Hello world!', 10, 10)
doc.save('a4.pdf')
</script>

<template></template>

<style scoped></style>
