import { ToolbarOption } from '../ToolbarOption'
import { State, getRealCoords } from '../State'

const render = (state: State) => {
  const $input = document.createElement('input')

  $input.className = 'tool'
  $input.type = 'text'
  $input.value = '$'
  $input.maxLength = 1

  $input.addEventListener(
    'change',
    e => (state.char = (<HTMLInputElement>e.target).value),
  )

  return $input
}

export const Pencil: ToolbarOption = {
  name: 'pencil',
  type: 'tool',
  render,
  onMouseDown: (_, { state, history }) => {
    state.drawing = true
  },
  onMouseUp: (e, { state, history, canvas }) => {
    const { x, y } = getRealCoords(e, state)
    canvas.set(x, y)
    state.drawing = false
  },
  onMouseMove: (e: MouseEvent, { state, canvas }) => {
    if (!state.drawing) return

    const { x, y } = getRealCoords(e, state)
    canvas.set(x, y)
  },
  onClick: (e, { canvas, state, history }) => {},
}
