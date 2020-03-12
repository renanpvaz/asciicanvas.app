import { State } from './State'
import { Canvas } from './Canvas'
import { Pencil } from './Tool/Pencil'
import { Fill } from './Tool/Fill'
import { Eraser } from './Tool/Eraser'
import { Brush } from './Tool/Brush'
import { Line } from './Tool/Line'

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
  onPaint: ToolEventHandler<S>
  onPointerUp?: ToolEventHandler<S>
  onPointerDown?: ToolEventHandler<S>
  state: S
}

export type Tool<S = null> = S extends null
  ? Omit<ToolOptions<null>, 'state'>
  : ToolOptions<S>

export const tools = [Pencil, Line, Brush, Eraser, Fill]
