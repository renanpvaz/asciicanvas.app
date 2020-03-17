import { Tool } from '../Tool'
import { State } from '../State'
import { Cell } from '../Cell'

const walkGrid = (state: State, p0: Cell, p1: Cell) => {
  const dx = p1.x - p0.x,
    dy = p1.y - p0.y
  const nx = Math.abs(dx),
    ny = Math.abs(dy)
  const sign_x = dx > 0 ? state.cellWidth : -state.cellWidth,
    sign_y = dy > 0 ? state.cellHeight : -state.cellHeight

  const p = { x: p0.x, y: p0.y }
  const points = [{ x: p.x, y: p.y }]

  for (let ix = 0, iy = 0; ix < nx || iy < ny; ) {
    if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
      // next step is horizontal
      p.x += sign_x
      ix += state.cellWidth
    } else {
      // next step is vertical
      p.y += sign_y
      iy += state.cellHeight
    }
    points.push({ x: p.x, y: p.y })
  }

  return points
}

type LineState = {
  start?: Cell
}

const icon = `
  <svg x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;">
    <path d="M349.091,0v124.516L124.516,349.091H0V512h162.909V387.484l224.574-224.574H512V0H349.091z M54.303,457.696v-54.303
      h54.303v54.303H54.303z M457.696,108.605h-54.303V54.303h54.303V108.605z"/>
  </svg>
`

export const Line: Tool<LineState> = {
  name: 'line',
  icon,
  state: {},
  onPointerDown: ({ x, y }, lineState) => {
    lineState.start = <Cell>{ x, y }
  },
  onPointerUp: ({ canvas }) => {
    canvas.applyPreview()
  },
  onPaint: ({ x, y, state, canvas }, { start }) => {
    const end = <Cell>{ x, y }

    if (start) {
      canvas.clearPreview()
      walkGrid(state, start, end).forEach(point =>
        canvas.setPreview(point.x, point.y),
      )
    }
  },
}
