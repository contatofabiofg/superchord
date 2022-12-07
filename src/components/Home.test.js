//import { render, screen } from '@testing-library/vue'
import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../components/Home.vue'

describe('Home', () => {
  let wrapper
  test('Tamanho da fonte', async () => {
    wrapper = mount(Home)

    expect(wrapper.vm.tamanhoDaFonte('123')).toBe('text-2xl')
    expect(wrapper.vm.tamanhoDaFonte('123456')).toBe('text-md')
  })

  test('Acordes de acordo com o tom em Dó (estado default)', async () => {
    wrapper = mount(Home)
    expect(wrapper.vm.listaDeAcordes()['III']).toBe('E')
    expect(wrapper.vm.listaDeAcordes()['V']).toBe('G')
  })

  test('Acordes de acordo com o tom em G', async () => {
    wrapper = mount(Home)
    wrapper.vm.tune = 'G'
    expect(wrapper.vm.listaDeAcordes()['III']).toBe('B')
    expect(wrapper.vm.listaDeAcordes()['V']).toBe('D')
    wrapper.vm.tune = 'C'
  })

  test('Toogle Create or Update Chord', async () => {
    wrapper = mount(Home)
    wrapper.vm.idChord = null
    expect(wrapper.vm.saveOnline()['III']).toBe('B')
  })
})
