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
  state: {},
  behavior: 'drag',
  cursor: 'crosshair',
  onPointerDown: ({ x, y }, squareState) => {
    squareState.first = { x, y }
  },
  onPointerUp: ({ canvas, put }, squareState) => {
    const { first, last } = squareState

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
    squareState.first = undefined
    squareState.last = undefined
  },
  onPaint: ({ x, y, canvas }, selectionState) => {
    selectionState.last = { x, y }

    if (selectionState.first) {
      const { first, last } = selectionState
      canvas.drawSelection(first, last)
    }
  },
}
