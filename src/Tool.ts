import { State } from './State'
import { Canvas } from './Canvas'
import { Effect } from './Effect'

type ToolEventHandler<T> = (
  context: {
    state: State
    canvas: Canvas
    put: (eff: Effect) => void
  } & T,
) => void

type ToolMouseEventHandler = ToolEventHandler<{ x: number; y: number }>

export type Tool<S = {}> = Readonly<{
  name: string
  icon: string
  cursor?: string
  sizeable?: boolean
  onPaint: ToolMouseEventHandler
  onPointerUp: ToolMouseEventHandler
  onPointerDown: ToolMouseEventHandler
  behavior: 'drag' | 'press' | 'both'
}> &
  S
