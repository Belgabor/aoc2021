// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

interface Display {
    patterns: string[]
    digits: string[]
}

const char_sort = (str: string) => str.split('').sort((a, b) => a.localeCompare(b)).join('');

const displays: Display[] = []

let task01 = 0

for (const line of lines) {
    const [patterns, digits] = line.split(' | ', 2)
    const display = {
        patterns: patterns.split(' ').map(char_sort),
        digits: digits.split(' ').map(char_sort)
    }

    for (const digit of display.digits) {
        if ([2,4,3,7].includes(digit.length)) {
            task01++
        }
    }

    displays.push(display)
}

console.log(task01)