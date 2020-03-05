import { ToolbarOption } from '../ToolbarOption'
import { State } from '..'

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
  renderToolBarOption: render,
  onMouseDown: (_, { state }) => (state.drawing = true),
  onMouseUp: (_, { state }) => (state.drawing = false),
  onMouseMove: (e: MouseEvent, { state, context }) => {
    if (!state.drawing) return

    const mousePos = {
      x: e.pageX - document.body.offsetLeft,
      y: e.pageY - document.body.offsetTop,
    }
    const realX = Math.round(mousePos.x / state.cellWidth)
    const realY = Math.round(mousePos.y / state.cellHeight)
    const x = realX * state.cellWidth
    const y = realY * state.cellHeight
    const key = `${realX}.${realY}`

    context.clearRect(
      x,
      (realY - 1) * state.cellHeight,
      state.cellWidth,
      state.cellHeight,
    )
    context.fillStyle = state.color
    context.fillText(state.char, x, y)
    state.canvas.set(key, { value: state.char, color: state.color })
  },
  onClick: () => {},
}
