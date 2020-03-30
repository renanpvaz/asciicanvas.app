import { Tool } from '../Tool'
import { getNNeighbors } from '../Canvas'
import { Cell } from '../Cell'
import icon from '../../assets/eraser.png'

export const Eraser: Tool = {
  name: 'eraser',
  icon,
  behavior: 'both',
  onPaint: ({ x, y, canvas, state }) =>
    canvas.setAll(getNNeighbors(state.size || 0, <Cell>{ x, y }, state), ''),
}
