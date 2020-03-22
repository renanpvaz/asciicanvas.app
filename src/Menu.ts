import { html } from './util'
import { State } from './State'
import { drawGrid, measureText } from './Canvas'

const exportAsImg = () => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    document.querySelector('canvas')!.toDataURL('image/png'),
  )
  element.setAttribute('download', 'untitled.png')

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const renderMenus = (state: State, ctx: CanvasRenderingContext2D) =>
  html('header', { className: 'menu' }, [
    html('button', { className: 'menu-button', onclick: exportAsImg }, [
      'export',
    ]),
    html('input', {
      className: 'menu-button char-input',
      value: '14',
      onchange: e => {
        const fontSize = +(<HTMLInputElement>e.target).value
        const { width, height } = measureText(fontSize)

        state.fontSize = fontSize
        state.cellWidth = width
        state.cellHeight = height
        state.history.updated = true

        drawGrid(state, ctx)
      },
    }),
    html('input', {
      className: 'menu-button char-input',
      maxLength: 1,
      value: '$',
      onchange: e => (state.char = (<HTMLInputElement>e.target).value),
    }),
    html('input', {
      className: 'menu-button color-picker',
      type: 'color',
      value: '#d238a8',
      onchange: e => (state.color = (<HTMLInputElement>e.target).value),
    }),
  ])

export { renderMenus }
