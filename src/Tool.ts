import { State } from './State'
import { Canvas } from './Canvas'
import { Effect } from './Effect'

type ToolEventHandler<T, S> = (
  context: {
    state: State
    canvas: Canvas
    put: (eff: Effect) => void
  } & T,
  localState: S,
) => void

type ToolMouseEventHandler<S> = ToolEventHandler<{ x: number; y: number }, S>

type ToolOptions<S> = {
  name: string
  icon: string
  cursor?: string
  sizeable?: boolean
  onPaint?: ToolMouseEventHandler<S>
  onPointerUp?: ToolMouseEventHandler<S>
  onPointerDown?: ToolMouseEventHandler<S>
  behavior: 'drag' | 'press' | 'both'
}

export type Tool<S = null> = ToolOptions<S> &
  (S extends null ? { state?: null } : { state: S })
