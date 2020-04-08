import { Tool } from '../Tool'
import { getNNeighbors } from '../CellMap'
import icon from '../../assets/eraser.png'

export const Eraser: Tool = {
  name: 'eraser',
  icon,
  behavior: 'both',
  onPaint: ({ x, y, canvas, state }) => {
    for (const cell of getNNeighbors(state.size || 0, { x, y })) {
      canvas.set(cell.x, cell.y, '')
    }
  },
}
