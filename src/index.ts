import { initialState, getRealCoords } from './State'
import { draw, initCanvas, makeApi } from './Canvas'
import { history } from './History'
import { renderToolbar } from './Toolbar'

const $canvas = initCanvas()

const ctx = $canvas.getContext('2d')!
const state = { ...initialState }
let stopped = false

const measureText = (() => {
  const memo: { [key: string]: TextMetrics } = {}

  return (char: string) =>
    char in memo ? memo[char] : (memo[char] = ctx.measureText(char))
})()

const exportAsImg = () => {
  const element = document.createElement('a')
  element.setAttribute('href', $canvas.toDataURL('image/png'))
  element.setAttribute('download', 'untitled.png')

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const useToolHandler = (
  key: 'onPointerDown' | 'onPointerUp' | 'onPaint',
  e: MouseEvent,
) => {
  const handler = state.tool[key]

  if (handler)
    handler(
      {
        ...getRealCoords(e.x, e.y, state),
        state,
        canvas: makeApi(state),
      },
      state.tool.state,
    )
}

const init = () => {
  document.body.appendChild(renderToolbar(state))

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

  const metrics = measureText(state.char)

  state.cellWidth = metrics.width
  state.cellHeight = metrics.actualBoundingBoxAscent * 1.5

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

document
  .querySelector('#stop')
  ?.addEventListener('click', () => (stopped = true))
document
  .querySelector('#start')
  ?.addEventListener('click', () => (stopped = false))
document.querySelector('#loop')?.addEventListener('click', loop)
document.querySelector('#color')?.addEventListener('change', e => {
  state.color = (<HTMLInputElement>e.target).value
})
document.querySelector('#char')?.addEventListener('change', e => {
  state.char = (<HTMLInputElement>e.target).value
})
document.querySelector('#export')?.addEventListener('click', exportAsImg)

document.addEventListener('DOMContentLoaded', init)
