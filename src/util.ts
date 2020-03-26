const html = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Partial<Omit<HTMLElementTagNameMap[K], 'style'>> & {
    style?: Partial<CSSStyleDeclaration>
  },
  children?: (HTMLElement | string)[],
): HTMLElementTagNameMap[K] => {
  const $el = document.createElement(tag)
  const { style = {}, ...attrs } = attributes

  for (let prop in style) {
    $el.style.setProperty(prop, style[prop]!)
  }

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

export { html, htmlRaw, makeCursorFromSvg, isMobile }
