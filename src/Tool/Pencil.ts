import { Tool } from '../Tool'
import { getNNeighbors } from '../Canvas'
import { Cell } from '../Cell'
import icon from '../../assets/pencil.png'

export const Pencil: Tool = {
  name: 'pencil',
  icon,
  cursor: `url('${icon}') 7 35, default`,
  sizeable: true,
  onPaint: ({ x, y, canvas, state }) => {
    canvas.setAll(getNNeighbors(state.size || 0, <Cell>{ x, y }, state))
  },
}
