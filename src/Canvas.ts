import { State } from './State'
import { Cell, CellMap } from './Cell'

export type Canvas = {
  get: (x: number, y: number) => Cell | undefined
  set: (x: number, y: number, char?: string) => void
  setLayer: (x: number, y: number, layer: string) => void
  clearLayer: (id: string) => void
  applyLayer: (id: string) => void
}

const initCanvas = () => {
  const $canvas = document.createElement('canvas')
  const ctx = $canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1

  $canvas.width = window.innerWidth * dpr
  $canvas.height = window.innerHeight * dpr
  ctx.scale(dpr, dpr)
  ctx.font = '14px monospace'

  document.body.appendChild($canvas)

  return $canvas
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

  const setLayer = (x: number, y: number, layer: string) => {
    if (layer in state.layers) {
      const k = key(x, y)

      state.layers[layer].data[k] = {
        value: state.char,
        color: state.color,
        x,
        y,
      }
    }
  }

  const clearLayer = (id: string) => {
    const layer = state.layers[id]
    const cells = layer.data

    for (const k in cells) {
      const prevCell = get(cells[k].x, cells[k].y)
      cells[k] = prevCell!
    }
  }

  const applyLayer = (id: string) => {
    const layer = state.layers[id]
    const cells = layer.data

    for (const k in cells) {
      const cell = cells[k]
      if (cell.value) state.canvas[k] = cell
    }

    delete state.layers[id]
  }

  return {
    get,
    set,
    setLayer,
    clearLayer,
    applyLayer,
  }
}

const draw = (state: State, context: CanvasRenderingContext2D) => {
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

  for (const id in state.layers) {
    const layer = state.layers[id]
    for (const key in layer.data) {
      const cell = layer.data[key]
      context.clearRect(cell.x, cell.y + 2, state.cellWidth, -state.cellHeight)
      drawCell(cell)
    }
  }

  for (const key of state.dirtyCells) {
    const cell = state.canvas[key]
    context.clearRect(cell.x, cell.y + 2, state.cellWidth, -state.cellHeight)
    drawCell(cell)
  }

  state.dirtyCells = []
}

export { initCanvas, makeApi, draw, key }
