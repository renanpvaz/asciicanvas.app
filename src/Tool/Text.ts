import { Tool } from '../Tool'
import icon from '../../assets/text.png'
import { CreateSelection } from '../Effect'

export const Text: Tool = {
  name: 'text',
  icon,
  behavior: 'press',
  cursor: 'text',
  onPointerUp({ x, y, put }) {
    const $prev = document.querySelector('#text-edit')

    if ($prev) return $prev.remove()

    put(CreateSelection({ x, y, editable: true, draggable: false }))
  },
  onPointerDown() {},
  onPaint() {},
}
