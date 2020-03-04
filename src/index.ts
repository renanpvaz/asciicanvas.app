type State = {
  drawing: boolean
}

const $canvas = document.createElement('canvas')
const ctx = $canvas.getContext('2d')!
const state = { drawing: false, canvas: new Map<string, string>() }

const coords = (event: MouseEvent) => ({
  x: event.pageX - $canvas.offsetLeft,
  y: event.pageY - $canvas.offsetTop,
})

const startDrawing = () => {
  state.drawing = true
}
const stopDrawing = () => {
  state.drawing = false
}
const handleDrawing = (e: MouseEvent) => {
  if (!state.drawing) return
  const { x, y } = coords(e)
  const realX = Math.round(x / 8)
  const realY = Math.round(y / 8)
  const key = `${realX}.${realY}`

  if (state.canvas.has(key)) return

  ctx.fillText('$', realX * 8, realY * 8)
  state.canvas.set(key, '$')
}

const init = () => {
  $canvas.width = 500
  $canvas.height = 500
  $canvas.style.border = '1px solid'

  $canvas.addEventListener('mousedown', startDrawing)
  $canvas.addEventListener('mouseup', stopDrawing)
  $canvas.addEventListener('mousemove', handleDrawing)

  document.body.append($canvas)
}

document.addEventListener('DOMContentLoaded', init)
