import { Tool } from '../Tool'
import { State } from '../State'

export const Eraser: Tool = {
  name: 'eraser',
  icon: '⌫',
  onPaint: ({ x, y, canvas }) => canvas.set(x, y, ''),
}
