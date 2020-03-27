import { State } from './State'
import { Canvas } from './Canvas'

const html = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Partial<Omit<HTMLElementTagNameMap[K], 'style'>> & {
    style?: Partial<CSSStyleDeclaration>
  },
  children?: (HTMLElement | string)[],
): HTMLElementTagNameMap[K] => {
  const $el = document.createElement(tag)
  const { style = {}, ...attrs } = attributes

  Object.assign($el.style, style)
  Object.assign($el, attrs)
  children?.forEach(c =>
    $el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c),
  )

  return $el
}

const htmlRaw = (raw: string): HTMLElement =>
  html('div', { innerHTML: raw }).firstElementChild as HTMLElement

const makeCursorFromSvg = (rawSvg: string) => {
  const svg = htmlRaw(rawSvg)
  const xml = new XMLSerializer().serializeToString(svg!)
  const svg64 = btoa(xml)

  return `url('${`data:image/svg+xml;base64,${svg64}`}'), auto`
}

const isMobile = () => window.innerWidth < 767

const createSelection = ({
  x,
  y,
  text = '',
  state,
  canvas,
}: {
  x: number
  y: number
  text?: string
  state: State
  canvas: Canvas
}) => {
  const $el = html('pre', {
    id: 'text-edit',
    contentEditable: 'true',
    style: {
      position: 'absolute',
      top: `${y * state.cellHeight + 32}px`,
      left: `${x * state.cellWidth + 58}px`,
      fontSize: `${state.fontSize}px`,
      fontFamily: 'monospace',
      zIndex: '1',
      padding: '0',
      background: 'white',
      border: '0',
      margin: '0',
      lineHeight: '1',
      outline: '2px dashed #03A9F4',
    },
    textContent: text,
    onkeyup: e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        document.body.removeChild($el)
        const text = $el.textContent || ''

        text.split('\n').forEach((line, yOffset) => {
          line.split('').forEach((char, xOffset) => {
            canvas.set(x + xOffset - 1, y + yOffset, char)
          })
        })
      }
    },
  })

  document.body.appendChild($el)
  $el.focus()
}

export { html, htmlRaw, makeCursorFromSvg, isMobile, createSelection }
