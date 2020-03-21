import { State, getRealCoords } from './State'
import { Cell } from './Cell'

export type Canvas = {
  get: (x: number, y: number) => Cell | undefined
  set: (x: number, y: number, char?: string) => void
  setAll: (cells: Cell[], char?: string) => void
  setPreview: (x: number, y: number) => void
  clearPreview: () => void
  applyPreview: () => void
}

const initCanvas = (state: State) => {
  const $canvas = document.createElement('canvas')
  const ctx = $canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1

  $canvas.width = 600
  $canvas.height = 400
  ctx.scale(dpr, dpr)
  ctx.font = '14px monospace'

  return $canvas
}

export const measureText = (fontSize: number) => {
  const context = document.createElement('canvas').getContext('2d')!

  context.font = `${fontSize}px monospace`

  const metrics = context.measureText('$')

  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent * 1.5,
  }
}

export const neighbors = ({ x, y }: Cell, state: State): Cell[] => [
  <Cell>{ x: x + state.cellWidth, y },
  <Cell>{ x: x - state.cellWidth, y },
  <Cell>{ x, y: y + state.cellHeight },
  <Cell>{ x, y: y - state.cellHeight },
]

export const getNNeighbors = (n: number, center: Cell, state: State) => {
  if (n === 1) return [center]
  if (n === 2) return [center, ...neighbors(center, state)]

  const cells = []
  const { sin, acos } = Math
  const radius = n * state.cellWidth

  for (let x = center.x - radius; x < center.x + radius; x += state.cellWidth) {
    const yspan = getRealCoords(
      0,
      radius * sin(acos((center.x - x) / radius)),
      state,
    ).y
    for (
      let y = center.y - yspan;
      y < center.y + yspan;
      y += state.cellHeight
    ) {
      cells.push(<Cell>getRealCoords(x, y, state))
    }
  }

  return cells
}

const isOutOfBounds = ({ x, y }: Cell): boolean =>
  x > window.innerWidth || x < 0 || y > window.innerHeight || y < 0

const key = (x: number, y: number) => `${x},${y}`

const makeApi = (state: State): Canvas => {
  const getWithDefault = (x: number, y: number): Cell =>
    state.canvas[key(x, y)] || { x, y }

  const get: Canvas['get'] = (x, y) =>
    isOutOfBounds({ x, y, value: null, color: null })
      ? undefined
      : getWithDefault(x, y)

  const set = (x: number, y: number, char: string = state.char) => {
    const prevCell = get(x, y)
    const equal =
      prevCell && prevCell.value === char && prevCell.color === state.color

    if (!equal) {
      const k = key(x, y)
      state.canvas[k] = { value: char, color: state.color, x, y }
      state.dirtyCells.push(k)
    }
  }

  const setAll = (cells: Cell[], char?: string) =>
    cells.forEach(c => set(c.x, c.y, char))

  const setPreview = (x: number, y: number) => {
    const k = key(x, y)

    state.preview[k] = {
      value: state.char,
      color: state.color,
      x,
      y,
    }
  }

  const clearPreview = () => {
    const cells = state.preview

    for (const k in cells) {
      const prevCell = get(cells[k].x, cells[k].y)
      cells[k] = prevCell!
    }
  }

  const applyPreview = () => {
    const cells = state.preview

    for (const k in cells) {
      const cell = cells[k]
      if (cell.value) state.canvas[k] = cell
    }

    state.preview = {}
  }

  return {
    get,
    set,
    setPreview,
    clearPreview,
    applyPreview,
    setAll,
  }
}

const drawGrid = (state: State, targetCtx: CanvasRenderingContext2D) => {
  const $gridCanvas = document.createElement('canvas')
  const ctx = $gridCanvas.getContext('2d')!

  $gridCanvas.width = 600
  $gridCanvas.height = 400
  ctx.strokeStyle = '#7b7b7b'
  ctx.lineWidth = 0.5

  for (let x = 0; x < 600; x += state.cellWidth) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 400)
    ctx.stroke()
  }
  for (let y = 0; y < 400; y += state.cellHeight) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(600, y)
    ctx.stroke()
  }

  targetCtx.canvas.style.backgroundImage = `url('${$gridCanvas.toDataURL()}')`
}

const draw = (state: State, context: CanvasRenderingContext2D) => {
  context.textBaseline = 'top'
  context.font = `${state.fontSize}px monospace`

  const drawCell = (cell: Cell) => {
    if (!cell.value) return
    context.fillStyle = cell.color
    context.fillText(cell.value, cell.x, cell.y)
  }

  if (state.history.updated) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    for (const key in state.canvas) {
      const cell = state.canvas[key]
      drawCell(cell)
    }
    return
  }

  for (const key in state.preview) {
    const cell = state.preview[key]
    context.clearRect(cell.x, cell.y, state.cellWidth, state.cellHeight)
    drawCell(cell)
  }

  for (const key of state.dirtyCells) {
    const cell = state.canvas[key]
    context.clearRect(cell.x, cell.y, state.cellWidth, state.cellHeight)
    drawCell(cell)
  }

  state.dirtyCells = []
}

export { initCanvas, makeApi, draw, drawGrid, key }
