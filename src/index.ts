import { initialState } from './State'
import { draw, initCanvas, makeApi, drawGrid, measureText } from './Canvas'
import { renderToolbar } from './Toolbar'
import { renderMenus } from './Menu'
import { Effect, NewCanvas } from './Effect'
import { html, isMobile } from './util'
import { registerShortcuts } from './Shortcut'

const state = initialState

const put = (eff: Effect) => {
  if (state.state === 'ready') eff({ state, canvas: makeApi(state), put })
}

const $canvas = initCanvas({ state, put })

const init = () => {
  if (state.state !== 'ready') return

  document.body.appendChild(
    html('main', {}, [
      renderMenus({ state, put }),
      html('div', { className: 'content' }, [
        renderToolbar({ state, put }),
        html('div', { className: 'canvas-container' }, [$canvas]),
        isMobile()
          ? html('div', { className: 'size-handle-wrapper' }, [
              html('input', {
                className: 'size-handle',
                value: '1',
                type: 'range',
                max: '10',
                min: '1',
                step: '1',
                onchange: e =>
                  (state.size = +(<HTMLInputElement>e.target).value),
              }),
            ])
          : '',
      ]),
    ]),
  )
  ;(<HTMLButtonElement>document.querySelector('.tool')).click()

  registerShortcuts({ put })

  const { width, height } = measureText(state.fontSize)

  state.cellWidth = width
  state.cellHeight = height

  drawGrid(state)
  loop()
}

const loop = () => {
  if (state.state !== 'ready') return

  draw(state)
  requestAnimationFrame(loop)
}

document.addEventListener('DOMContentLoaded', init)
