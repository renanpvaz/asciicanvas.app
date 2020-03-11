import { State } from './State'
import { Canvas } from './Canvas'

type ToolEventHandler = (context: {
  state: State
  canvas: Canvas
  x: number
  y: number
}) => void

export type Tool = {
  name: string
  icon: string
  onPaint: ToolEventHandler
  onPointerUp?: ToolEventHandler
  onPointerDown?: ToolEventHandler
}
