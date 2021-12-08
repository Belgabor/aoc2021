export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

let horizontal = 0
let depth = 0
for (const line of lines) {
    const [command, strAmount] = line.split(' ', 2)
    const amount = parseInt(strAmount)
    switch (command) {
        case 'forward':
            horizontal += amount
            break
        case 'down':
            depth += amount
            break
        case 'up':
            depth -= amount
            break
        default:
            console.error(command)
            break
    }
}

console.log(horizontal)
console.log(depth)
console.log(horizontal * depth)
