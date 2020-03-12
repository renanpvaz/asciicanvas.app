import { CellMap } from './Cell'
import { State } from './State'

export type History = {
  undo: CellMap[]
  redo: CellMap[]
  updated: boolean
}

type EntryType = 'undo' | 'redo'

export type HistoryApi = {
  track: () => void
  back: () => void
  forward: () => void
}

const history = (state: State): HistoryApi => {
  const save = (type: EntryType) => {
    const entries = state.history[type]
    if (entries.length) {
      track(type === 'undo' ? 'redo' : 'undo')
      const entry = entries.pop()
      state.canvas = entry || {}
      state.history.updated = true
    }
  }

  const track = (type: EntryType) => {
    state.history[type].push({ ...state.canvas })
    state.history.updated = false
  }

  const back = () => save('undo')
  const forward = () => save('redo')

  return {
    track: () => {
      state.history.redo = []
      track('undo')
    },
    back,
    forward,
  }
}

export { history }
