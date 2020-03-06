import { Pencil } from './ToolbarOption/Pencil'
import { ToolbarOption } from './ToolbarOption'
import { ColorPicker } from './ToolbarOption/ColorPicker'
import { Export } from './ToolbarOption/Export'
import { initialState } from './State'
import { draw, initCanvas, makeApi } from './Canvas'
import { Fill } from './ToolbarOption/Fill'
import { Eraser } from './ToolbarOption/Eraser'
import { Brush } from './ToolbarOption/Brush'
import { history } from './History'

const $canvas = initCanvas()

const ctx = $canvas.getContext('2d')!
const state = { ...initialState }
let stopped = false

const options = {
  [Pencil.name]: Pencil,
  [ColorPicker.name]: ColorPicker,
  [Export.name]: Export,
  [Fill.name]: Fill,
  [Eraser.name]: Eraser,
  [Brush.name]: Brush,
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

  handler &&
    handler(e, { state, canvas: makeApi(state), history: history(state) })
}

const init = () => {
  initToolbar()

  $canvas.addEventListener('mousedown', withToolHandler('onMouseDown'))
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
  state.cellHeight = metrics.actualBoundingBoxAscent

  loop()
}

const loop = () => {
  let historyChange = false

  if (state.keys['Meta'] && state.keys['z']) {
    history(state).back()
    historyChange = true
    state.keys = {}
  } else if (state.keys['Meta'] && state.keys['y'] && state.keys['Shift']) {
    history(state).forward()
    historyChange = true
    state.keys = {}
  }

  draw(state, ctx, historyChange)
  if (!stopped) requestAnimationFrame(loop)
}

document
  .querySelector('#stop')
  ?.addEventListener('click', () => (stopped = true))
document
  .querySelector('#start')
  ?.addEventListener('click', () => (stopped = false))
document.querySelector('#loop')?.addEventListener('click', loop)

document.addEventListener('DOMContentLoaded', init)
