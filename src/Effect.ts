import { State, canvasToString, getRealCoords } from './State'
import { Canvas } from './Canvas'
import { html, makeDraggable } from './util'

export type Context = {
  state: State
  context: CanvasRenderingContext2D
  canvas: Canvas
}
export type Effect = (context: Context) => void

const Effect = <T = void>(fn: (args: T) => Effect) => fn

const CreateSelection = Effect<{
  x: number
  y: number
  text?: string
  editable: boolean
  draggable: boolean
}>(
  ({
    x: startX,
    y: startY,
    text = '',
    editable = true,
    draggable = false,
  }) => ({ state, canvas }) => {
    const $el = html('pre', {
      id: 'text-edit',
      className: 'selection',
      contentEditable: editable ? 'true' : 'false',
      style: {
        transform: `translate(${startX * state.cellWidth}px, ${startY *
          state.cellHeight}px)`,
        fontSize: `${state.fontSize}px`,
        lineHeight: `${state.cellHeight + 1}px`,
        color: state.color,
      },
      textContent: text,
    })

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        finishSelection()
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (e.target !== $el) {
        finishSelection()
      }
    }

    const finishSelection = () => {
      document.body.removeChild($el)

      const text = $el.textContent || ''

      text.split('\n').forEach((line, yOffset) => {
        line.split('').forEach((char, xOffset) => {
          const x = +($el.dataset.x || startX)
          const y = +($el.dataset.y || startY)
          canvas.set(x + xOffset, y + yOffset, char)
        })
      })

      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousedown', handleClick)
    }

    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousedown', handleClick)

    if (draggable) {
      makeDraggable(
        $el,
        state,
        startX * state.cellWidth,
        startY * state.cellHeight,
      )
    }

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
      title: 'My art on asciicanvas.app',
      text: canvasToString(state),
      url: window.location.href,
    })
})

export { CreateSelection, Export, CopyText, Share }
