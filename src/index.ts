import { Pencil } from './ToolbarOption/Pencil'
import { ToolbarOption } from './ToolbarOption'
import { initialState } from './State'
import { draw, initCanvas, makeApi } from './Canvas'
import { Fill } from './ToolbarOption/Fill'
import { Eraser } from './ToolbarOption/Eraser'
import { Brush } from './ToolbarOption/Brush'
import { history } from './History'
import { Line } from './ToolbarOption/Line'

const $canvas = initCanvas()

const ctx = $canvas.getContext('2d')!
const state = { ...initialState }
let stopped = false

const options = {
  [Pencil.name]: Pencil,
  [Fill.name]: Fill,
  [Eraser.name]: Eraser,
  [Brush.name]: Brush,
  [Line.name]: Line,
}

const measureText = (() => {
  const memo: { [key: string]: TextMetrics } = {}

  return (char: string) =>
    char in memo ? memo[char] : (memo[char] = ctx.measureText(char))
})()

const registerToolbarOption = (
  $toolbar: HTMLElement,
  option: ToolbarOption,
) => {
  const $toolOption = option.render(state, ctx)

  $toolbar.appendChild($toolOption)
  $toolOption.addEventListener('click', () => {
    if (option.type === 'tool') {
      state.selectedTool = option.name
    }
  })
}

const exportAsImg = () => {
  const element = document.createElement('a')
  element.setAttribute('href', $canvas.toDataURL('image/png'))
  element.setAttribute('download', 'untitled.png')

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const initToolbar = () => {
  const $toolbar = document.createElement('section')

  $toolbar.className = 'toolbar'

  Object.values(options).forEach(option =>
    registerToolbarOption($toolbar, option),
  )

  document.body.appendChild($toolbar)
}

const withToolHandler = (
  key: 'onMouseUp' | 'onMouseDown' | 'onMouseMove' | 'onClick',
) => (e: MouseEvent) => {
  const tool = options[state.selectedTool]
  const handler = tool[key]

  if (handler)
    handler(e, { state, canvas: makeApi(state), history: history(state) })
}

const init = () => {
  initToolbar()

  $canvas.addEventListener('mousedown', e => {
    withToolHandler('onMouseDown')(e)
    history(state).track()
  })
  $canvas.addEventListener('mouseup', withToolHandler('onMouseUp'))
  $canvas.addEventListener('mousemove', withToolHandler('onMouseMove'))
  $canvas.addEventListener('click', withToolHandler('onClick'))
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
document.querySelector('#export')?.addEventListener('click', exportAsImg)

document.addEventListener('DOMContentLoaded', init)
