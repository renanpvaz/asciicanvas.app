import { html, htmlRaw, query } from './util'
import { State, StateReady } from './State'
import {
  Effect,
  Export,
  CopyText,
  Share,
  OpenFile,
  NewCanvas,
  UpdateFontSize,
} from './Effect'

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
const leaderKey = isMac ? '⌘' : 'Ctrl'

const renderCharInputOption = (option: string, state: State) =>
  html(
    'li',
    {
      className: 'menu-item char-input__option',
      onclick: () => {
        state.char = option
        ;(<HTMLInputElement>query('font-size-input')).value = option
        document.body.click()
      },
    },
    [html('span', {}, [option])],
  )

const newCanvasDialog = ({
  put,
}: {
  state: StateReady
  put: (_: Effect) => void
}) => {
  let width: number, height: number
  const $el = html('div', { className: 'box dialog' }, [
    html(
      'form',
      {
        onsubmit: (e: Event) => {
          e.preventDefault()
          put(NewCanvas({ width, height }))
          document.body.removeChild($el)
        },
      },
      [
        html('div', { className: 'dialog__content' }, [
          html('label', { className: 'field' }, [
            'Row size',
            html('input', {
              className: 'input',
              onchange: e => (width = +(<HTMLInputElement>e.target).value),
            }),
          ]),
          html('label', { className: 'field' }, [
            'Column size',
            html('input', {
              className: 'input',
              onchange: e => (height = +(<HTMLInputElement>e.target).value),
            }),
          ]),
        ]),
        html('button', { className: 'button', type: 'submit' }, ['start']),
      ],
    ),
  ])

  document.body.appendChild($el)
}

type Menu = {
  text: string
  shortcut?: string
  items?: Menu[]
  onClick?: (e: MouseEvent) => void
}

const arrowIcon = htmlRaw(`
<svg width="10" height="11" viewBox="0 0 10 11" style="display:inline-block;vertical-align:middle">
  <path d="M7.5 4.33L0 8.66L0 0z"></path>
</svg>
`)

const menuList = (items: Menu[]): HTMLUListElement =>
  html('ul', { className: 'menu-list' }, [
    ...items.map(item =>
      html(
        'li',
        {
          className: 'menu-item menu-container',
          onclick: item.onClick,
        },
        [
          html('span', {}, [item.text]),
          html('kbd', { className: 'menu-item__shortcut' }, [
            item.shortcut || '',
            item.items?.length ? arrowIcon : '',
          ]),
          item.items?.length ? menuList(item.items) : '',
        ],
      ),
    ),
  ])

const menuButton = ({ text, items = [] }: Menu) =>
  html('button', { className: 'menu-button menu-container' }, [
    text,
    menuList(items),
  ])

const renderMenus = ({
  state,
  put,
}: {
  state: StateReady
  put: (eff: Effect) => void
}) =>
  html('header', { className: 'menu' }, [
    menuButton({
      text: 'file',
      items: [
        {
          text: 'New',
          shortcut: `${leaderKey}+n`,
          onClick: () => newCanvasDialog({ state, put }),
        },
        {
          text: 'Open',
          onClick: () => put(OpenFile()),
        },
        { text: 'Share', onClick: () => put(Share()) },
        { text: 'Copy to clipboard', onClick: () => put(CopyText()) },
        {
          text: 'Export file',
          items: [
            { text: 'Text (.txt)', onClick: () => put(Export('text')) },
            { text: 'Image (.png)', onClick: () => put(Export('img')) },
          ],
        },
      ],
    }),
    menuButton({
      text: 'edit',
      items: [
        {
          text: 'Undo',
          shortcut: `${leaderKey}+z`,
          onClick: () => history.back(),
        },
        {
          text: 'Redo',
          shortcut: `${leaderKey}+Shift+z`,
          onClick: () => history.forward(),
        },
        {
          text: 'Paste',
          shortcut: `${leaderKey}+v`,
          onClick: () => {
            state.canvas = {}
            state.history.updated = true
          },
        },
        {
          text: 'Clear',
          onClick: () => {
            state.canvas = {}
            state.history.updated = true
          },
        },
      ],
    }),
    html('div', { className: 'menu-options' }, [
      html('input', {
        className: 'menu-button char-input',
        style: {
          width: '40px',
        },
        type: 'number',
        value: '14',
        onchange: e => {
          const fontSize = +(<HTMLInputElement>e.target).value
          put(UpdateFontSize(fontSize))
        },
      }),
      html(
        'button',
        { className: 'menu-button menu-container char-input-container' },
        [
          html('input', {
            className: 'menu-button char-input js-font-size-input',
            maxLength: 1,
            value: '$',
            onchange: e => (state.char = (<HTMLInputElement>e.target).value),
          }),
          html('ul', { className: 'menu-list' }, [
            ...['@', 'K', 'O', '(', ':', "'", '.', '_'].map(c =>
              renderCharInputOption(c, state),
            ),
          ]),
        ],
      ),
      html('input', {
        className: 'menu-button color-picker',
        type: 'color',
        value: '#d238a8',
        onchange: e => (state.color = (<HTMLInputElement>e.target).value),
      }),
    ]),
  ])

export { renderMenus }
