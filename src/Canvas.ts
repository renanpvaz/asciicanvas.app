import { State } from './State'
import { Cell } from './Cell'

export type Canvas = {
  get: (x: number, y: number) => Cell | undefined
  set: (x: number, y: number, char?: string) => void
  setAll: (cells: Cell[], char?: string) => void
  setPreview: (x: number, y: number, char?: string) => void
  clearPreview: () => void
  applyPreview: () => void
}

const createCanvas = (width: number, height: number) => {
  const $canvas = document.createElement('canvas')
  const ctx = $canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1

  $canvas.width = width * dpr
  $canvas.height = height * dpr
  $canvas.style.width = `${width}px`
  $canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)

  return $canvas
}

const initCanvas = () => {
  const $canvas = createCanvas(600, 400)
  const ctx = $canvas.getContext('2d')!

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
  <Cell>{ x: x + 1, y },
  <Cell>{ x: x - 1, y },
  <Cell>{ x, y: y + 1 },
  <Cell>{ x, y: y - 1 },
]

export const getNNeighbors = (radius: number, center: Cell, state: State) => {
  if (radius === 1) return [center]
  if (radius === 2) return [center, ...neighbors(center, state)]

  const cells: Cell[] = []
  const { sin, acos } = Math

  for (let x = center.x - radius; x < center.x + radius; x++) {
    const yspan = radius * sin(acos((center.x - x) / radius)) * 0.5
    for (let y = center.y - yspan; y < center.y + yspan; y++) {
      cells.push(<Cell>{ x, y: Math.round(y) })
    }
  }

  return cells
}

const isOutOfBounds = ({ x, y }: Cell, state: State): boolean =>
  x > 600 / state.cellWidth ||
  x < 0 ||
  y > window.innerHeight / state.cellHeight ||
  y < 0

const key = (x: number, y: number) => `${x},${y}`

const makeApi = (state: State): Canvas => {
  const getWithDefault = (x: number, y: number): Cell =>
    state.canvas[key(x, y)] || { x, y }

  const get: Canvas['get'] = (x, y) =>
    isOutOfBounds({ x, y, value: null, color: null }, state)
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

  const setPreview = (x: number, y: number, char: string = state.char) => {
    const k = key(x, y)

    if (!isOutOfBounds(<Cell>{ x, y }, state))
      state.preview[k] = {
        value: char,
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
  const $gridCanvas = createCanvas(600, 400)
  const ctx = $gridCanvas.getContext('2d')!

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
    context.fillText(
      cell.value,
      cell.x * state.cellWidth,
      cell.y * state.cellHeight,
    )
  }

  const clearCell = (cell: Cell) => {
    if (cell)
      context.clearRect(
        cell.x * state.cellWidth,
        cell.y * state.cellHeight,
        state.cellWidth,
        state.cellHeight,
      )
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
    clearCell(cell)
    drawCell(cell)
  }

  for (const key of state.dirtyCells) {
    const cell = state.canvas[key]
    clearCell(cell)
    drawCell(cell)
  }

  state.dirtyCells = []
}

export { initCanvas, makeApi, draw, drawGrid, key }
