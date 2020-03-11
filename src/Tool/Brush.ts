import { Tool } from '../Tool'
import { State, getRealCoords } from '../State'

const render = (state: State) => {
  const $input = document.createElement('button')

  $input.className = 'tool'
  $input.textContent = 'Br'

  $input.addEventListener('click', () => (state.selectedTool = 'brush'))

  return $input
}

export const Brush: Tool = {
  name: 'brush',
  render,
  onPaint: ({ x, y, state, canvas }) => {
    canvas.set(x, y)
    canvas.set(x + state.cellWidth, y)
    canvas.set(x - state.cellWidth, y)
    canvas.set(x, y + state.cellHeight)
    canvas.set(x, y - state.cellHeight)
  },
}
