import { Tool } from '../Tool'
import { State, getRealCoords } from '../State'

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
  onMouseDown: (_, { state }) => (state.drawing = true),
  onMouseUp: (_, { state }) => (state.drawing = false),
  onMouseMove: (e: MouseEvent, { state, canvas }) => {
    if (!state.drawing) return
    const { x, y } = getRealCoords(e, state)
    canvas.set(x, y, '')
  },
  onClick: (e, { canvas, state }) => {
    const { x, y } = getRealCoords(e, state)
    canvas.set(x, y, '')
  },
}
