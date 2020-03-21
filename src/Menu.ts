import { html } from './util'

// <header class="menu">
//     <button class="menu-button" id="stop">stop</button>
//     <button class="menu-button" id="start">start</button>
//     <button class="menu-button" id="loop">loop</button>
//     <button class="menu-button" id="export">export</button>
//     <input
//     class="menu-button char-input"
//     id="char"
//     type="text"
//     maxlength="1"
//     value="$"
//     />
//     <input
//     class="menu-button color-picker"
//     id="color"
//     type="color"
//     value="#d238a8"
//     />
// </header>

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

const renderMenus = () =>
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
    }),
  ])

export { renderMenus }
