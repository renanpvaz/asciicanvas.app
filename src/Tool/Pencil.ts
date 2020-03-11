import { Tool } from '../Tool'
import { State, getRealCoords } from '../State'

export const Pencil: Tool = {
  name: 'pencil',
  icon: '✏️',
  onPaint: ({ x, y, canvas }) => canvas.set(x, y),
}
