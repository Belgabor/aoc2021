// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const test = false
const data = await Deno.readTextFile(test?'./test_data.txt':'./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const state: number[][] = []

for (const line of lines) {
    state.push(line.split('').map(char => parseInt(char)))
}

const iterations = 100
let flashes = 0

function get(x: number, y: number): number {
    return state[y][x]
}

function set(x: number, y: number, value: number) {
    state[y][x] = value
}

function process_flash(x: number, y: number) {
    if (x < 0 || y < 0 || x>9 || y>9) {
        return
    }

    let val = get(x, y)
    if (val === 0) {
        return
    }

    val += 1
    if (val >= 10) {
        flash(x, y)
    } else {
        set(x, y, val)
    }
}

function flash(x: number, y: number) {
    set(x, y, 0)
    flashes++

    process_flash(x-1, y-1)
    process_flash(x, y-1)
    process_flash(x+1, y-1)
    process_flash(x-1, y)
    process_flash(x+1, y)
    process_flash(x-1, y+1)
    process_flash(x, y+1)
    process_flash(x+1, y+1)
}

function iterate() {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            set(x,y, get(x,y)+1)
        }
    }

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (get(x,y) >= 10) {
                flash(x, y)
            }
        }
    }
}

for (let index = 0; index < iterations; index++) {
    iterate()
}

console.log(flashes)
