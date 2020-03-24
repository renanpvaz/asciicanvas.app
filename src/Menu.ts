import { html, htmlRaw } from './util'
import { State } from './State'
import { drawGrid, measureText, key } from './Canvas'
import { HistoryApi } from './History'

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

const exportAsText = (state: State) => {
  let text = ''

  for (let y = 0; y < 400; y++) {
    for (let x = 0; x < 600; x++) {
      const cell = state.canvas[key(x, y)]
      text += cell?.value || ' '
    }
    text += '\n'
  }

  console.log(text)

  var element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  )
  element.setAttribute('download', 'untitled.txt')

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const renderMenus = (
  state: State,
  ctx: CanvasRenderingContext2D,
  history: HistoryApi,
) =>
  html('header', { className: 'menu' }, [
    html('button', { className: 'menu-button menu-container' }, [
      'file',
      html('ul', { className: 'menu-list' }, [
        html('li', { className: 'menu-item' }, [
          html('span', {}, ['New']),
          html('small', {}, ['Cmd+Z']),
        ]),
        html('li', { className: 'menu-item menu-container' }, [
          html('span', {}, ['Export']),
          html('small', {}, [
            htmlRaw(`
              <svg width="10" height="11" viewBox="0 0 10 11" style="fill:white;display:inline-block;vertical-align:middle">
                <path d="M7.5 4.33L0 8.66L0 0z"></path>
              </svg>
            `),
          ]),
          html('ul', { className: 'menu-list menu-list--right' }, [
            html('li', { className: 'menu-item' }, [
              html('span', { onclick: () => exportAsText(state) }, [
                'Text (.txt)',
              ]),
            ]),
            html('li', { className: 'menu-item' }, [
              html('span', { onclick: exportAsImg }, ['Image (.png)']),
            ]),
          ]),
        ]),
      ]),
    ]),
    html('button', { className: 'menu-button menu-container' }, [
      'edit',
      html('ul', { className: 'menu-list' }, [
        html('li', { className: 'menu-item', onclick: () => history.back() }, [
          html('span', {}, ['Undo']),
          html('small', {}, ['Cmd+Z']),
        ]),
        html(
          'li',
          { className: 'menu-item', onclick: () => history.forward() },
          [html('span', {}, ['Redo']), html('small', {}, ['Cmd+Shift+Z'])],
        ),
      ]),
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
