// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const fish = lines[0].split(',').map(el => parseInt(el))

for (let index = 0; index < 80; index++) {
    const fish_length = fish.length
    for (let fish_index = 0; fish_index < fish_length; fish_index++) {
        if (fish[fish_index] === 0) {
            fish[fish_index] = 6
            fish.push(8)
        } else {
            fish[fish_index]--
        }
    }
    // console.log(fish.join(','))
}

console.log(fish.length)