import { html } from './util'
import { Tool } from './Tool'
import { State } from './State'
import { Pencil } from './Tool/Pencil'
import { Line } from './Tool/Line'
import { Eraser } from './Tool/Eraser'
import { Fill } from './Tool/Fill'
import { Square } from './Tool/Square'

const tools: Tool<any>[] = [Pencil, Line, Eraser, Fill, Square]

const selectTool = ($el: HTMLButtonElement, tool: Tool, state: State) => {
  state.$toolRef?.classList.toggle('tool--active')
  $el.classList.toggle('tool--active')

  state.tool = tool
  state.$toolRef = $el

  if (!state.$toolRef) return

  const svg = state.$toolRef.firstElementChild
  const xml = new XMLSerializer().serializeToString(svg!)
  const svg64 = btoa(xml)

  document.querySelector(
    'canvas',
  )!.style.cursor = `url('${`data:image/svg+xml;base64,${svg64}`}'), auto`
}

const renderToolbar = (state: State) =>
  html('section', { className: 'toolbar' }, [
    ...tools.map(tool =>
      html('button', {
        className: 'tool',
        innerHTML: tool.icon,
        onclick: e => selectTool(<HTMLButtonElement>e.target, tool, state),
      }),
    ),
    html('footer', { className: 'toolbar-options' }, [
      html('input', {
        className: 'size-handle',
        value: '1',
        type: 'range',
        max: '10',
        min: '1',
        step: '1',
        onchange: e => (state.size = +(<HTMLInputElement>e.target).value),
      }),
    ]),
  ])

export { renderToolbar }
