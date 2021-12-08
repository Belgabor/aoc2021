// deno-lint-ignore-file camelcase
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const FULL_LENGTH = 12

function get_counts(lines: string[]) {
    const digits = Array(FULL_LENGTH).fill(0)

    for (const line of lines) {
        for (let index = 0; index < FULL_LENGTH; index++) {
            const digit = line[index];
            digits[index] += digit === '1' ? 1 : 0
        }
    }
    
    return digits
}

function filter_lines(lines: string[], index: number, by: string) {
    const filtered: string[] = []
    for (const line of lines) {
        if (line[index] === by) {
            filtered.push(line)
        }
    }
    return filtered
}

function find_rating(lines: string[], iteration: number, most_common: boolean): string {
    const counts = get_counts(lines)

    const total_half = lines.length / 2

    let search_for: string

    if (counts[iteration] === total_half) {
        search_for = most_common ? '1' : '0'
    } else if (counts[iteration] > total_half) {
        search_for = most_common ? '1' : '0'
    } else {
        search_for = most_common ? '0' : '1'
    }

    const filtered = filter_lines(lines, iteration, search_for)

    if (filtered.length === 1) {
        return filtered[0]
    } else {
        return find_rating(filtered, iteration+1, most_common)
    }
}


const oxygen_str = find_rating(lines, 0, true)
const co2_str = find_rating(lines, 0, false)

console.log(oxygen_str, co2_str)

const oxygen = parseInt(oxygen_str, 2)
const co2 = parseInt(co2_str, 2)
console.log(oxygen, co2, oxygen*co2)