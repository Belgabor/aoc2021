// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const fish = lines[0].split(',').map(el => parseInt(el))

let amount_map = [0, 0, 0, 0, 0, 0, 0, 0, 0]

for (const fish_status of fish) {
    amount_map[fish_status]++
}

for (let index = 0; index < 256; index++) {
    const new_map = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let index = 1; index <= 8; index++) {
        new_map[index-1] = amount_map[index]
    }
    new_map[6] += amount_map[0]
    new_map[8] = amount_map[0]

    amount_map = new_map
}

let sum = 0

for (const amount of amount_map) {
    sum += amount
}

console.log(sum)