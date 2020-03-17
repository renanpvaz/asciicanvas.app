import { Tool } from '../Tool'

const icon = `
  <svg x="0px" y="0px" viewBox="0 0 383.947 383.947" style="enable-background:new 0 0 383.947 383.947;">
      <polygon points="0,303.947 0,383.947 80,383.947 316.053,147.893 236.053,67.893 			"/>
      <path d="M377.707,56.053L327.893,6.24c-8.32-8.32-21.867-8.32-30.187,0l-39.04,39.04l80,80l39.04-39.04
        C386.027,77.92,386.027,64.373,377.707,56.053z"/>
  </svg>
`

export const Pencil: Tool = {
  name: 'pencil',
  icon,
  onPaint: ({ x, y, canvas }) => canvas.set(x, y),
}
