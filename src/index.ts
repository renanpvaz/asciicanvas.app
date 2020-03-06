import { Pencil } from './ToolbarOption/Pencil'
import { ToolbarOption } from './ToolbarOption'
import { ColorPicker } from './ToolbarOption/ColorPicker'
import { Export } from './ToolbarOption/Export'
import { initialState } from './State'
import { draw, initCanvas, makeApi } from './Canvas'

const $canvas = initCanvas()

const ctx = $canvas.getContext('2d')!
const state = { ...initialState }

const options = {
  [Pencil.name]: Pencil,
  [ColorPicker.name]: ColorPicker,
  [Export.name]: Export,
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

const withToolHandler = (key: 'onMouseUp' | 'onMouseDown' | 'onMouseMove') => (
  e: MouseEvent,
) => {
  const tool = options[state.selectedTool]
  const handler = tool[key]

  handler && handler(e, { state, canvas: makeApi(state) })
}

const init = () => {
  initToolbar()

  $canvas.addEventListener('mousedown', withToolHandler('onMouseDown'))
  $canvas.addEventListener('mouseup', withToolHandler('onMouseUp'))
  $canvas.addEventListener('mousemove', withToolHandler('onMouseMove'))

  const metrics = measureText(state.char)

  state.cellWidth = metrics.width
  state.cellHeight = metrics.actualBoundingBoxAscent

  loop()
}

const loop = () => {
  draw(state, ctx)
  requestAnimationFrame(loop)
}

document
  .querySelector('#btn')
  ?.addEventListener('click', () => draw(state, ctx))
document.addEventListener('DOMContentLoaded', init)
