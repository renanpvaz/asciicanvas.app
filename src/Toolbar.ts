import { html } from './util'
import { Tool } from './Tool'
import { State } from './State'
import { Pencil } from './Tool/Pencil'
import { Line } from './Tool/Line'
import { Eraser } from './Tool/Eraser'
import { Fill } from './Tool/Fill'
import { Square } from './Tool/Square'
import { Text } from './Tool/Text'

const tools: Tool<any>[] = [Pencil, Line, Eraser, Fill, Square, Text]

const renderToolbar = (state: State, ctx: CanvasRenderingContext2D) =>
  html('section', { className: 'toolbar' }, [
    ...tools.map(tool =>
      html('button', {
        className: 'tool',
        innerHTML: tool.icon,
        onclick: e => {
          const $el = <HTMLButtonElement>e.target

          state.$toolRef?.classList.toggle('tool--active')
          $el.classList.toggle('tool--active')

          state.tool = tool
          state.$toolRef = $el
          ctx.canvas.style.cursor = tool.cursor || 'default'
        },
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
