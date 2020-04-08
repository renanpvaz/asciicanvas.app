import { State, StateReady, getRealCoords } from './State'
import * as CellMap from './CellMap'
import { Cell } from './CellMap'
import { Effect } from './Effect'
import { isMobile } from './util'
import * as History from './History'

export type Canvas = {
  get: (x: number, y: number) => Cell | undefined
  set: (x: number, y: number, char?: string) => void
  setPreview: (x: number, y: number, char?: string) => void
  clearPreview: () => void
  applyPreview: () => void
  drawSelection: (start: Cell, end: Cell) => void
  clearSelection: () => void
}

const createCanvasElement = (width: number, height: number) => {
  const $canvas = document.createElement('canvas')
  const ctx = $canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1

  $canvas.width = width * dpr
  $canvas.height = height * dpr
  $canvas.style.width = `${width}px`
  $canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)

  return $canvas
}

const initCanvas = ({
  state: initialState,
  put,
}: {
  state: State
  put: (_: Effect) => void
}) => {
  const $canvas = createCanvasElement(initialState.width, initialState.height)
  const context = $canvas.getContext('2d')!

  const state: State = Object.assign(initialState, {
    state: 'ready',
    context,
  })

  const useToolHandler = (
    key: 'onPointerDown' | 'onPointerUp' | 'onPaint',
    coords: { x: number; y: number },
  ) => {
    state.tool[key](
      {
        ...getRealCoords(
          coords.x - $canvas.offsetLeft,
          coords.y - $canvas.offsetTop,
          state,
        ),
        state,
        canvas: makeCanvas(state),
        put,
      },
      state.tool.state,
    )
  }

  const hasBehavior = (behavior: 'press' | 'drag') =>
    state.tool.behavior === behavior || state.tool.behavior === 'both'

  const handleMouseDown = (coords: { x: number; y: number }) => {
    state.pressing = true
    useToolHandler('onPointerDown', coords)
    History.push(state)
  }
  const handleMouseUp = (coords: { x: number; y: number }) => {
    state.pressing = false
    useToolHandler('onPointerUp', coords)
    if (hasBehavior('press')) useToolHandler('onPaint', coords)
  }
  const handleMouseMove = (coords: { x: number; y: number }) => {
    if (state.pressing && hasBehavior('drag')) useToolHandler('onPaint', coords)
  }

  const getTouchCoords = (e: TouchEvent) => ({
    x: e.changedTouches[0].pageX,
    y: e.changedTouches[0].pageY,
  })

  if (isMobile()) {
    $canvas.addEventListener('touchstart', e =>
      handleMouseDown(getTouchCoords(e)),
    )
    $canvas.addEventListener('touchend', e => handleMouseUp(getTouchCoords(e)))
    $canvas.addEventListener('touchmove', e =>
      handleMouseMove(getTouchCoords(e)),
    )
  } else {
    $canvas.addEventListener('mousedown', e => handleMouseDown(e))
    $canvas.addEventListener('mouseup', e => handleMouseUp(e))
    $canvas.addEventListener('mousemove', e => {
      handleMouseMove(e)
      e.stopPropagation()
    })
  }

  return $canvas
}

const measureText = (fontSize: number) => {
  const context = document.createElement('canvas').getContext('2d')!

  context.font = `${fontSize}px monospace`

  const metrics = context.measureText('$')

  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent * 1.5,
  }
}

const isOutOfBounds = ({ x, y }: Cell, state: State): boolean =>
  x > state.width / state.cellWidth ||
  x < 0 ||
  y > state.height / state.cellHeight ||
  y < 0

const makeCanvas = (state: State): Canvas => ({
  get: (x, y) => CellMap.get(x, y, state.canvas),
  set: (x: number, y: number, char: string = state.char) => {
    CellMap.set({ x, y, color: state.color, value: char }, state.canvas)
    state.dirtyCells.push(CellMap.key(x, y))
  },
  setPreview: (x: number, y: number, char: string = state.char) => {
    if (!isOutOfBounds({ x, y }, state))
      CellMap.set(
        {
          value: char,
          color: state.color,
          x,
          y,
        },
        state.preview,
      )
  },
  clearPreview: () => {
    const cells = state.preview

    for (const k in cells) {
      const { x, y } = cells[k]
      const prevCell = CellMap.get(x, y, state.canvas)
      cells[k] = prevCell!
    }
  },
  applyPreview: () => {
    const cells = state.preview

    for (const k in cells) {
      const cell = cells[k]
      if (cell.value) state.canvas[k] = cell
    }

    state.preview = {}
  },
  drawSelection: (start: Cell, end: Cell) => {
    state.selection = { start, end }
    state.history.updated = true
  },
  clearSelection: () => {
    state.selection = null
    state.history.updated = true
  },
})

const drawGrid = (state: StateReady) => {
  const $gridCanvas = createCanvasElement(state.width, state.height)
  const ctx = $gridCanvas.getContext('2d')!
  const { context: targetCtx } = state

  ctx.strokeStyle = '#7b7b7b'
  ctx.lineWidth = 0.5

  for (let x = 0; x < state.width; x += state.cellWidth) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, state.height)
    ctx.stroke()
  }
  for (let y = 0; y < state.height; y += state.cellHeight) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(state.width, y)
    ctx.stroke()
  }

  targetCtx.canvas.style.backgroundImage = `url('${$gridCanvas.toDataURL()}')`
}

const draw = (state: StateReady) => {
  const { context } = state

  context.textBaseline = 'top'
  context.font = `${state.fontSize}px monospace`

  const drawCell = (cell: Cell) => {
    if (!cell.value) return

    context.fillStyle = cell.color!
    context.fillText(
      cell.value,
      cell.x * state.cellWidth,
      cell.y * state.cellHeight,
    )
  }

  const clearCell = (cell: Cell) => {
    if (cell)
      context.clearRect(
        cell.x * state.cellWidth,
        cell.y * state.cellHeight,
        state.cellWidth,
        state.cellHeight,
      )
  }

  const makeRect = (start: Cell, end: Cell) => {
    const x = start.x * state.cellWidth
    const y = start.y * state.cellHeight

    const endX = end.x * state.cellWidth
    const endY = end.y * state.cellHeight

    return {
      x,
      y,
      width: endX - x,
      height: endY - y,
    }
  }

  if (state.history.updated) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    if (state.selection) {
      const { start, end } = state.selection
      const selection = makeRect(start, end)

      context.setLineDash([5, 3])
      context.strokeStyle = '#03a9f4'
      context.lineWidth = 2
      context.strokeRect(
        selection.x,
        selection.y,
        selection.width,
        selection.height,
      )
    }

    for (const key in state.canvas) {
      const cell = state.canvas[key]
      drawCell(cell)
    }
    return
  }

  for (const key in state.preview) {
    const cell = state.preview[key]
    clearCell(cell)
    drawCell(cell)
  }

  for (const key of state.dirtyCells) {
    const cell = state.canvas[key]
    clearCell(cell)
    drawCell(cell)
  }

  state.dirtyCells = []
}

export {
  initCanvas,
  makeCanvas as makeApi,
  draw,
  drawGrid,
  measureText,
  isOutOfBounds,
}
