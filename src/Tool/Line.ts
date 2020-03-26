import { Tool } from '../Tool'
import { Cell } from '../Cell'

const walkGrid = (p0: Cell, p1: Cell) => {
  const dx = p1.x - p0.x
  const dy = p1.y - p0.y

  const nx = Math.abs(dx)
  const ny = Math.abs(dy)

  const sign_x = dx > 0 ? 1 : -1
  const sign_y = dy > 0 ? 1 : -1

  const p = { x: p0.x, y: p0.y }
  const points = [{ x: p.x, y: p.y }]

  for (let ix = 0, iy = 0; ix < nx || iy < ny; ) {
    if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
      p.x += sign_x
      ix += 1
    } else {
      p.y += sign_y
      iy += 1
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
  icon: { x: 0, y: -72 },
  state: {},
  cursor: 'crosshair',
  onPointerDown: ({ x, y }, lineState) => {
    lineState.start = <Cell>{ x, y }
  },
  onPointerUp: ({ canvas }) => {
    canvas.applyPreview()
  },
  onPaint: ({ x, y, canvas }, { start }) => {
    const end = <Cell>{ x, y }

    if (start) {
      canvas.clearPreview()
      walkGrid(start, end).forEach(point => canvas.setPreview(point.x, point.y))
    }
  },
}
