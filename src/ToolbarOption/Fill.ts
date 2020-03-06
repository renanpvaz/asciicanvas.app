import { ToolbarOption } from '../ToolbarOption'
import { State, Cell, getRealCoords } from '../State'
import { Canvas } from '../Canvas'

const render = (state: State) => {
  const $input = document.createElement('button')

  $input.className = 'tool'
  $input.textContent = 'Fill'

  $input.addEventListener('click', e => (state.selectedTool = 'fill'))

  return $input
}

const fill = (state: State, canvas: Canvas, x: number, y: number) => {
  const target = canvas.get(x, y)

  if (!target || target.value) return

  canvas.set(x, y)

  const fillNeighbors = () => {
    fill(state, canvas, x + state.cellWidth, y)
    fill(state, canvas, x - state.cellWidth, y)
    fill(state, canvas, x, y + state.cellHeight)
    fill(state, canvas, x, y - state.cellHeight)
  }

  if (state.dirtyCells.length > 1000) {
    requestAnimationFrame(fillNeighbors)
  } else {
    fillNeighbors()
  }
}

export const Fill: ToolbarOption = {
  name: 'fill',
  type: 'tool',
  render,
  onMouseDown: (_, { state }) => (state.drawing = true),
  onMouseUp: (_, { state }) => (state.drawing = false),
  onMouseMove: (e: MouseEvent, { state, canvas }) => {},
  onClick: (e: MouseEvent, { state, canvas }) => {
    const { x, y } = getRealCoords(e, state)

    fill(state, canvas, x, y)
  },
}
