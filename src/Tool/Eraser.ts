import { Tool } from '../Tool'

export const Eraser: Tool = {
  name: 'eraser',
  icon: '⌫',
  onPaint: ({ x, y, canvas }) => canvas.set(x, y, ''),
}
