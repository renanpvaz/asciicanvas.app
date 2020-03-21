import { History } from './History'
import { CellMap } from './Cell'
import { Tool } from './Tool'
import { Pencil } from './Tool/Pencil'

export type State = {
  pressing: boolean
  canvas: CellMap
  preview: CellMap
  cellWidth: number
  cellHeight: number
  char: string
  color: string
  selectedTool: string
  dirtyCells: string[]
  history: History
  keys: { [key: string]: boolean }
  tool: Tool<any>
  $toolRef: HTMLButtonElement | null
  size: number | null
  fontSize: number
}

export const getRealCoords = (x: number, y: number, state: State) => ({
  x: Math.floor(x / state.cellWidth),
  y: Math.floor(y / state.cellHeight),
})

export const initialState: State = {
  pressing: false,
  canvas: {},
  preview: {},
  cellHeight: 0,
  cellWidth: 0,
  char: '$',
  color: '#d238a8',
  selectedTool: 'pencil',
  dirtyCells: [],
  history: {
    undo: [],
    redo: [],
    updated: false,
  },
  keys: {},
  tool: Pencil,
  $toolRef: null,
  size: 1,
  fontSize: 14,
}
