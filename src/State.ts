export type Cell = { value: string; color: string; x: number; y: number }
export type Tool = 'pencil'
export type State = {
  drawing: boolean
  canvas: { [key: string]: Cell }
  cellWidth: number
  cellHeight: number
  char: string
  color: string
  selectedTool: string
  dirtyCells: string[]
}

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
