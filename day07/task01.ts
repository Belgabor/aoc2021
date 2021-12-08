// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const crabs = lines[0].split(',').map(el => parseInt(el))

const max_pos = Math.max(...crabs)

const distances = Array(max_pos).fill(0)

for (let pos = 1; pos <= max_pos; pos++) {
    for (const crab of crabs) {
        const distance = Math.abs(crab - pos)
        distances[pos-1] += distance
    }
}

console.log(Math.min(...distances))