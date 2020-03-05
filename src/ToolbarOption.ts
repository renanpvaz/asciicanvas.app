import { State } from '.'

type ToolEventHandler = (
  e: MouseEvent,
  refs: {
    state: State
    context: CanvasRenderingContext2D
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
