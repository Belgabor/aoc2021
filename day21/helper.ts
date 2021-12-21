// deno-lint-ignore-file camelcase ban-unused-ignore
export { }

const map: Record<number, number> = {}
for (let a = 1; a < 4; a++) {
    for (let b = 1; b < 4; b++) {
        for (let c = 1; c < 4; c++) {
            console.log(`${a}${b}${c}`, a+b+c)
            map[a+b+c] = (map[a+b+c] ?? 0) + 1
        }
    }
}

console.log(map)

function clamp(value: number): number {
    return value > 10 ? value - 10 : value
}

const values: Record<number, boolean> = {}

for (let start_position = 1; start_position <= 10; start_position++) {
    for (let roll = 3; roll <= 9; roll++) {
        const score = clamp(start_position + roll) + start_position
        values[score] = true
        console.log(start_position, roll, clamp(start_position + roll), score)
    }
}

console.log(values)

for (let start_position = 1; start_position <= 10; start_position++) {
    let sum = 0
    for (let roll = 3; roll <= 9; roll++) {
        sum += clamp(start_position + roll)
    }

    console.log(start_position, sum/7)
}

for (let start_position = 1; start_position <= 10; start_position++) {
    let sum = 0
    for (let roll = 3; roll <= 9; roll++) {
        sum += (clamp(start_position + roll) * map[roll])
    }

    console.log(start_position, sum/27)
}
