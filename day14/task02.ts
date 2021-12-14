// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const line_parser = (new RegExp(/^(?<pair>\w\w) -> (?<insert>\w)$/))

const pattern: string = <string>lines.shift()
lines.shift()

const rules: Record<string, string[]> = {}
for (const line of lines) {
    const match = line_parser.exec(line)

    if (!match || !match.groups) {
        console.log('error')
        Deno.exit()
        break
    }

    const pair = match.groups.pair
    rules[pair] = [pair[0] + match.groups.insert, match.groups.insert + pair[1], match.groups.insert]
}

type Polymer = Record<string, number>

const counts: Record<string, number> = {}
let current: Polymer = {}

function inc_pair(polymer: Polymer, pair: string, amount = 1) {
    if (polymer[pair] === undefined) {
        polymer[pair] = 0
    }
    polymer[pair] += amount
}

for (let index = 0; index < pattern.length - 1; index++) {
    const letter = pattern[index];
    inc_pair(current, letter + pattern[index + 1])
}
for (let index = 0; index < pattern.length; index++) {
    const letter = pattern[index];
    inc_pair(counts, letter)
}

console.log(current, rules, counts)

function iterate() {
    const next = { ...current }

    for (const [pair, count] of Object.entries(current)) {
        if (count > 0) {
            const rule = rules[pair]

            if (rule !== undefined) {
                next[pair] -= count
                inc_pair(next, rule[0], count)
                inc_pair(next, rule[1], count)
                inc_pair(counts, rule[2], count)
            }
        }
    }

    current = {...next}
    console.log(current)
}

for (let index = 0; index < 40; index++) {
    iterate()
}

console.log(counts, current)

console.log(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)))