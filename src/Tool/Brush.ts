import { Tool } from '../Tool'
import { State, getRealCoords } from '../State'

export const Brush: Tool = {
  name: 'brush',
  icon: '🖌️',
  state: null,
  onPaint: ({ x, y, state, canvas }) => {
    canvas.set(x, y)
    canvas.set(x + state.cellWidth, y)
    canvas.set(x - state.cellWidth, y)
    canvas.set(x, y + state.cellHeight)
    canvas.set(x, y - state.cellHeight)
  },
}
