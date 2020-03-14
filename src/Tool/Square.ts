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

export const Square: Tool<{ start?: Cell }> = {
  name: 'square',
  icon: '□',
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
