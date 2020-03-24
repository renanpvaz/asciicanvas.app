import { Tool } from '../Tool'
import { Cell } from '../Cell'

const icon = `
  <svg viewBox="0 0 512 512">
    <path d="m497 211h-20.535156c-17.949219-87.78125-87.683594-157.515625-175.464844-175.464844v-20.535156c0-8.285156-6.714844-15-15-15h-60c-8.285156 0-15 6.714844-15 15v20.53125c-42.101562 8.5625-80.519531 28.902344-111.761719 59.296875-32.746093 31.863281-54.675781 71.917969-63.691406 116.171875h-20.546875c-8.285156 0-15 6.714844-15 15v60c0 8.285156 6.714844 15 15 15h20.546875c17.996094 88.160156 87.332031 157.46875 175.453125 175.453125v20.546875c0 8.285156 6.714844 15 15 15h60c8.285156 0 15-6.714844 15-15v-20.535156c44.261719-9.027344 84.351562-30.996094 116.175781-63.710938 30.355469-31.203125 50.707031-69.652344 59.28125-111.753906h20.542969c8.285156 0 15-6.714844 15-15v-60c0-8.285156-6.714844-15-15-15zm-256-181h30v30h-30zm-211 211h30v30h-30zm241 241h-30v-30h30zm30-36.261719v-8.738281c0-8.285156-6.714844-15-15-15h-60c-8.285156 0-15 6.714844-15 15v8.742188c-71.523438-16.96875-127.769531-73.191407-144.746094-144.742188h8.746094c8.285156 0 15-6.714844 15-15v-60c0-8.285156-6.714844-15-15-15h-8.734375c16.984375-70.964844 74.015625-127.734375 144.734375-144.714844v8.714844c0 8.285156 6.714844 15 15 15h60c8.285156 0 15-6.714844 15-15v-8.734375c71.25 16.960937 127.773438 73.484375 144.734375 144.734375h-8.734375c-8.285156 0-15 6.714844-15 15v60c0 8.285156 6.714844 15 15 15h8.75c-16.925781 71.464844-72.964844 127.722656-144.75 144.738281zm181-174.738281h-30v-30h30zm0 0"/>
  </svg>
`

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
