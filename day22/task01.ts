// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const test = true
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

interface Step {
    set: boolean,
    x: [number, number],
    y: [number, number],
    z: [number, number],
}

const line_parser = new RegExp(/^(?<switch>on|off) x=(?<x_min>-?\d+)\.\.(?<x_max>-?\d+),y=(?<y_min>-?\d+)\.\.(?<y_max>-?\d+),z=(?<z_min>-?\d+)\.\.(?<z_max>-?\d+)$/)

const steps: Step[] = []

for (const line of lines) {
    const match = line_parser.exec(line)
    if (!match || !match.groups) {
        console.log('?')
        Deno.exit()
        break
    }

    const step: Step = {
        set: match.groups.switch === 'on',
        x: [parseInt(match.groups.x_min), parseInt(match.groups.x_max)],
        y: [parseInt(match.groups.y_min), parseInt(match.groups.y_max)],
        z: [parseInt(match.groups.z_min), parseInt(match.groups.z_max)],
    }

    steps.push(step)
}

console.log(steps)

const matrix: Record<number, Record<number, Record<number, boolean>>> = {}

function get_cubit(x: number, y: number, z: number): boolean {
    return matrix[x]?.[y]?.[z] ?? false
}

function set_cubit(x: number, y: number, z: number, to: boolean) {
    if (!to && !get_cubit(x, y, z)) {
        return
    }

    if (matrix[x] === undefined) {
        matrix[x] = {}
    }
    if (matrix[x][y] === undefined) {
        matrix[x][y] = {}
    }
    matrix[x][y][z] = to
}

function get_bounds(keys: string[]): [number, number] {
    const mapped = keys.map(key => parseInt(key))
    return [Math.min(...mapped), Math.max(...mapped)]
}

function evaluate(): number {
    let count = 0
    const [x_min, x_max] = get_bounds(Object.keys(matrix))
    for (let x = x_min; x <= x_max; x++) {
        if (matrix[x] === undefined) {
            continue
        }
        const [y_min, y_max] = get_bounds(Object.keys(matrix[x]))
        for (let y = y_min; y <= y_max; y++) {
            if (matrix[x][y] === undefined) {
                continue
            }
            const [z_min, z_max] = get_bounds(Object.keys(matrix[x][y]))
            for (let z = z_min; z <= z_max; z++) {
                if (get_cubit(x, y, z)) {
                    count++
                }
            }
        }
    }
    return count
}

for (const step of steps) {
    for (let x = Math.max(step.x[0], -50); x <= Math.min(step.x[1], 50); x++) {
        for (let y = Math.max(step.y[0], -50); y <= Math.min(step.y[1], 50); y++) {
            for (let z = Math.max(step.z[0], -50); z <= Math.min(step.z[1], 50); z++) {
                set_cubit(x,y,z,step.set)
            }
        }
    }
}

console.log(evaluate())