import { Tool } from '../Tool'
import { Cell } from '../CellMap'
import icon from '../../assets/ellipse.png'

const { sqrt, PI, round, min, abs, cos, sin } = Math

export const Ellipse: Tool<{ start?: Cell }> = {
  name: 'ellipse',
  icon,
  state: {},
  behavior: 'drag',
  cursor: 'crosshair',
  onPointerDown: ({ x, y, canvas }, squareState) => {
    squareState.start = { x, y }
    canvas.setPreview(x, y)
  },
  onPointerUp: ({ canvas }) => {
    canvas.applyPreview()
  },
  onPaint: ({ x, y, canvas }, { start }) => {
    if (!start) return
    const end = { x, y }
    canvas.clearPreview()

    const distX = start.x - end.x
    const distY = start.y - end.y

    const distance = sqrt(distX * distX + distY * distY) / 2

    const step = (2 * PI) / round(distance * 10)
    const r = distance

    const heightRatio = min(1, abs(distY / distX))
    const widthRatio = min(1, abs(distX / distY))

    const originX = start.x - distX / 2
    const originY = start.y - distY / 2

    for (var theta = 0; theta < 2 * PI; theta += step) {
      const x = originX + widthRatio * r * cos(theta)
      const y = originY - heightRatio * r * sin(theta)
      canvas.setPreview(round(x), round(y))
    }
  },
}
