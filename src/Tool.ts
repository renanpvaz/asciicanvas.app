import { State } from './State'
import { Canvas } from './Canvas'
import { HistoryApi } from './History'

type ToolEventHandler = (
  e: MouseEvent,
  refs: {
    state: State
    canvas: Canvas
    history: HistoryApi
  },
) => void

export type Tool = {
  name: string
  render: (state: State, context: CanvasRenderingContext2D) => HTMLElement
  onMouseDown?: ToolEventHandler
  onMouseUp?: ToolEventHandler
  onMouseMove?: ToolEventHandler
  onClick?: ToolEventHandler
}
