import { Tool } from '../Tool'
import { createSelection } from '../util'
import icon from '../../assets/text.png'

export const Text: Tool = {
  name: 'text',
  icon,
  behavior: 'press',
  cursor: 'text',
  onPointerUp: ({ x, y, state, canvas }) => {
    const $prev = document.querySelector('#text-edit')

    if ($prev) return $prev.remove()

    createSelection({
      x,
      y,
      state,
      canvas,
    })
  },
}
