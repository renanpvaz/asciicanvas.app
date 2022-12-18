import { Effect, HistoryBack, HistoryForward, PasteText } from './Effect'

type Shortcut = {
  shift: boolean
  key: string
  effect: (_: void) => Effect
}

const shortcuts: Shortcut[] = [
  { shift: false, key: 'z', effect: HistoryBack },
  { shift: true, key: 'z', effect: HistoryForward },
]

const registerShortcuts = ({ put }: { put: (_: Effect) => void }) => {
  document.addEventListener('keydown', e => {
    const shortcut = shortcuts.find(
      s =>
        s.key === e.key && (e.ctrlKey || e.metaKey) && s.shift === e.shiftKey,
    )

    if (shortcut) {
      e.preventDefault()
      put(shortcut.effect())
    }
  })

  document.addEventListener('paste', event => {
    put(PasteText(event))
  })
}

export { registerShortcuts }
