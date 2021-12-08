export{}
console.log(Deno.cwd())
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

let previous = 999999999
let bigger = 0

for (const line of lines) {
    const i = parseInt(line)
    if (i>previous) {
        bigger++
    }
    previous = i
}


console.log(bigger)
