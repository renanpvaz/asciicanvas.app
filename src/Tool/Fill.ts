import { Tool } from '../Tool'
import { State, getRealCoords } from '../State'

const render = (state: State) => {
  const $input = document.createElement('button')

  $input.className = 'tool'
  $input.textContent = 'Fill'

  $input.addEventListener('click', e => (state.selectedTool = 'fill'))

  return $input
}

export const Fill: Tool = {
  name: 'fill',
  render,
  onPaint: ({ x, y, state, canvas }) => {
    const target = canvas.get(x, y)

    const fill = (color: string | null, x: number, y: number) => {
      const cell = canvas.get(x, y)

      if (!cell || cell.color !== color) return

      canvas.set(x, y)

      const fillNeighbors = () => {
        fill(color, x + state.cellWidth, y)
        fill(color, x - state.cellWidth, y)
        fill(color, x, y + state.cellHeight)
        fill(color, x, y - state.cellHeight)
      }

      if (state.dirtyCells.length > 1000) {
        requestAnimationFrame(fillNeighbors)
      } else {
        fillNeighbors()
      }
    }

    if (target) fill(target.color, x, y)
  },
}
