import { Tool } from '../Tool'
import { Cell } from '../Cell'
import { State } from '../State'

const walkUntilMeet = (p0: Cell, p1: Cell, state: State): Cell[] => {
  const cells: Cell[] = [p0, p1]

  const unit = (axis: 'x' | 'y') =>
    axis === 'x' ? state.cellWidth : state.cellHeight

  const go = (aAxis: 'x' | 'y', bAxis: 'x' | 'y') => {
    let didMeet = false

    const incA = p0[aAxis] < p1[aAxis] ? 1 : -1
    const incB = p0[bAxis] < p1[bAxis] ? -1 : 1

    let a = p0
    let b = p1

    while (!didMeet) {
      const didAMeet = a[aAxis] === b[aAxis]
      const didBMeet = a[bAxis] === b[bAxis]

      if (!didAMeet)
        cells.push((a = <Cell>{ ...a, [aAxis]: a[aAxis] + unit(aAxis) * incA }))
      if (!didBMeet)
        cells.push((b = <Cell>{ ...b, [bAxis]: b[bAxis] + unit(bAxis) * incB }))

      didMeet = didAMeet && didBMeet
    }
  }

  go('x', 'y')
  go('y', 'x')

  return cells
}

const icon = `
  <svg x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;">
    <path d="M466.052,374.155V45.948H137.847V0H0v137.847h45.948v328.205h328.205V512H512V374.155H466.052z M91.897,91.897H45.948
      V45.948h45.948V91.897z M420.103,374.153h-45.948v0.001v45.948H91.898V137.847h45.948v-45.95h282.256V374.153z M466.052,466.052
      h-45.948v-45.948h45.948V466.052z"/>
  </svg>
`

export const Square: Tool<{ start?: Cell }> = {
  name: 'square',
  icon,
  state: {},
  onPointerDown: ({ x, y, canvas }, squareState) => {
    squareState.start = <Cell>{ x, y }
    canvas.setPreview(x, y)
  },
  onPointerUp: ({ canvas }) => {
    canvas.applyPreview()
  },
  onPaint: ({ x, y, canvas, state }, squareState) => {
    const end = <Cell>{ x, y }
    canvas.clearPreview()

    for (const cell of walkUntilMeet(squareState.start!, end, state)) {
      canvas.setPreview(cell.x, cell.y)
    }
  },
}
