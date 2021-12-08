// deno-lint-ignore-file camelcase
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const total_half = lines.length / 2
const digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

for (const line of lines) {
    for (let index = 0; index < 12; index++) {
        const digit = line[index];
        digits[index] += digit === '1' ? 1 : 0
    }
}

console.log(digits, total_half)

let gamma_str = ''
let epsilon_str = ''

for (let index = 0; index < 12; index++) {
    const digit_count = digits[index];
    if (digit_count > total_half) {
        gamma_str += '1'
        epsilon_str += '0'
    } else {
        gamma_str += '0'
        epsilon_str += '1'
    }
}
console.log(gamma_str, epsilon_str)

const gamma = parseInt(gamma_str, 2)
const epsilon = parseInt(epsilon_str, 2)
console.log(gamma, epsilon, gamma*epsilon)