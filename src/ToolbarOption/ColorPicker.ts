import { ToolbarOption } from '../ToolbarOption'

export const ColorPicker: ToolbarOption = {
  name: 'colorPicker',
  type: 'option',
  render: state => {
    const $input = document.createElement('input')

    $input.className = 'tool'
    $input.type = 'color'
    $input.value = state.color

    $input.addEventListener('change', () => {
      state.color = $input.value
    })

    return $input
  },
}
