import { Tool } from '../Tool'
import { html } from '../util'
import icon from '../../assets/text.png'

type TextState = {
  active: boolean
}

export const Text: Tool<TextState> = {
  name: 'text',
  icon,
  cursor: 'text',
  state: { active: false },
  onPointerUp: ({ x, y, state, canvas }, textState) => {
    const $prev = document.querySelector('#text-edit')

    if ($prev) return $prev.remove()

    const $el = html('p', {
      id: 'text-edit',
      contentEditable: 'true',
      style: {
        position: 'absolute',
        top: `${y * state.cellHeight + 32}px`,
        left: `${x * state.cellWidth + 31}px`,
        fontSize: `${state.fontSize}px`,
        fontFamily: 'monospace',
        zIndex: '1',
        padding: '0',
        background: 'white',
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
          textState.active = false
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
