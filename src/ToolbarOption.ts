import { State } from './State'
import { Canvas } from './Canvas'

type ToolEventHandler = (
  e: MouseEvent,
  refs: {
    state: State
    canvas: Canvas
  },
) => void

export type ToolbarOption = {
  name: string
  type: 'tool' | 'option'
  render: (state: State, context: CanvasRenderingContext2D) => HTMLElement
  onMouseDown?: ToolEventHandler
  onMouseUp?: ToolEventHandler
  onMouseMove?: ToolEventHandler
  onClick?: ToolEventHandler
}
