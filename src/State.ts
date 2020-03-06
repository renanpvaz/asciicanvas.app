export type Cell = { value?: string; color?: string; x: number; y: number }
export type Tool = 'pencil'
export type CellMap = { [key: string]: Cell }
export type State = {
  drawing: boolean
  canvas: CellMap
  cellWidth: number
  cellHeight: number
  char: string
  color: string
  selectedTool: string
  dirtyCells: string[]
}

export const getRealCoords = (e: MouseEvent, state: State) => ({
  x: Math.round(e.x / state.cellWidth) * state.cellWidth,
  y: Math.round(e.y / state.cellHeight) * state.cellHeight,
})

export const initialState: State = {
  drawing: false,
  canvas: {},
  cellHeight: 0,
  cellWidth: 0,
  char: '$',
  color: 'black',
  selectedTool: 'pencil',
  dirtyCells: [],
}
