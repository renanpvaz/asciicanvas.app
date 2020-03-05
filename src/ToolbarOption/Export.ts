import { ToolbarOption } from '../ToolbarOption'

const exportAsImg = ($canvas: HTMLCanvasElement) => {
  const element = document.createElement('a')
  element.setAttribute('href', $canvas.toDataURL('image/png'))
  element.setAttribute('download', 'untitled.png')

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export const Export: ToolbarOption = {
  name: 'export',
  type: 'option',
  render: (_, ctx) => {
    const $btn = document.createElement('button')

    $btn.className = 'tool'
    $btn.textContent = 'Ex'

    $btn.addEventListener('click', () => {
      exportAsImg(ctx.canvas)
    })

    return $btn
  },
}
