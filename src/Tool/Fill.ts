import { Tool } from '../Tool'
import icon from '../../assets/bucket.png'
import { isOutOfBounds } from '../Canvas'
import { Cell } from '../CellMap'

export const Fill: Tool = {
  name: 'fill',
  icon,
  behavior: 'press',
  cursor: `url('${icon}'), default`,
  onPaint: ({ x: targetX, y: targetY, state, canvas }) => {
    const target = canvas.get(targetX, targetY)

    if (!target) return

    const cells: (Cell | undefined)[] = [target]
    const { color } = target

    while (cells.length) {
      const cell = cells.pop()!

      if (isOutOfBounds(cell, state)) continue

      if (cell.color === color) {
        const { x, y } = cell

        canvas.set(x, y)
        cells.push(canvas.get(x + 1, y))
        cells.push(canvas.get(x - 1, y))
        cells.push(canvas.get(x, y + 1))
        cells.push(canvas.get(x, y - 1))
      }
    }
  },
  onPointerDown() {},
  onPointerUp() {},
}
