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
  renderToolBarOption: (state: State) => HTMLElement
  onMouseDown?: ToolEventHandler
  onMouseUp?: ToolEventHandler
  onMouseMove?: ToolEventHandler
  onClick?: ToolEventHandler
}
