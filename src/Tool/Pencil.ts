import { Tool } from '../Tool'
import { getNNeighbors } from '../CellMap'
import { Cell } from '../CellMap'
import icon from '../../assets/pencil.png'

export const Pencil: Tool = {
  name: 'pencil',
  icon,
  behavior: 'both',
  cursor: `url('${icon}') 7 35, default`,
  sizeable: true,
  onPaint: ({ x, y, canvas, state }) => {
    for (const cell of getNNeighbors(state.size || 0, { x, y })) {
      canvas.set(cell.x, cell.y)
    }
  },
}
