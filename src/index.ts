import { initialState, getRealCoords, State } from './State'
import { draw, initCanvas, makeApi, drawGrid, measureText } from './Canvas'
import { history } from './History'
import { renderToolbar } from './Toolbar'
import { renderMenus } from './Menu'
import { html } from './util'

const state = { ...initialState }
const $canvas = initCanvas(state)
const ctx = $canvas.getContext('2d')!
let stopped = false

const useToolHandler = (
  key: 'onPointerDown' | 'onPointerUp' | 'onPaint',
  e: MouseEvent,
) => {
  const handler = state.tool[key]

  if (handler)
    handler(
      {
        ...getRealCoords(e.x - 32, e.y - 32, state),
        state,
        canvas: makeApi(state),
      },
      state.tool.state,
    )
}

const init = () => {
  document.body.appendChild(
    html('main', {}, [
      renderMenus(state, ctx),
      html('div', { className: 'content' }, [
        renderToolbar(state, ctx),
        html('div', { className: 'canvas-container' }, [$canvas]),
      ]),
    ]),
  )

  $canvas.addEventListener('mousedown', e => {
    state.pressing = true
    useToolHandler('onPointerDown', e)
    history(state).track()
  })
  $canvas.addEventListener('mouseup', e => {
    state.pressing = false
    useToolHandler('onPointerUp', e)
    useToolHandler('onPaint', e)
  })
  $canvas.addEventListener('mousemove', e => {
    if (state.pressing) useToolHandler('onPaint', e)
  })
  document.addEventListener('keydown', e => {
    state.keys[e.key] = true
  })
  document.addEventListener('keyup', e => {
    state.keys[e.key] = false
  })

  const { width, height } = measureText(14)
  state.cellWidth = width
  state.cellHeight = height

  drawGrid(state, ctx)
  loop()
}

const shortcuts: [string, () => void][] = [
  ['Meta+Shift+z', () => history(state).forward()],
  ['Meta+z', () => history(state).back()],
]

const modifierKeys = ['Shift', 'Meta', 'Ctrl']

const loop = () => {
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

  draw(state, ctx)
  if (!stopped) requestAnimationFrame(loop)
}

document.addEventListener('DOMContentLoaded', init)
