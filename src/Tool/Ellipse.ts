import { Tool } from '../Tool'
import { Cell } from '../Cell'
import icon from '../../assets/ellipse.png'

export const Ellipse: Tool<{ start?: Cell }> = {
  name: 'ellipse',
  icon,
  state: {},
  cursor: 'crosshair',
  onPointerDown: ({ x, y, canvas }, squareState) => {
    squareState.start = <Cell>{ x, y }
    canvas.setPreview(x, y)
  },
  onPointerUp: ({ canvas }) => {
    canvas.applyPreview()
  },
  onPaint: ({ x, y, canvas }, { start }) => {
    if (!start) return
    const end = <Cell>{ x, y }
    canvas.clearPreview()

    const distX = start.x - end.x
    const distY = start.y - end.y

    const distance = Math.sqrt(distX * distX + distY * distY) / 2

    const step = (2 * Math.PI) / Math.round(distance * 10)
    const r = distance

    const heightRatio = Math.min(1, Math.abs(distY / distX))
    const widthRatio = Math.min(1, Math.abs(distX / distY))

    const originX = start.x - distX / 2
    const originY = start.y - distY / 2

    for (var theta = 0; theta < 2 * Math.PI; theta += step) {
      const x = originX + widthRatio * r * Math.cos(theta)
      const y = originY - heightRatio * r * Math.sin(theta)
      canvas.setPreview(Math.round(x), Math.round(y))
    }
  },
}
