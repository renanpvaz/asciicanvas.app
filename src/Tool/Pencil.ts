import { Tool } from '../Tool'

export const Pencil: Tool = {
  name: 'pencil',
  icon: '✏️',
  onPaint: ({ x, y, canvas }) => canvas.set(x, y),
}
