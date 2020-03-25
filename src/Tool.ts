import { State } from './State'
import { Canvas } from './Canvas'
import { htmlRaw } from './util'

type ToolEventHandler<T, S> = (
  context: {
    state: State
    canvas: Canvas
  } & T,
  localState: S,
) => void

type ToolMouseEventHandler<S> = ToolEventHandler<{ x: number; y: number }, S>

type ToolOptions<S> = {
  name: string
  icon: { x: number; y: number }
  cursor?: string
  sizeable?: boolean
  onPaint?: ToolMouseEventHandler<S>
  onPointerUp?: ToolMouseEventHandler<S>
  onPointerDown?: ToolMouseEventHandler<S>
}

export type Tool<S = null> = ToolOptions<S> &
  (S extends null ? { state?: null } : { state: S })
