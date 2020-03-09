import { CellMap } from './Cell'
import { State } from './State'

export type Layer = {
  id: string
  data: CellMap
  active: boolean
  dirtyCells: string[]
}

const addLayer = (state: State): string => {
  const id = `${Date.now()}`

  state.layers[id] = {
    id,
    data: {},
    active: true,
    dirtyCells: [],
  }

  return id
}

export { addLayer }
