import { State, getRealCoords } from './State'
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

const makeDraggable = (
  $el: HTMLElement,
  state: State,
  x?: number,
  y?: number,
) => {
  let active = false
  let currentX: number = x || 0
  let currentY: number = y || 0
  let initialX: number
  let initialY: number
  let xOffset = x || 0
  let yOffset = y || 0

  const isTouch = (e: TouchEvent | MouseEvent): e is TouchEvent =>
    e.type === 'touchmove' || e.type === 'touchstart'

  const setPosition = () => {
    const { x, y } = getRealCoords(currentX, currentY, state)

    $el.dataset.x = `${x}`
    $el.dataset.y = `${y}`
    $el.style.transform = `translate3d(${x * state.cellWidth}px, ${y *
      state.cellHeight}px, 0)`
  }

  const dragStart = (e: TouchEvent | MouseEvent) => {
    if (isTouch(e)) {
      initialX = e.touches[0].clientX - xOffset
      initialY = e.touches[0].clientY - yOffset
    } else {
      initialX = e.clientX - xOffset
      initialY = e.clientY - yOffset
    }

    if (e.target === $el) {
      active = true
    }
  }

  const dragEnd = () => {
    initialX = currentX
    initialY = currentY
    active = false
  }

  const drag = (e: TouchEvent | MouseEvent) => {
    if (active) {
      if (isTouch(e)) {
        currentX = e.touches[0].clientX - initialX
        currentY = e.touches[0].clientY - initialY
      } else {
        currentX = e.clientX - initialX
        currentY = e.clientY - initialY
      }

      xOffset = currentX
      yOffset = currentY
      setPosition()
    }
  }

  setPosition()

  $el.addEventListener('touchstart', dragStart, false)
  $el.addEventListener('touchend', dragEnd, false)
  document.addEventListener('touchmove', drag, false)

  $el.addEventListener('mousedown', dragStart, false)
  $el.addEventListener('mouseup', dragEnd, false)
  document.addEventListener('mousemove', drag, false)
}

export { html, htmlRaw, makeCursorFromSvg, isMobile, makeDraggable }
