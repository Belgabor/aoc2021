// deno-lint-ignore-file camelcase ban-unused-ignore
export { }

type Player = 0 | 1
type Field = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type Roll = 3 | 4 | 5 | 6 | 7 | 8 | 9

const start_positions: [Field, Field] = [8,9]
// const start_positions: [Field, Field] = [4, 8]

interface State {
    position: Record<Player, Field>
    score: Record<Player, number>
    current_player: Player
}

/*
const roll_map: Record<Player, Record<number, number>> = {
    0: {},
    1: {},
}

const position_map: Record<Player, Record<Field, number>> = {
    0: {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,},
    1: {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,},
}
*/

function clamp(value: number): Field {
    return <Field>(value > 10 ? value - 10 : value)
}

function cloneState(state: State): State {
    return {
        current_player: state.current_player,
        position: {...state.position},
        score: {...state.score},
    }
}

function applyRoll(state: State, roll: Roll): boolean {
    state.position[state.current_player] = clamp(state.position[state.current_player] + roll)
    state.score[state.current_player] += state.position[state.current_player]
    return state.score[state.current_player] >= 21
}

function nextPlayer(state: State) {
    state.current_player = state.current_player === 0 ? 1 : 0
}

const roll_map: Record<Roll, number> = {
    3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1,
}

const won: Record<Player, number> = {0: 0, 1: 0}

let max_depth = 0
function do_roll(state: State, universe_count: number, depth: number/* , rolls: Roll[] */) {
    max_depth = Math.max(depth, max_depth)
    for (let roll: Roll = 3; roll <= 9; roll++) {
        if (depth === 1) {
            console.log(roll)
        }
        const new_state = cloneState(state)
        const new_universe_count = universe_count * roll_map[<Roll>roll]
        if (applyRoll(new_state, <Roll>roll)) {
            won[new_state.current_player] += new_universe_count
            // console.log(rolls, roll, new_state)
            // Deno.exit()
            continue
        }
        nextPlayer(new_state)
        do_roll(new_state, new_universe_count, depth + 1/* , [...rolls, <Roll>roll] */)
    }
}

const initial_state: State = {
    current_player: 0,
    score: {0: 0, 1: 0},
    position: [...start_positions],
}

do_roll(initial_state, 1, 1/* , [] */)
console.log(won, max_depth)