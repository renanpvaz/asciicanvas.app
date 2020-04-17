import { State, canvasToString, StateReady } from './State'
import { Canvas, initCanvas, drawGrid, measureText } from './Canvas'
import { html, makeDraggable, query } from './util'
import { Tool } from './Tool'
import * as History from './History'

export type Context = {
  state: StateReady
  canvas: Canvas
  put: (_: Effect) => void
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

const Export = Effect<'img' | 'text'>(type => ({ state }) => {
  const ext = type === 'img' ? 'png' : 'txt'
  const dataUrl =
    type === 'img'
      ? state.context.canvas.toDataURL('image/png')
      : encodeURIComponent(canvasToString(state))

  const element = html('a', {
    href: dataUrl,
    download: `untitled.${ext}`,
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
      text: '',
      url: state.context.canvas.toDataURL('image/png'),
    })
})

const HistoryBack = Effect(() => ({ state }) => {
  History.back(state)
})

const HistoryForward = Effect(() => ({ state }) => {
  History.forward(state)
})

const SelectTool = Effect<Tool>(tool => ({ state }) => {
  query(state.tool.name)?.classList.remove('tool--active')
  query(tool.name)?.classList.add('tool--active')

  state.tool = Object.assign({}, tool)
  state.context.canvas.style.cursor = tool.cursor || 'default'
})

const readFile = (file: File): Promise<string> =>
  new Promise(resolve => {
    const reader = new FileReader()

    reader.addEventListener('load', () => resolve(<string>reader.result))
    reader.readAsText(file)
  })

const OpenFile = Effect(() => ({ state, canvas }) => {
  html('input', {
    type: 'file',
    accept: '.txt',
    onchange: e => {
      state.canvas = {}
      state.history.updated = true

      readFile((<HTMLInputElement>e.target).files![0]).then(text =>
        text.split('\n').forEach((line, y) =>
          line.split('').forEach((char, x) => {
            if (char.trim()) canvas.set(x, y, char)
          }),
        ),
      )
    },
  }).click()
})

const NewCanvas = Effect<{ width: number; height: number }>(
  ({ width, height }) => ({ state, put }) => {
    state.width = width * state.cellWidth + 1
    state.height = height * state.cellHeight + 1
    state.canvas = {}
    state.dirtyCells = []
    state.history.updated = true

    const newCanvas = initCanvas({ state, put })

    document.querySelector('canvas')!.replaceWith(newCanvas)
    drawGrid(state)
  },
)

const MeasureCell = Effect(() => ({ state }) => {
  const { width, height } = measureText(state.fontSize)

  state.cellWidth = width
  state.cellHeight = height
  drawGrid(state)
})

const UpdateFontSize = Effect<number>(fontSize => ({ state, put }) => {
  state.fontSize = fontSize
  state.history.updated = true
  put(MeasureCell())
})

export {
  CreateSelection,
  Export,
  CopyText,
  Share,
  SelectTool,
  OpenFile,
  HistoryBack,
  HistoryForward,
  NewCanvas,
  UpdateFontSize,
  MeasureCell,
}
