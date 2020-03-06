export type Cell =
  | { x: number; y: number; value: null; color: null }
  | { x: number; y: number; value: string; color: string }

export type CellMap = { [key: string]: Cell }
