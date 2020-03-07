import { State } from './State'
import { Cell } from './Cell'

export type Canvas = {
  get: (x: number, y: number) => Cell | undefined
  set: (x: number, y: number, char?: string) => void
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

  const set: Canvas['set'] = (x, y, char = state.char) => {
    const prevCell = get(x, y)
    const equal =
      prevCell && prevCell.value === char && prevCell.color === state.color

    if (!equal) {
      const k = key(x, y)
      state.canvas[k] = { value: char, color: state.color, x, y }
      state.dirtyCells.push(k)
    }
  }

  return {
    get,
    set,
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

  for (const key of state.dirtyCells) {
    const cell = state.canvas[key]
    context.clearRect(cell.x, cell.y, state.cellWidth, -state.cellHeight)
    drawCell(cell)
  }

  state.dirtyCells = []
}

export { initCanvas, makeApi, draw, key }
