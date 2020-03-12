import { Tool } from '../Tool'
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

type LineState = {
  start?: Cell
  id?: string
}

export const Line: Tool<LineState> = {
  name: 'line',
  icon: '📏',
  state: {},
  onPointerDown: ({ x, y, state }, lineState) => {
    lineState.id = addLayer(state)
    lineState.start = <Cell>{ x, y }
  },
  onPointerUp: ({ canvas }, lineState) => {
    canvas.applyLayer(lineState.id!)
  },
  onPaint: ({ x, y, state, canvas }, { id, start }) => {
    const end = <Cell>{ x, y }

    if (start && id) {
      canvas.clearLayer(id)
      walkGrid(state, start, end).forEach(point =>
        canvas.setLayer(point.x, point.y, id),
      )
    }
  },
}
