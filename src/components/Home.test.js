//import { render, screen } from '@testing-library/vue'
import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../components/Home.vue'
import firebase from '../firebase'

describe('Home', () => {
  let wrapper
  let wrapper2

  test("The font size should adapt according to the string's length.", async () => {
    wrapper = mount(Home)

    expect(wrapper.vm.tamanhoDaFonte('123')).toBe('text-2xl')
    expect(wrapper.vm.tamanhoDaFonte('123456')).toBe('text-md')
  })

  test.each([
    { tune: 'C', grade: 'III', expected: 'E' },
    { tune: 'C', grade: 'V', expected: 'G' },
    { tune: 'G', grade: 'IV', expected: 'C' },
    { tune: 'G', grade: 'VII', expected: 'F#' },
  ])(
    'Given the tune and the grade, the chord must be correct.',
    async ({ tune, grade, expected }) => {
      wrapper = mount(Home)
      wrapper.vm.tune = tune
      expect(wrapper.vm.listaDeAcordes()[grade]).toBe(expected)
      //wrapper.vm.tune = 'C'
    }
  )

  test('Toogle', async () => {
    wrapper = mount(Home)

    const spy = vi.spyOn(wrapper.vm, 'saveOnline')

    spy()
    console.log(wrapper)
    expect(wrapper.vm.status).toBe('created')
    //expect(spy2).toHaveBeenCalled()
    wrapper.vm.idChord = 123
    spy()
    expect(wrapper.vm.status).toBe('updated')
  })
})
