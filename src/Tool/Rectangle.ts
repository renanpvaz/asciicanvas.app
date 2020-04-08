import { Tool } from '../Tool'
import { Cell } from '../CellMap'
import icon from '../../assets/square.png'

const walkUntilMeet = (p0: Cell, p1: Cell): Cell[] => {
  const cells: Cell[] = [p0, p1]

  const go = (aAxis: 'x' | 'y', bAxis: 'x' | 'y') => {
    let didMeet = false

    const incA = p0[aAxis] < p1[aAxis] ? 1 : -1
    const incB = p0[bAxis] < p1[bAxis] ? -1 : 1

    let a = p0
    let b = p1

    while (!didMeet) {
      const didAMeet = a[aAxis] === b[aAxis]
      const didBMeet = a[bAxis] === b[bAxis]

      if (!didAMeet) cells.push((a = { ...a, [aAxis]: a[aAxis] + incA }))
      if (!didBMeet) cells.push((b = { ...b, [bAxis]: b[bAxis] + incB }))

      didMeet = didAMeet && didBMeet
    }
  }

  go('x', 'y')
  go('y', 'x')

  return cells
}

export const Rectangle: Tool<{ start?: Cell }> = {
  name: 'rectangle',
  icon,
  behavior: 'drag',
  cursor: 'crosshair',
  onPointerDown({ x, y, canvas }) {
    this.start = { x, y }
    canvas.setPreview(x, y)
  },
  onPointerUp({ canvas }) {
    canvas.applyPreview()
  },
  onPaint({ x, y, canvas }) {
    const end = { x, y }
    canvas.clearPreview()

    for (const cell of walkUntilMeet(this.start!, end)) {
      canvas.setPreview(cell.x, cell.y)
    }
  },
}
