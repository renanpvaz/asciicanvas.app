import { initialState, getRealCoords } from './State'
import { draw, initCanvas, makeApi, drawGrid, measureText } from './Canvas'
import { history } from './History'
import { renderToolbar } from './Toolbar'
import { renderMenus } from './Menu'
import { Effect, CreateSelection } from './Effect'
import { html, isMobile } from './util'

const state = initialState

const put = (eff: Effect) => {
  if (state.state === 'ready') eff({ state, canvas: makeApi(state) })
}

const $canvas = initCanvas({ state, put })

const init = () => {
  if (state.state !== 'ready') return

  document.body.appendChild(
    html('main', {}, [
      renderMenus({ state, history: history(state), put }),
      html('div', { className: 'content' }, [
        renderToolbar({ state, put }),
        html('div', { className: 'canvas-container' }, [$canvas]),
        isMobile()
          ? html('div', { className: 'size-handle-wrapper' }, [
              html('input', {
                className: 'size-handle',
                value: '1',
                type: 'range',
                max: '10',
                min: '1',
                step: '1',
                onchange: e =>
                  (state.size = +(<HTMLInputElement>e.target).value),
              }),
            ])
          : '',
      ]),
    ]),
  )
  ;(<HTMLButtonElement>document.querySelector('.tool')).click()

  document.addEventListener('keydown', e => {
    if (e.key === 'z' && e.metaKey) e.preventDefault()

    state.keys[e.key] = true
  })
  document.addEventListener('keyup', e => {
    state.keys[e.key] = false
  })

  const { width, height } = measureText(state.fontSize)

  state.cellWidth = width
  state.cellHeight = height

  drawGrid(state)
  loop()
}

const shortcuts: [string, () => void][] = [
  ['Meta+Shift+z', () => history(state).forward()],
  ['Meta+z', () => history(state).back()],
]

const modifierKeys = ['Shift', 'Meta', 'Ctrl']

const loop = () => {
  if (state.state !== 'ready') return

  const shortcut = shortcuts.find(([keys]) =>
    keys.split('+').every(key => state.keys[key]),
  )

  if (shortcut) {
    shortcut[1]()
    state.keys = modifierKeys.reduce(
      (acc, key) => ({ ...acc, [key]: state.keys[key] }),
      {},
    )
  }

  draw(state)
  requestAnimationFrame(loop)
}

document.addEventListener('DOMContentLoaded', init)
document.addEventListener('paste', event => {
  const $prev = document.querySelector('#text-edit')

  if ($prev) $prev.remove()

  let paste = (event.clipboardData || window.clipboardData)!.getData('text')

  put(
    CreateSelection({
      x: 0,
      y: 0,
      text: paste,
      editable: false,
      draggable: true,
    }),
  )

  event.preventDefault()
})
