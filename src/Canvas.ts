import { State, Cell } from './State'

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

  document.body.appendChild($canvas)

  return $canvas
}

const key = (x: number, y: number) => `${x},${y}`

const makeApi = (state: State): Canvas => {
  const get = (x: number, y: number): Cell | undefined =>
    state.canvas[key(x, y)]
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

  return {
    get,
    set,
  }
}

const draw = (state: State, context: CanvasRenderingContext2D) => {
  for (const key of state.dirtyCells) {
    const cell = state.canvas[key]

    const realX = Math.round(cell.x / state.cellWidth) * state.cellWidth
    const realY = Math.round(cell.y / state.cellHeight) * state.cellHeight

    context.fillStyle = state.color
    context.fillText(state.char, realX, realY)
  }

  state.dirtyCells = []
}

export { initCanvas, makeApi, draw }
