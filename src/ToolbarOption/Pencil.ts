import { ToolbarOption } from '../ToolbarOption'
import { State } from '../State'

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
  onMouseDown: (_, { state }) => (state.drawing = true),
  onMouseUp: (_, { state }) => (state.drawing = false),
  onMouseMove: (e: MouseEvent, { state, canvas }) => {
    if (!state.drawing) return
    canvas.set(e.x, e.y)
  },
  onClick: () => {},
}
