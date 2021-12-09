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

function is_minimum(x: number, y: number): boolean {
    const the_height = get_height(x,y)
    const min = Math.min(the_height+1, get_height(x-1, y), get_height(x+1, y), get_height(x, y-1), get_height(x, y+1))
    if (min === the_height + 1) {
        console.log(the_height, get_height(x-1, y), get_height(x+1, y), get_height(x, y-1), get_height(x, y+1))
    }
    return min === the_height + 1
}

let risk_total = 0
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (is_minimum(x,y)) {
            risk_total += 1 + get_height(x,y)
        }
        
    }
    
}

console.log(risk_total)