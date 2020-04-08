import { Effect, HistoryBack, HistoryForward, CreateSelection } from './Effect'

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
    const $prev = document.querySelector('#text-edit')

    if ($prev) $prev.remove()

    let paste = (event.clipboardData || window.clipboardData)!.getData('text')

    put(
      CreateSelection({
        x: 0,
        y: 0,
        text: paste,
        editable: false,
        draggable: true,
      }),
    )

    event.preventDefault()
  })
}

export { registerShortcuts }
