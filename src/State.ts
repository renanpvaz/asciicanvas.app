import { History } from './History'
import { CellMap } from './Cell'
import { Tool } from './Tool'
import { Pencil } from './Tool/Pencil'
import { key } from './Canvas'

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
  width: number
  height: number
}

export const getRealCoords = (x: number, y: number, state: State) => ({
  x: Math.floor(x / state.cellWidth),
  y: Math.floor(y / state.cellHeight),
})

export const canvasToString = (state: State) => {
  let text = ''

  for (let y = 0; y < state.height; y++) {
    for (let x = 0; x < state.width; x++) {
      const cell = state.canvas[key(x, y)]
      text += cell?.value || ' '
    }
    text += '\n'
  }

  return text
}

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
  fontSize: 12,
  width: 1000,
  height: 843,
}
