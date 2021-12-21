// deno-lint-ignore-file camelcase ban-unused-ignore
export { }

type Player = 0 | 1

const start_positions = [8,9]
// const start_positions = [4, 8]

let die_index = 0
let rolls = 0
const current_positions = [...start_positions]

function roll(): number {
    const roll = die_index + 1
    rolls++

    die_index++
    if (die_index === 100) {
        die_index = 0
    }

    return roll
}

function update_position(player: Player, roll: number) {
    let pos = current_positions[player]

    pos += roll
    while (pos > 10) {
        pos -= 10
    }
    current_positions[player] = pos
}

const points = [0, 0]
let player: Player = 0

function turn(): boolean {
    const the_roll = roll() + roll() + roll()
    update_position(player, the_roll)
    points[player] += current_positions[player]

    if (points[player] >= 1000) {
        return false
    }
    player = player === 0 ? 1 : 0

    return true
}

while (turn()) {
    console.log(current_positions)
}

console.log(points[player === 0 ? 1 : 0] * rolls)

