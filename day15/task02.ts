// deno-lint-ignore-file camelcase ban-unused-ignore
/**
 * Dijkstra's Algorithm
 */
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const _matrix: number[][] = []

function clamp(val: number): number {
    return val > 9 ? val - 9 : val
}

function add_to_array(array: number[], value: number): number[] {
    return array.map(val => clamp(val + value))
}

for (const line of lines) {
    const _elements = line.split('').map(n => parseInt(n))
    const elements = [
        ..._elements,
        ...add_to_array(_elements, 1),
        ...add_to_array(_elements, 2),
        ...add_to_array(_elements, 3),
        ...add_to_array(_elements, 4),
    ]

    _matrix.push(elements)
}

const matrix: number[][] = [
    ..._matrix,
]

const source_height = _matrix.length

for (let index = source_height; index < source_height * 5; index++) {
    const source = index % source_height
    const add = Math.floor(index / source_height)
    matrix.push(add_to_array(_matrix[source], add))
}

const costs: number[][] = []
const visited: boolean[][] = []

const height = matrix.length
const width = matrix[0].length
const all = width * height

for (let y = 0; y < height; y++) {
    costs.push(Array(width).fill(-1))
    visited.push(Array(height).fill(false))
}

console.log(matrix, width, height)

let current_x = 0
let current_y = 0
costs[0][0] = 0

function evaluate(x: number, y: number, current_distance: number) {
    if (x < 0 || y < 0 || x >= width || y >= height || visited[y][x]) {
        return
    }

    const distance = current_distance + matrix[y][x]

    if (costs[y][x] === -1 || costs[y][x] > distance) {
        costs[y][x] = distance
    }
}

function find_next(): boolean {
    let found_something = false
    let found_minimum = 9999999999999
    let found_x = 0
    let found_y = 0
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (visited[y][x] || costs[y][x] === -1) {
                continue
            }

            const cost = costs[y][x]
            if (cost < found_minimum) {
                found_something = true
                found_minimum = cost
                found_x = x
                found_y = y
            }
        }
    }

    if (found_something) {
        current_x = found_x
        current_y = found_y
        return true
    }
    return false
}

let iterations = 0
function iterate(): boolean {
    const cost = costs[current_y][current_x]
    evaluate(current_x - 1, current_y, cost)
    evaluate(current_x + 1, current_y, cost)
    evaluate(current_x, current_y - 1, cost)
    evaluate(current_x, current_y + 1, cost)

    visited[current_y][current_x] = true

    if (current_y === height-1 && current_x === width-1) {
        return false
    }
    iterations++
    console.log(iterations, all)

    return find_next()
}

while (iterate()) {
    // Fine
}

console.log(costs[height - 1][width - 1])