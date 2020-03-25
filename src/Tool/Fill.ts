import { Tool } from '../Tool'
import { makeCursorFromSvg } from '../util'

const icon = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="18" height="18" enable-background="new 0 0 467.766 467.766" height="512" viewBox="0 0 467.766 467.766">
    <path d="m169.359 371.494c5.71 5.71 13.19 8.565 20.67 8.565s14.96-2.855 20.67-8.565l181.464-181.464-190.028-190.03-41.34 41.34 31.748 31.748-140.125 140.124c-11.42 11.42-11.42 29.921 0 41.34 0 .001 116.941 116.942 116.941 116.942zm64.524-257.065 75.601 75.601-43.853 43.853h-151.202c0-.001 119.454-119.454 119.454-119.454z"/><path d="m394.677 380.06c24.219 0 43.853-19.634 43.853-43.853s-43.853-73.088-43.853-73.088-43.853 48.869-43.853 73.088 19.634 43.853 43.853 43.853z"/>
    <path d="m29.236 409.295h409.294v58.471h-409.294z"/>
  </svg>
`

export const Fill: Tool = {
  name: 'fill',
  icon: { x: 0, y: -144 },
  cursor: makeCursorFromSvg(icon),
  onPaint: ({ x, y, state, canvas }) => {
    const target = canvas.get(x, y)

    const fill = (color: string | null, x: number, y: number) => {
      const cell = canvas.get(x, y)

      if (!cell || cell.color !== color) return

      canvas.set(x, y)

      const fillNeighbors = () => {
        fill(color, x + 1, y)
        fill(color, x - 1, y)
        fill(color, x, y + 1)
        fill(color, x, y - 1)
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
