import { Tool } from '../Tool'
import { State } from '../State'
import { Cell } from '../Cell'

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
}

export const Line: Tool<LineState> = {
  name: 'line',
  icon: '📏',
  state: {},
  onPointerDown: ({ x, y }, lineState) => {
    lineState.start = <Cell>{ x, y }
  },
  onPointerUp: ({ canvas }) => {
    canvas.applyPreview()
  },
  onPaint: ({ x, y, state, canvas }, { start }) => {
    const end = <Cell>{ x, y }

    if (start) {
      canvas.clearPreview()
      walkGrid(state, start, end).forEach(point =>
        canvas.setPreview(point.x, point.y),
      )
    }
  },
}
