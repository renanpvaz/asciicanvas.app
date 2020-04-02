import { html, isMobile } from './util'
import { Tool } from './Tool'
import { State } from './State'
import { Pencil } from './Tool/Pencil'
import { Line } from './Tool/Line'
import { Eraser } from './Tool/Eraser'
import { Fill } from './Tool/Fill'
import { Rectangle } from './Tool/Rectangle'
import { Text } from './Tool/Text'
import { Selection } from './Tool/Selection'
import { Ellipse } from './Tool/Ellipse'
import { Effect, SelectTool } from './Effect'

const tools: Tool<any>[] = [
  Pencil,
  Eraser,
  Fill,
  Text,
  Line,
  Rectangle,
  Ellipse,
  Selection,
]

const renderToolbar = ({
  state,
  put,
}: {
  state: State
  put: (_: Effect) => void
}) =>
  html('section', { className: 'toolbar' }, [
    ...tools.map(tool =>
      html(
        'button',
        {
          className: 'tool',
          onclick: e => {
            put(SelectTool({ $el: <HTMLButtonElement>e.target, tool }))
          },
        },
        [html('img', { src: tool.icon, style: { pointerEvents: 'none' } })],
      ),
    ),
    html('footer', { className: 'toolbar-options' }, [
      isMobile()
        ? ''
        : html('input', {
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
