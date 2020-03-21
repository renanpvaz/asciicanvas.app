import { html } from './util'
import { State } from './State'

const exportAsImg = () => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    document.querySelector('canvas')!.toDataURL('image/png'),
  )
  element.setAttribute('download', 'untitled.png')

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const renderMenus = (state: State) =>
  html('header', { className: 'menu' }, [
    html('button', { className: 'menu-button', onclick: exportAsImg }, [
      'export',
    ]),
    html('input', {
      className: 'menu-button char-input',
      maxLength: 1,
      value: '$',
    }),
    html('input', {
      className: 'menu-button color-picker',
      type: 'color',
      value: '#d238a8',
      onchange: e => (state.color = (<HTMLInputElement>e.target).value),
    }),
  ])

export { renderMenus }
