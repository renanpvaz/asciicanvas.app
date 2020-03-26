import { Tool } from '../Tool'
import { getNNeighbors } from '../Canvas'
import { Cell } from '../Cell'
import { makeCursorFromSvg } from '../util'

export const Pencil: Tool = {
  name: 'pencil',
  icon: { x: 0, y: 0 },
  sizeable: true,
  onPaint: ({ x, y, canvas, state }) => {
    canvas.setAll(getNNeighbors(state.size || 0, <Cell>{ x, y }, state))
  },
}
