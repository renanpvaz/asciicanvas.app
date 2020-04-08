import { CellMap } from './CellMap'
import { State } from './State'

export type History = {
  undo: CellMap[]
  redo: CellMap[]
  updated: boolean
}

type EntryType = 'undo' | 'redo'

const commit = (type: EntryType, state: State): void => {
  const entries = state.history[type]

  if (entries.length) {
    track(type === 'undo' ? 'redo' : 'undo', state)
    const entry = entries.pop()
    state.history.updated = true
    state.canvas = entry || state.canvas
  }
}

const track = (type: EntryType, state: State) => {
  state.history[type].push({ ...state.canvas })
  state.history.updated = false
}

const back = (state: State) => commit('undo', state)
const forward = (state: State) => commit('redo', state)

const push = (state: State) => {
  state.history.redo = []
  track('undo', state)
}

export { back, forward, push }
