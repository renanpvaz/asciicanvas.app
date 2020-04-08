import { Tool } from '../Tool'
import { Cell } from '../CellMap'
import icon from '../../assets/line.png'

const walkGrid = (p0: Cell, p1: Cell) => {
  const dx = p1.x - p0.x
  const dy = p1.y - p0.y

  const nx = Math.abs(dx)
  const ny = Math.abs(dy)

  const signX = dx > 0 ? 1 : -1
  const signY = dy > 0 ? 1 : -1

  const p = { x: p0.x, y: p0.y }
  const points = [{ x: p.x, y: p.y }]

  for (let ix = 0, iy = 0; ix < nx || iy < ny; ) {
    if ((0.5 + ix) / nx == (0.5 + iy) / ny) {
      p.x += signX
      p.y += signY
      ix++
      iy++
    } else if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
      p.x += signX
      ix++
    } else {
      p.y += signY
      iy++
    }

    points.push({ x: p.x, y: p.y })
  }

  return points
}

export const Line: Tool<{ start?: Cell }> = {
  name: 'line',
  icon,
  behavior: 'drag',
  cursor: 'crosshair',
  onPointerDown({ x, y }) {
    this.start = { x, y }
  },
  onPointerUp({ canvas }) {
    canvas.applyPreview()
  },
  onPaint({ x, y, canvas }) {
    const end = { x, y }

    if (this.start) {
      canvas.clearPreview()
      walkGrid(this.start, end).forEach(point =>
        canvas.setPreview(point.x, point.y),
      )
    }
  },
}
