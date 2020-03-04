type Cell = { value: string; color: string }
type State = {
  drawing: boolean
  canvas: Map<string, Cell>
  cellWidth: number
  cellHeight: number
  char: string
}

const $canvas = document.createElement('canvas')
const ctx = $canvas.getContext('2d')!
const state: State = {
  drawing: false,
  canvas: new Map(),
  cellHeight: 0,
  cellWidth: 0,
  char: '$',
}

const measureText = (() => {
  const memo: { [key: string]: TextMetrics } = {}

  return (char: string) =>
    char in memo ? memo[char] : (memo[char] = ctx.measureText(char))
})()

const coords = (event: MouseEvent) => ({
  x: event.pageX - $canvas.offsetLeft,
  y: event.pageY - $canvas.offsetTop,
})

const startDrawing = () => {
  state.drawing = true
}
const stopDrawing = () => {
  state.drawing = false
}
const handleDrawing = (e: MouseEvent) => {
  if (!state.drawing) return
  const { x, y } = coords(e)
  const realX = Math.round(x / state.cellWidth)
  const realY = Math.round(y / state.cellHeight)
  const key = `${realX}.${realY}`

  if (state.canvas.has(key)) return

  ctx.fillStyle = 'red'
  ctx.fillText(state.char, realX * state.cellWidth, realY * state.cellHeight)
  state.canvas.set(key, { value: state.char, color: 'red' })
}

const init = () => {
  $canvas.width = 500
  $canvas.height = 500
  $canvas.style.border = '1px solid'

  $canvas.addEventListener('mousedown', startDrawing)
  $canvas.addEventListener('mouseup', stopDrawing)
  $canvas.addEventListener('mousemove', handleDrawing)

  const metrics = measureText(state.char)
  state.cellWidth = metrics.width
  state.cellHeight = metrics.actualBoundingBoxAscent

  document.body.append($canvas)
}

document.addEventListener('DOMContentLoaded', init)
