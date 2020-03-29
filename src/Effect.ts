import { State, canvasToString } from './State'
import { Canvas } from './Canvas'
import { html } from './util'

export type Context = {
  state: State
  context: CanvasRenderingContext2D
  canvas: Canvas
}
export type Effect = (context: Context) => void

const Effect = <T = void>(fn: (args: T) => Effect) => fn

const CreateSelection = Effect<{ x: number; y: number; text?: string }>(
  ({ x, y, text = '' }) => ({ state, canvas }) => {
    const $el = html('pre', {
      id: 'text-edit',
      contentEditable: 'true',
      style: {
        position: 'absolute',
        top: `${y * state.cellHeight + 32}px`,
        left: `${x * state.cellWidth + 58}px`,
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
      textContent: text,
      onkeyup: e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          document.body.removeChild($el)
          const text = $el.textContent || ''

          text.split('\n').forEach((line, yOffset) => {
            line.split('').forEach((char, xOffset) => {
              canvas.set(x + xOffset - 1, y + yOffset, char)
            })
          })
        }
      },
    })

    document.body.appendChild($el)
    $el.focus()
  },
)

const Export = Effect<'img' | 'text'>(type => ({ context, state }) => {
  const dataUrl =
    type === 'img'
      ? context.canvas.toDataURL('image/png')
      : encodeURIComponent(canvasToString(state))

  const element = html('a', {
    href: dataUrl,
    download: 'untitled.png',
    style: {
      display: 'none',
    },
  })

  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
})

const CopyText = Effect(() => ({ state }) => {
  const textArea = html('textarea', {
    value: canvasToString(state),
    style: {
      top: '0',
      left: '0',
      position: 'fixed',
    },
  })

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (err) {}

  document.body.removeChild(textArea)
})

const Share = Effect(() => ({ state }) => {
  if (navigator.share)
    navigator.share({
      title: 'My awesome post!',
      text: 'This post may or may not contain the answer to the universe',
      url: window.location.href,
    })
})

export { CreateSelection, Export, CopyText, Share }
