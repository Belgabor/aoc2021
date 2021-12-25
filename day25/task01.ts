// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

type Spot = '.' | 'v' | '>'
type CucumberMap = Spot[][]

let cucumbers: CucumberMap = []

for (const line of lines) {
    cucumbers.push(<Spot[]>line.split(''))
}

const height = cucumbers.length
const width = cucumbers[0].length

function display(map: CucumberMap) {
    console.log('---')
    for (const line of map) {
        console.log(line.join(''))
    }
    console.log('---')
}

function next_x(x: number): number {
    return x < (width - 1) ? x + 1 : 0
}

function next_y(y: number): number {
    return y < (height - 1) ? y + 1 : 0
}

function newMap(): CucumberMap {
    return Array(height).fill([]).map(() => Array(width).fill('.'))
}

function step_x(map: CucumberMap): [number, CucumberMap] {
    let steps = 0
    const _map: CucumberMap = newMap()
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (map[y][x] === '>') {
                const x_next = next_x(x)
                if (map[y][x_next] === '.') {
                    _map[y][x] = '.'
                    _map[y][x_next] = '>'
                    x++
                    steps++
                    continue
                }
            }
            _map[y][x] = map[y][x]
        }
    }
    return [steps, _map]
}

function step_y(map: CucumberMap): [number, CucumberMap] {
    let steps = 0
    const _map: CucumberMap = newMap()
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (map[y][x] === 'v') {
                const y_next = next_y(y)
                if (map[y_next][x] === '.') {
                    _map[y][x] = '.'
                    _map[y_next][x] = 'v'
                    y++
                    steps++
                    continue
                }
            }
            _map[y][x] = map[y][x]
        }
    }
    return [steps, _map]
}

function step(map: CucumberMap): [number, CucumberMap] {
    const x = step_x(map)
    const y = step_y(x[1])

    return [x[0]+y[0], y[1]]
}

display(cucumbers)

let steps = 0
let new_steps = 0
while (true) {
    [new_steps, cucumbers] = step(cucumbers)
    steps++
    console.log(steps)
    //display(cucumbers)
    if (new_steps === 0) {
        break
    }
}

console.log('')
display(cucumbers)
