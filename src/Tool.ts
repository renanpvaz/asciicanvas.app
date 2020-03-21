import { State } from './State'
import { Canvas } from './Canvas'

type ToolEventHandler<S> = (
  context: {
    state: State
    canvas: Canvas
    x: number
    y: number
  },
  localState: S,
) => void

type ToolOptions<S> = {
  name: string
  icon: string
  sizeable?: boolean
  onPaint: ToolEventHandler<S>
  onPointerUp?: ToolEventHandler<S>
  onPointerDown?: ToolEventHandler<S>
}

export type Tool<S = null> = ToolOptions<S> &
  (S extends null ? { state?: null } : { state: S })
