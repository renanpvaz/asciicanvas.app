import { Tool } from '../Tool'
import { State } from '../State'

const render = (state: State) => {
  const $btn = document.createElement('button')

  $btn.className = 'tool'
  $btn.textContent = 'Er'

  $btn.addEventListener('click', () => (state.selectedTool = 'eraser'))

  return $btn
}

export const Eraser: Tool = {
  name: 'eraser',
  render,
  onPaint: ({ x, y, canvas }) => canvas.set(x, y, ''),
}
