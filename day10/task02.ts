// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const test = false
const data = await Deno.readTextFile(test?'./test_data.txt':'./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

type CloseOption = ')' | ']' | '}' | '>'

const valid: Record<string, CloseOption> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
}

const point_map: Record<CloseOption, number> = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
}

const scores: number[] = []

function calc_score(stack: CloseOption[]): number {
    let score = 0

    while (stack.length > 0) {
        score = (score * 5) + point_map[stack.pop() ?? <CloseOption>'']
    }

    return score
}

for (const line of lines) {
    const stack: CloseOption[] = []
    let corrupt = false

    for (const letter of line) {
        if (valid[letter] !== undefined) {
            // Open chunk
            stack.push(valid[letter])
            continue
        }

        if (letter === stack[stack.length - 1]) {
            // Close chunk
            stack.pop()
            continue
        }

        // Invalid
        corrupt = true
        break
    }

    if (corrupt) {
        continue
    }

    const this_score = calc_score(stack)
    console.log(line, this_score)

    scores.push(this_score)
}

console.log(scores)

scores.sort((a,b) => a>b?1:-1)

console.log(scores[Math.floor(scores.length/2)])