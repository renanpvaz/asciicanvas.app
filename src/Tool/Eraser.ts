import { Tool } from '../Tool'
import { getNNeighbors } from '../Canvas'
import { Cell } from '../Cell'

const icon = `
  <svg enable-background="new 0 0 467.765 467.765" viewBox="0 0 467.765 467.765">
    <path d="m459.2 198.594-160.795-160.794c-11.42-11.42-29.921-11.42-41.34 0l-248.5 248.5c-11.42 11.42-11.42 29.921 0 41.34l102.324 102.324c5.482 5.482 12.919 8.565 20.67 8.565h116.941c7.751 0 15.189-3.083 20.67-8.565l190.03-190.029c11.42-11.42 11.42-29.921 0-41.341zm-222.805 181.465h-92.731l-73.088-73.088 82.91-82.91 119.454 119.454z"/>
  </svg>
`

export const Eraser: Tool = {
  name: 'eraser',
  icon: { x: 0, y: -36 },
  onPaint: ({ x, y, canvas, state }) =>
    canvas.setAll(getNNeighbors(state.size || 0, <Cell>{ x, y }, state), ''),
}
