export {}
const data = await Deno.readTextFile('data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

let previous = 999999999
let bigger = 0

const ints: number[] = []

for (const line of lines) {
    ints.push(parseInt(line))
}

const windows: number[] = []
for (let index = 2; index < ints.length; index++) {
    windows.push(ints[index-2] + ints[index-1] + ints[index])
}

for (const window of windows) {
    if (window>previous) {
        bigger++
    }
    previous = window
}

console.log(bigger)
