import { html, htmlRaw } from './util'
import { State, StateReady } from './State'
import { drawGrid, initCanvas } from './Canvas'
import { HistoryApi } from './History'
import { Effect, Export, CopyText, Share } from './Effect'

const renderCharInputOption = (option: string, state: State) =>
  html(
    'li',
    {
      className: 'menu-item char-input__option',
      onclick: () => {
        state.char = option
        ;(<HTMLInputElement>(
          document.querySelector('.char-input')
        )).value = option
        document.body.click()
      },
    },
    [html('span', {}, [option])],
  )

const newCanvas = ({
  state,
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
          state.width = width * state.cellWidth + 1
          state.height = height * state.cellHeight + 1
          state.canvas = {}
          state.dirtyCells = []
          state.history.updated = true

          const newCanvas = initCanvas({ state, put })

          document.querySelector('canvas')?.replaceWith(newCanvas)
          drawGrid(state)
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
          html('small', {}, [
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
  history,
  put,
}: {
  state: StateReady
  history: HistoryApi
  put: (eff: Effect) => void
}) =>
  html('header', { className: 'menu' }, [
    menuButton({
      text: 'file',
      items: [
        {
          text: 'new',
          shortcut: 'Cmd+N',
          onClick: () => newCanvas({ state, put }),
        },
        { text: 'share', onClick: () => put(Share()) },
        { text: 'copy', onClick: () => put(CopyText()) },
        {
          text: 'export',
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
        { text: 'Undo', shortcut: 'Cmd+Z', onClick: () => history.back() },
        {
          text: 'Redo',
          shortcut: 'Cmd+Shift+Z',
          onClick: () => history.forward(),
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
    // html('input', {
    //   className: 'menu-button char-input',
    //   value: '14',
    //   onchange: e => {
    //     const fontSize = +(<HTMLInputElement>e.target).value
    //     const { width, height } = measureText(fontSize)

    //     state.fontSize = fontSize
    //     state.cellWidth = width
    //     state.cellHeight = height
    //     state.history.updated = true

    //     drawGrid(state, context)
    //   },
    // }),
    html('button', { className: 'menu-container char-input-container' }, [
      html('input', {
        className: 'menu-button char-input',
        maxLength: 1,
        value: '$',
        onchange: e => (state.char = (<HTMLInputElement>e.target).value),
      }),
      html('ul', { className: 'menu-list' }, [
        ...['$', '@', '/', ';', '(', ')'].map(c =>
          renderCharInputOption(c, state),
        ),
      ]),
    ]),
    html('input', {
      className: 'menu-button color-picker',
      type: 'color',
      value: '#d238a8',
      onchange: e => (state.color = (<HTMLInputElement>e.target).value),
    }),
  ])

export { renderMenus }
