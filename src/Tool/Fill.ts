import { Tool } from '../Tool'
import { makeCursorFromSvg } from '../util'

export const Fill: Tool = {
  name: 'fill',
  icon: { x: 0, y: -144 },
  onPaint: ({ x, y, state, canvas }) => {
    const target = canvas.get(x, y)

    const fill = (color: string | null, x: number, y: number) => {
      const cell = canvas.get(x, y)

      if (!cell || cell.color !== color) return

      canvas.set(x, y)

      const fillNeighbors = () => {
        fill(color, x + 1, y)
        fill(color, x - 1, y)
        fill(color, x, y + 1)
        fill(color, x, y - 1)
      }

      if (state.dirtyCells.length > 1000) {
        requestAnimationFrame(fillNeighbors)
      } else {
        fillNeighbors()
      }
    }

    if (target) fill(target.color, x, y)
  },
}
