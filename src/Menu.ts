import { html, htmlRaw } from './util'
import { State } from './State'
import { drawGrid, measureText, key, initCanvas } from './Canvas'
import { HistoryApi } from './History'

const canvasToString = (state: State) => {
  let text = ''

  for (let y = 0; y < state.height; y++) {
    for (let x = 0; x < state.width; x++) {
      const cell = state.canvas[key(x, y)]
      text += cell?.value || ' '
    }
    text += '\n'
  }

  return text
}

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
  var element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' +
      encodeURIComponent(canvasToString(state)),
  )
  element.setAttribute('download', 'untitled.txt')

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const copyContents = (state: State) => {
  var textArea = document.createElement('textarea')
  textArea.value = canvasToString(state)

  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (err) {}

  document.body.removeChild(textArea)
}

const renderCharInputOption = (option: string, state: State) =>
  html(
    'li',
    {
      className: 'menu-item char-input__option',
      onclick: () => {
        state.char = option
        ;(<HTMLInputElement>(
          document.querySelector('.char-input')
        )).value = option
        document.body.click()
      },
    },
    [html('span', {}, [option])],
  )

const newCanvas = ({
  state,
  ctx,
}: {
  state: State
  ctx: CanvasRenderingContext2D
}) => {
  let width: number, height: number
  const $el = html('div', { className: 'box dialog' }, [
    html(
      'form',
      {
        onsubmit: (e: Event) => {
          e.preventDefault()
          state.width = width * state.cellWidth + 1
          state.height = height * state.cellHeight + 1
          state.canvas = {}
          state.dirtyCells = []
          state.history.updated = true

          const newCanvas = initCanvas(state)

          document.querySelector('canvas')?.replaceWith(newCanvas)
          drawGrid(state, newCanvas.getContext('2d')!)
          document.body.removeChild($el)
        },
      },
      [
        html('div', { className: 'dialog__content' }, [
          html('label', { className: 'field' }, [
            'Row size',
            html('input', {
              className: 'input',
              onchange: e => (width = +(<HTMLInputElement>e.target).value),
            }),
          ]),
          html('label', { className: 'field' }, [
            'Column size',
            html('input', {
              className: 'input',
              onchange: e => (height = +(<HTMLInputElement>e.target).value),
            }),
          ]),
        ]),
        html('button', { className: 'button', type: 'submit' }, ['start']),
      ],
    ),
  ])

  document.body.appendChild($el)
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
        html(
          'li',
          {
            className: 'menu-item',
            onclick: () => newCanvas({ state, ctx }),
          },
          [html('span', {}, ['New']), html('small', {}, ['Cmd+N'])],
        ),
        html(
          'li',
          {
            className: 'menu-item',
            onclick: () => {
              if (navigator.share)
                navigator.share({
                  title: 'My awesome post!',
                  text:
                    'This post may or may not contain the answer to the universe',
                  url: window.location.href,
                })
            },
          },
          [html('span', {}, ['Share'])],
        ),
        html(
          'li',
          {
            className: 'menu-item',
            onclick: () => copyContents(state),
          },
          [html('span', {}, ['Copy'])],
        ),
        html('li', { className: 'menu-item menu-container' }, [
          html('span', {}, ['Export']),
          html('small', {}, [
            htmlRaw(`
              <svg width="10" height="11" viewBox="0 0 10 11" style="display:inline-block;vertical-align:middle">
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
    // html('input', {
    //   className: 'menu-button char-input',
    //   value: '14',
    //   onchange: e => {
    //     const fontSize = +(<HTMLInputElement>e.target).value
    //     const { width, height } = measureText(fontSize)

    //     state.fontSize = fontSize
    //     state.cellWidth = width
    //     state.cellHeight = height
    //     state.history.updated = true

    //     drawGrid(state, ctx)
    //   },
    // }),
    html('button', { className: 'menu-container char-input-container' }, [
      html('input', {
        className: 'menu-button char-input',
        maxLength: 1,
        value: '$',
        onchange: e => (state.char = (<HTMLInputElement>e.target).value),
      }),
      html('ul', { className: 'menu-list' }, [
        ...['$', '@', '/', ';', '(', ')'].map(c =>
          renderCharInputOption(c, state),
        ),
      ]),
    ]),
    html('input', {
      className: 'menu-button color-picker',
      type: 'color',
      value: '#d238a8',
      onchange: e => (state.color = (<HTMLInputElement>e.target).value),
    }),
  ])

export { renderMenus }
