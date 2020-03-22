import { Tool } from '../Tool'
import { Cell } from '../Cell'
import { html } from '../util'

type TextState = {
  start?: Cell
  xspan: number
  yspan: number
}

const icon = `
  <svg x="0px" y="0px" width="18" height="18">
     <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="18" font-family="serif">T</text>
  </svg>
`

export const Text: Tool<TextState> = {
  name: 'text',
  icon,
  state: { xspan: 0, yspan: 0 },
  onPointerUp: ({ x, y, state, canvas }, textState) => {
    const $el = html('p', {
      contentEditable: 'true',
      style: {
        position: 'absolute',
        top: `${y * state.cellHeight + 32}px`,
        left: `${x * state.cellWidth + 31}px`,
        fontSize: `${state.fontSize}px`,
        fontFamily: 'monospace',
        zIndex: '1',
        padding: '0',
        background: '0',
        border: '0',
        margin: '0',
        lineHeight: '1',
        outline: '2px dashed #03A9F4',
      },
      textContent: '',
      onkeyup: e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          document.body.removeChild($el)
          $el.textContent?.split('').forEach((char, i) => {
            canvas.set(x + i - 1, y, char)
          })
        }
      },
    })

    document.body.appendChild($el)
    $el.focus()
  },
}
