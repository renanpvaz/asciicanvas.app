import { ToolbarOption } from '../ToolbarOption'
import { State, getRealCoords } from '../State'
import { Cell } from '../Cell'
import { addLayer } from '../Layer'

const walkGrid = (state: State, p0: Cell, p1: Cell) => {
  const dx = p1.x - p0.x,
    dy = p1.y - p0.y
  const nx = Math.abs(dx),
    ny = Math.abs(dy)
  const sign_x = dx > 0 ? state.cellWidth : -state.cellWidth,
    sign_y = dy > 0 ? state.cellHeight : -state.cellHeight

  const p = { x: p0.x, y: p0.y }
  const points = [{ x: p.x, y: p.y }]

  for (let ix = 0, iy = 0; ix < nx || iy < ny; ) {
    if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
      // next step is horizontal
      p.x += sign_x
      ix += state.cellWidth
    } else {
      // next step is vertical
      p.y += sign_y
      iy += state.cellHeight
    }
    points.push({ x: p.x, y: p.y })
  }

  return points
}

const render = (state: State) => {
  const $btn = document.createElement('button')

  $btn.className = 'tool'
  $btn.textContent = 'Ln'

  $btn.addEventListener('click', e => (state.selectedTool = 'line'))

  return $btn
}

let p0: Cell
let id: string

export const Line: ToolbarOption = {
  name: 'line',
  type: 'tool',
  render,
  onMouseDown: (e, { state }) => {
    const { x, y } = getRealCoords(e, state)
    p0 = <Cell>{ x, y }
    id = addLayer(state)
    state.drawing = true
  },
  onMouseUp: (e, { state, canvas }) => {
    state.drawing = false
    console.log({ ...state.canvas })
    canvas.applyLayer(id)
    console.log({ ...state.canvas })
  },
  onMouseMove: (e: MouseEvent, { state, canvas }) => {
    const p1 = <Cell>getRealCoords(e, state)
    if (p0 && p1 && state.drawing) {
      canvas.clearLayer(id)
      walkGrid(state, p0, p1).forEach(point =>
        canvas.setLayer(point.x, point.y, id),
      )
    }
  },
}
