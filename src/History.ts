import { CellMap, Cell } from './Cell'
import { State } from './State'

export type History = {
  undo: CellMap[]
  redo: CellMap[]
  index: number
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
    }
  }

  const track = (type: EntryType) => {
    state.history[type].push({ ...state.canvas })
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
