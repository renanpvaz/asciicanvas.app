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

export { html }
