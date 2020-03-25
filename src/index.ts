import { initialState, getRealCoords, State } from './State'
import { draw, initCanvas, makeApi, drawGrid, measureText } from './Canvas'
import { history } from './History'
import { renderToolbar } from './Toolbar'
import { renderMenus } from './Menu'
import { html } from './util'

const state = { ...initialState }
const $canvas = initCanvas()
const ctx = $canvas.getContext('2d')!
let stopped = false

const init = () => {
  document.body.appendChild(
    html('main', {}, [
      renderMenus(state, ctx, history(state)),
      html('div', { className: 'content' }, [
        renderToolbar(state, ctx),
        html('div', { className: 'canvas-container' }, [$canvas]),
      ]),
    ]),
  )
  ;(<HTMLButtonElement>document.querySelector('.tool')).click()

  const offsetX = $canvas.offsetLeft
  const offsetY = $canvas.offsetTop

  console.log(offsetX, offsetY)

  const useToolHandler = (
    key: 'onPointerDown' | 'onPointerUp' | 'onPaint',
    coords: { x: number; y: number },
  ) => {
    const handler = state.tool[key]

    if (handler)
      handler(
        {
          ...getRealCoords(coords.x - offsetX, coords.y - offsetY, state),
          state,
          canvas: makeApi(state),
        },
        state.tool.state,
      )
  }

  const handleMouseDown = (coords: { x: number; y: number }) => {
    state.pressing = true
    useToolHandler('onPointerDown', coords)
    history(state).track()
  }
  const handleMouseUp = (coords: { x: number; y: number }) => {
    state.pressing = false
    useToolHandler('onPointerUp', coords)
    useToolHandler('onPaint', coords)
  }
  const handleMouseMove = (coords: { x: number; y: number }) => {
    if (state.pressing) useToolHandler('onPaint', coords)
  }

  $canvas.addEventListener('mousedown', e => handleMouseDown(e))
  $canvas.addEventListener('mouseup', e => handleMouseUp(e))
  $canvas.addEventListener('mousemove', e => {
    handleMouseMove(e)
    e.stopPropagation()
  })

  const getTouchCoords = (e: TouchEvent) => ({
    x: e.touches[0].pageX,
    y: e.touches[0].pageY,
  })

  $canvas.addEventListener('touchstart', e =>
    handleMouseDown(getTouchCoords(e)),
  )
  $canvas.addEventListener('touchend', e => handleMouseUp(getTouchCoords(e)))
  $canvas.addEventListener('touchmove', e => {
    handleMouseMove(getTouchCoords(e))
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

window.addEventListener('load', () => window.scrollTo(0, 0))
document.addEventListener('DOMContentLoaded', init)
document.addEventListener('touchmove', e => e.preventDefault())
