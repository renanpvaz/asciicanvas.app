import { Tool } from '../Tool'
import { Cell } from '../CellMap'
import icon from '../../assets/selection.png'
import { CreateSelection } from '../Effect'

const getSortedVertices = (c1: Cell, c2: Cell) =>
  [{ x: c1.x, y: c2.y }, { x: c2.x, y: c1.y }, c1, c2].sort(
    (a, b) => a.x - b.x + a.y - b.y,
  )

export const Selection: Tool<{ first?: Cell; last?: Cell }> = {
  name: 'selection',
  icon,
  behavior: 'drag',
  cursor: 'crosshair',
  onPointerDown({ x, y }) {
    this.first = { x, y }
  },
  onPointerUp({ canvas, put }) {
    const { first, last } = this

    if (!first || !last) return

    let selection = ''
    const [start, , , end] = getSortedVertices(first, last)

    for (let y = start.y; y < end.y; y++) {
      for (let x = start.x; x < end.x; x++) {
        const cell = canvas.get(x, y)
        selection += cell?.value || ' '
        canvas.set(x, y, '')
      }
      selection += '\n'
    }

    put(
      CreateSelection({
        x: start.x,
        y: start.y,
        text: selection,
        draggable: true,
        editable: false,
      }),
    )
    canvas.clearSelection()
    this.first = undefined
    this.last = undefined
  },
  onPaint({ x, y, canvas }) {
    this.last = { x, y }

    if (this.first) {
      const { first, last } = this
      canvas.drawSelection(first, last)
    }
  },
}
