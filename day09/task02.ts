// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const height_field: number[][] = []

for (const line of lines) {
    height_field.push(line.split('').map(char => parseInt(char)))
}

const height = height_field.length
const width = height_field[0].length

function get_height(x: number, y: number): number {
    if (x < 0 || x >= width || y < 0 || y >= height) {
        return 99999
    }
    return height_field[y][x]
}

const region_map: number[][] = Array(height)
for (let y = 0; y < height; y++) {
    region_map[y] = Array(width).fill(0)
}


let current_region = 0
let current_region_size = 0
const region_sizes: number[] = []

function mark(x: number, y: number) {
    const val = get_height(x, y)

    if (val === 99999) {
        return
    }

    if (region_map[y][x] !== 0) {
        return
    }

    if (val === 9) {
        region_map[y][x] = -1
        return
    }
    region_map[y][x] = current_region
    current_region_size++

    mark(x, y-1)
    mark(x+1, y)
    mark(x, y+1)
    mark(x-1, y)
}

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (region_map[y][x] !== 0) {
            continue
        }

        if (get_height(x, y) === 9) {
            region_map[y][x] = -1
            continue
        }

        current_region++
        current_region_size = 0

        mark(x, y)
        region_sizes[current_region] = current_region_size
    }
}

region_sizes[0] = 0
console.log(region_map, region_sizes)
region_sizes.sort((a,b) => a>b ? 1 : -1)
console.log(region_sizes)
console.log((region_sizes.pop() ?? 0) * (region_sizes.pop() ?? 0) * (region_sizes.pop() ?? 0))