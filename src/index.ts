import { Pencil } from './ToolbarOption/Pencil'
import { ToolbarOption } from './ToolbarOption'

export type Cell = { value: string; color: string }
export type Tool = typeof Pencil.name
export type State = {
  drawing: boolean
  canvas: Map<string, Cell>
  cellWidth: number
  cellHeight: number
  char: string
  color: string
  selectedTool: Tool
}

const $canvas: HTMLCanvasElement = document.createElement('canvas')

const ctx = $canvas.getContext('2d')!
const state: State = {
  drawing: false,
  canvas: new Map(),
  cellHeight: 0,
  cellWidth: 0,
  char: '$',
  color: 'black',
  selectedTool: 'pencil',
}

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

const options = {
  [Pencil.name]: Pencil,
}

const registerToolbarOption = (
  $toolbar: HTMLElement,
  option: ToolbarOption,
) => {
  const $toolOption = option.renderToolBarOption(state)

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

  handler && handler(e, { state, context: ctx })
}

const init = () => {
  initToolbar()

  const dpr = window.devicePixelRatio || 1

  $canvas.width = window.innerWidth * dpr
  $canvas.height = window.innerHeight * dpr
  ctx.scale(dpr, dpr)

  $canvas.addEventListener('mousedown', withToolHandler('onMouseDown'))
  $canvas.addEventListener('mouseup', withToolHandler('onMouseUp'))
  $canvas.addEventListener('mousemove', withToolHandler('onMouseMove'))

  const metrics = measureText(state.char)
  state.cellWidth = metrics.width
  state.cellHeight = metrics.actualBoundingBoxAscent

  console.log(metrics.width, metrics.actualBoundingBoxAscent)

  document.body.append($canvas)

  document.querySelector('#export')?.addEventListener('click', exportAsImg)
}

document.addEventListener('DOMContentLoaded', init)
