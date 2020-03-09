import { History } from './History'
import { CellMap } from './Cell'
import { Layer } from './Layer'

export type Tool = 'pencil'

export type State = {
  drawing: boolean
  canvas: CellMap
  layers: { [id: string]: Layer }
  cellWidth: number
  cellHeight: number
  char: string
  color: string
  selectedTool: string
  dirtyCells: string[]
  history: History
  keys: { [key: string]: boolean }
}

export const getRealCoords = (e: MouseEvent, state: State) => ({
  x: Math.round(e.x / state.cellWidth) * state.cellWidth,
  y: Math.round(e.y / state.cellHeight) * state.cellHeight,
})

export const initialState: State = {
  drawing: false,
  canvas: {},
  layers: {},
  cellHeight: 0,
  cellWidth: 0,
  char: '$',
  color: 'black',
  selectedTool: 'pencil',
  dirtyCells: [],
  history: {
    undo: [],
    redo: [],
    updated: false,
  },
  keys: {},
}
