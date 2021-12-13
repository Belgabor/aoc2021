// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const line_parser = (new RegExp(/^fold along (?<axis>[x,y])=(?<at>\d+)$/))

interface Dot {
    x: number
    y: number
}

interface Fold {
    axis: 'x' | 'y'
    at: number
}

let x_max = 0
let y_max = 0

const dots: Dot[] = []
const folds: Fold[] = []
let state = false

for (const line of lines) {
    if (line === '') {
        state = true
        continue
    }

    if (state) {
        const parsed = line_parser.exec(line)
        if (!parsed) {
            console.log('error')
            Deno.exit()
        }

        folds.push({
            axis: <Fold['axis']>parsed?.groups?.axis,
            at: parseInt(parsed?.groups?.at ?? '0')
        })
    } else {
        const [x, y] = line.split(',', 2).map(el => parseInt(el))
        x_max = Math.max(x_max, x)
        y_max = Math.max(y_max, y)
        dots.push({ x, y })
    }
}

console.log(x_max, y_max, dots, folds)

const matrix: boolean[][] = []

for (let y = 0; y <= y_max; y++) {
    matrix.push(Array(x_max + 1).fill(false))
}

for (const dot of dots) {
    matrix[dot.y][dot.x] = true
}

function fold_y(at: number) {
    for (let y = at + 1; y <= y_max; y++) {
        for (let x = 0; x <= x_max; x++) {
            if (matrix[y][x]) {
                matrix[at + (at - y)][x] = true
            }
        }
    }
    y_max = at - 1
}

function fold_x(at: number) {
    for (let x = at + 1; x <= x_max; x++) {
        for (let y = 0; y <= y_max; y++) {
            if (matrix[y][x]) {
                matrix[y][at + (at - x)] = true
            }
        }
    }
    x_max = at - 1
}

function fold_it(fold: Fold) {
    if (fold.axis === 'x') {
        fold_x(fold.at)
    } else {
        fold_y(fold.at)
    }
}

function visualize() {
    for (let y = 0; y <= y_max; y++) {
        let line = ''
        for (let x = 0; x <= x_max; x++) {
            if (matrix[y][x]) {
                line += '*'
            } else {
                line += ' '
            }
        }
        console.log(line)
    }
}

for (const fold of folds) {
    fold_it(fold)
}

visualize()