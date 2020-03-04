type Cell = { value: string; color: string }
type State = {
  drawing: boolean
  canvas: Map<string, Cell>
  cellWidth: number
  cellHeight: number
  char: string
  color: string
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

const setupCanvas = () => {
  return ctx
}

const startDrawing = () => {
  state.drawing = true
}
const stopDrawing = () => {
  state.drawing = false
}
const handleDrawing = (e: MouseEvent) => {
  if (!state.drawing) return

  const mousePos = coords(e)
  const realX = Math.round(mousePos.x / state.cellWidth)
  const realY = Math.round(mousePos.y / state.cellHeight)
  const x = realX * state.cellWidth
  const y = realY * state.cellHeight
  const key = `${realX}.${realY}`

  ctx.clearRect(
    x,
    (realY - 1) * state.cellHeight,
    state.cellWidth,
    state.cellHeight,
  )
  ctx.fillStyle = state.color
  ctx.fillText(state.char, x, y)
  state.canvas.set(key, { value: state.char, color: state.color })
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

const init = () => {
  const dpr = window.devicePixelRatio || 1

  $canvas.width = window.innerWidth * dpr
  $canvas.height = window.innerHeight * dpr
  ctx.scale(dpr, dpr)

  $canvas.addEventListener('mousedown', startDrawing)
  $canvas.addEventListener('mouseup', stopDrawing)
  $canvas.addEventListener('mousemove', handleDrawing)

  const metrics = measureText(state.char)
  state.cellWidth = metrics.width
  state.cellHeight = metrics.actualBoundingBoxAscent

  document.body.append($canvas)

  document.querySelector('#export')?.addEventListener('click', exportAsImg)
  document
    .querySelector<HTMLInputElement>('#char')
    ?.addEventListener(
      'input',
      e => (state.char = (<HTMLInputElement>e.target).value),
    )
  document
    .querySelector<HTMLInputElement>('#color')
    ?.addEventListener(
      'input',
      e => (state.color = (<HTMLInputElement>e.target).value),
    )
}

document.addEventListener('DOMContentLoaded', init)
