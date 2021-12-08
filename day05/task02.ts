// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

interface Vent {
    x1: number
    y1: number
    x2: number
    y2: number
}

const line_parser = (new RegExp(/^(?<x1>\d+),(?<y1>\d+) -> (?<x2>\d+),(?<y2>\d+)$/))
const vents: Vent[] = []
let max_x = 0
let max_y = 0

function dump_matrix() {
    for (const row of matrix) {
        let row_str = ''
        for (const col of row) {
            row_str += col === 0 ? '.' : (col > 9 ? 'X' : col)
        }
        console.log(row_str)
    }
    
}

for (const line of lines) {
    const match = line_parser.exec(line)
    if (!match) {
        console.log('?')
        Deno.exit()
    }

    const vent: Vent = {
        x1: parseInt(match.groups?.x1 ?? '-1'),
        y1: parseInt(match.groups?.y1 ?? '-1'),
        x2: parseInt(match.groups?.x2 ?? '-1'),
        y2: parseInt(match.groups?.y2 ?? '-1'),
    }

    max_x = Math.max(max_x, vent.x1, vent.x2)
    max_y = Math.max(max_y, vent.y1, vent.y2)

    vents.push(vent)
}

console.log(vents)

const matrix: number[][] = Array(max_y + 1).fill([]).map(() => Array(max_x + 1).fill(0))

for (const vent of vents) {
    console.log(vent)
    const x_min = Math.min(vent.x1, vent.x2)
    const x_max = Math.max(vent.x1, vent.x2)
    const y_min = Math.min(vent.y1, vent.y2)
    const y_max = Math.max(vent.y1, vent.y2)

    if (vent.x1 !== vent.x2 && vent.y1 !== vent.y2) {
        const steps = x_max - x_min
        let pos_x = vent.x1
        let pos_y = vent.y1
        const step_x = vent.x2 > vent.x1 ? 1 : -1
        const step_y = vent.y2 > vent.y1 ? 1 : -1
        matrix[pos_y][pos_x]++
        for (let index = 0; index < steps; index++) {
            pos_x += step_x
            pos_y += step_y
            matrix[pos_y][pos_x]++            
        }
    } else {
        for (let x = x_min; x <= x_max; x++) {
            for (let y = y_min; y <= y_max; y++) {
                matrix[y][x]++
            }
        }
    }
}

let hotspots = 0
for (const row of matrix) {
    for (const col of row) {
        if (col > 1) {
            hotspots++
        }
    }
}

dump_matrix()
console.log(hotspots)