import { Tool } from '../Tool'
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

export const Pencil: Tool = {
  name: 'pencil',
  render,
  onPaint: ({ x, y, canvas }) => canvas.set(x, y),
}
