export type Cell = { x: number; y: number; value?: string; color?: string }

export type CellMap = { [key: string]: Cell }

const key = (x: number, y: number) => `${x},${y}`

const get = (x: number, y: number, map: CellMap): Cell =>
  map[key(x, y)] || { x, y }

const set = (cell: Cell, map: CellMap): CellMap => {
  const k = key(cell.x, cell.y)

  if (k in map) Object.assign(map[k], cell)
  else map[k] = cell

  return map
}

const neighbors = ({ x, y }: Cell): Cell[] => [
  { x: x + 1, y },
  { x: x - 1, y },
  { x, y: y + 1 },
  { x, y: y - 1 },
]

const getNNeighbors = (radius: number, center: Cell) => {
  if (radius === 1) return [center]
  if (radius === 2) return [center, ...neighbors(center)]

  const cells: Cell[] = []
  const { sin, acos } = Math

  for (let x = center.x - radius; x < center.x + radius; x++) {
    const yspan = radius * sin(acos((center.x - x) / radius)) * 0.5
    for (let y = center.y - yspan; y < center.y + yspan; y++) {
      cells.push({ x, y: Math.round(y) })
    }
  }

  return cells
}

export { key, get, set, neighbors, getNNeighbors }
