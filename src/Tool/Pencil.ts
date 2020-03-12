import { Tool } from '../Tool'
import { State, getRealCoords } from '../State'

export const Pencil: Tool = {
  name: 'pencil',
  icon: '✏️',
  state: null,
  onPaint: ({ x, y, canvas }) => canvas.set(x, y),
}
