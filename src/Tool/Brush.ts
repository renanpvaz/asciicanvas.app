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
  onMouseDown: (_, { state }) => (state.drawing = true),
  onMouseUp: (_, { state }) => (state.drawing = false),
  onMouseMove: (e: MouseEvent, { state, canvas }) => {
    if (!state.drawing) return

    const { x, y } = getRealCoords(e, state)

    canvas.set(x, y)
    canvas.set(x + state.cellWidth, y)
    canvas.set(x - state.cellWidth, y)
    canvas.set(x, y + state.cellHeight)
    canvas.set(x, y - state.cellHeight)
  },
  onClick: (e, { canvas, state }) => {
    const { x, y } = getRealCoords(e, state)

    canvas.set(x, y)
    canvas.set(x + state.cellWidth, y)
    canvas.set(x - state.cellWidth, y)
    canvas.set(x, y + state.cellHeight)
    canvas.set(x, y - state.cellHeight)
  },
}
