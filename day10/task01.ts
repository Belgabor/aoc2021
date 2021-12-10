// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
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
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
}

let score = 0

for (const line of lines) {
    const stack: CloseOption[] = []

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
        console.log(line, stack[stack.length - 1], letter)
        score += point_map[<CloseOption>letter]
        break
    }
}

console.log(score)