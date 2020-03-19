import { State } from './State'
import { Canvas } from './Canvas'
import { Pencil } from './Tool/Pencil'
import { Fill } from './Tool/Fill'
import { Eraser } from './Tool/Eraser'
import { Line } from './Tool/Line'
import { Square } from './Tool/Square'

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

export const tools: Tool<any>[] = [Pencil, Line, Eraser, Fill, Square]
