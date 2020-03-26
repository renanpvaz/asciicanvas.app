import { Tool } from '../Tool'
import { getNNeighbors } from '../Canvas'
import { Cell } from '../Cell'

export const Eraser: Tool = {
  name: 'eraser',
  icon: { x: 0, y: -36 },
  onPaint: ({ x, y, canvas, state }) =>
    canvas.setAll(getNNeighbors(state.size || 0, <Cell>{ x, y }, state), ''),
}
