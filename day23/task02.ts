// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
import { Maybe } from '../lib/types.ts'
const test = false

//type Rooms = 'rA1' | 'rA2' | 'rB1' | 'rB2' | 'rC1' | 'rC2' | 'rD1' | 'rD2'
type Room = `r${AmphipodType}${Index}`
type Corridor = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' | 'c9' | 'c10' | 'c11'
type Position = Room | Corridor
type AmphipodType = 'A' | 'B' | 'C' | 'D'
type Index = '1' | '2' | '3' | '4'
type NumericIndex = 1|2|3|4
type Amphipod = `${AmphipodType}${Index}`

const all_positions: Position[] = [
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11',
    'rA1', 'rA2', 'rA3', 'rA4', 'rB1', 'rB2', 'rB3', 'rB4', 
    'rC1', 'rC2', 'rC3', 'rC4', 'rD1', 'rD2', 'rD3', 'rD4',
]
const done = '           AAAABBBBCCCCDDDD'

interface Move {
    from: Position
    to: Position
    energy: number
}

interface SplitRoom {
    amphipod: AmphipodType
    index: Index
}

interface Situation {
    key: string
    state: Partial<Record<Position, Maybe<Amphipod>>>
    energy: number
    // moves: Move[]
    // current_move: number
}

const forbidden: Record<AmphipodType, Position[]> = {
    'A': ['c3', 'c5', 'c7', 'c9', 'rB1', 'rB2', 'rC1', 'rC2', 'rD1', 'rD2'],
    'B': ['c3', 'c5', 'c7', 'c9', 'rA1', 'rA2', 'rC1', 'rC2', 'rD1', 'rD2'],
    'C': ['c3', 'c5', 'c7', 'c9', 'rA1', 'rA2', 'rB1', 'rB2', 'rD1', 'rD2'],
    'D': ['c3', 'c5', 'c7', 'c9', 'rA1', 'rA2', 'rB1', 'rB2', 'rC1', 'rC2'],
}

const connections: Record<Position, Position[]> = {
    'c1': ['c2'],
    'c2': ['c1', 'c3'],
    'c3': ['c2', 'c4', 'rA4'],
    'c4': ['c3', 'c5'],
    'c5': ['c4', 'c6', 'rB4'],
    'c6': ['c5', 'c7'],
    'c7': ['c6', 'c8', 'rC4'],
    'c8': ['c7', 'c9'],
    'c9': ['c8', 'c10', 'rD4'],
    'c10': ['c9', 'c11'],
    'c11': ['c10'],
    'rA1': ['rA2'],
    'rA2': ['rA3', 'rA1'],
    'rA3': ['rA4', 'rA2'],
    'rA4': ['c3', 'rA3'],
    'rB1': ['rB2'],
    'rB2': ['rB3', 'rB1'],
    'rB3': ['rB4', 'rB2'],
    'rB4': ['c5', 'rB3'],
    'rC1': ['rC2'],
    'rC2': ['rC3', 'rC1'],
    'rC3': ['rC4', 'rC2'],
    'rC4': ['c7', 'rC3'],
    'rD1': ['rD2'],
    'rD2': ['rD3', 'rD1'],
    'rD3': ['rD4', 'rD2'],
    'rD4': ['c9', 'rD3'],
}


const test_data: Situation = {
    key: '',
    energy: 0,
    state: {
        'rA1': 'A1',
        'rA4': 'B1',
        'rB1': 'D1',
        'rB4': 'C1',
        'rC1': 'C2',
        'rC4': 'B2',
        'rD1': 'A2',
        'rD4': 'D2',

        'rA2': 'D3',
        'rA3': 'D4',
        'rB2': 'B3',
        'rB3': 'C3',
        'rC2': 'A3',
        'rC3': 'B4',
        'rD2': 'C4',
        'rD3': 'A4',
    },
}
/*
const test_data: Situation = {
    energy: 0,
    state: {
        'rA1': 'A1',
        'c10': 'A2',
        'rB1': 'B1',
        'rB2': 'B2',
        'rC1': 'C1',
        'rC2': 'C2',
        'rD1': 'D1',
        'rD2': 'D2',
    },
}
*/

const data: Situation = {
    key: '',
    energy: 0,
    state: {
        'rA1': 'D1',
        'rA4': 'D2',
        'rB1': 'A1',
        'rB4': 'B1',
        'rC1': 'B2',
        'rC4': 'C1',
        'rD1': 'A2',
        'rD4': 'C2',

        'rA2': 'D3',
        'rA3': 'D4',
        'rB2': 'B3',
        'rB3': 'C3',
        'rC2': 'A3',
        'rC3': 'B4',
        'rD2': 'C4',
        'rD3': 'A4',
    },
}

const move_energy: Record<AmphipodType, number> = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000,
}

const initial_situation = test ? test_data : data
initial_situation.key = situation_key(initial_situation)

function situation_key(situation: Situation): string {
    let key = ''
    for (const pos of all_positions) {
        key += situation.state[pos]?.[0] ?? ' '
    }
    return key
}

function get_amphipod_type(amphipod: Amphipod): AmphipodType {
    return <AmphipodType>amphipod[0]
}

function parse_room(room: Maybe<Position>): Maybe<SplitRoom> {
    if (room === undefined || !room.startsWith('r')) {
        return undefined
    }
    return {
        amphipod: <AmphipodType>room[1],
        index: <Index>room[2],
    }
}

function can_stop_at(situation: Situation, amphipod: AmphipodType, source: Maybe<SplitRoom>, target: Maybe<SplitRoom>, target_room: Position): boolean {
    if ((source === undefined && target === undefined) || forbidden[amphipod].includes(target_room)) {
        return false
    }
    if (target !== undefined) {
        const target_index = <NumericIndex>parseInt(target.index)
        if (target_index > 1) {
            for (let index: NumericIndex = 1; index < target_index; index++) {
                const other_amphipod = situation.state[`r${target.amphipod}${<NumericIndex>index}`]
                if (other_amphipod === undefined) {
                    return false
                }
                if (get_amphipod_type(other_amphipod) !== amphipod) {
                    return false
                }
                    
            }
        }
        /*
        if (source?.amphipod !== amphipod) {
            // moving from a different room or corridor
            const other_room: Room = `r${target.amphipod}${target.index === '1' ? '2' : '1'}`
            const other_amphipod = situation.state[other_room]
            if (other_amphipod !== undefined) {
                return get_amphipod_type(other_amphipod) === amphipod
            }

            return true
        }
        if (source !== undefined) {
            // moving inside the same room
            return source.index === '2' && target.index === '1'
        }
        */
    }
    return true
}

function build_moves(situation: Situation, amphipod: Amphipod, source: Position, from: Position, previous: Maybe<Position>, energy: number): Move[] {
    let moves: Move[] = []
    const type = get_amphipod_type(amphipod)
    const source_room = parse_room(source)

    for (const target of connections[from]) {
        if (target === previous || situation.state[target] !== undefined) {
            continue
        }
        const target_room = parse_room(target)
        const target_energy = energy + move_energy[type]

        if (can_stop_at(situation, type, source_room, target_room, target)) {
            moves.push({
                energy: target_energy,
                from: source,
                to: target,
            })
        }
        moves = [
            ...moves,
            ...build_moves(situation, amphipod, source, target, from, target_energy)
        ]
    }

    return moves
}

function is_finished(situation: Situation, amphipod: Amphipod, position: Position): boolean {
    const type = get_amphipod_type(amphipod)
    const room = parse_room(position)
    if (room === undefined) {
        return false
    }
    if (room.amphipod !== type) {
        return false
    }
    if (room.index === '1') {
        return true
    }
    return can_stop_at(situation, get_amphipod_type(amphipod), undefined, parse_room(position), position)
}

function calculate_moves_for_position(situation: Situation, position: Position): Move[] {
    const amphipod = situation.state[position]
    if (amphipod === undefined || is_finished(situation, amphipod, position)) {
        return []
    }

    return build_moves(situation, amphipod, position, position, undefined, 0)
}

function calculate_moves(situation: Situation): Move[] {
    const moves: Move[] = []

    for (const position of <Position[]>Object.keys(situation.state)) {
        moves.push(...calculate_moves_for_position(situation, position))
    }

    return moves
}

// calculate_moves(initial_situation)
console.log(initial_situation)

function perform_move(situation: Situation, move: Move): Situation {
    const new_situation: Situation = {
        key: '',
        energy: situation.energy + move.energy,
        state: { ...situation.state }
    }

    new_situation.state[move.to] = situation.state[move.from]
    new_situation.state[move.from] = undefined

    new_situation.key = situation_key(new_situation)
    return new_situation
}

const nodes: Record<string, Situation> = {
    [initial_situation.key]: initial_situation
}
const visited: Record<string, boolean> = {}
const unvisited: Record<string, boolean> = {}
let current: string = initial_situation.key

while (true) {
    const situation = nodes[current]
    delete unvisited[current]
    const moves = calculate_moves(situation)
    moves.sort((a, b) => a.energy - b.energy)

    for (const move of moves) {
        const next = perform_move(situation, move)
        if (visited[next.key]) {
            continue
        }

        if (nodes[next.key] === undefined) {
            nodes[next.key] = next
            unvisited[next.key] = true
        } else {
            nodes[next.key].energy = Math.min(nodes[next.key].energy, next.energy)
        }
    }
    visited[current] = true

    current = ''
    let lowest = Number.MAX_SAFE_INTEGER
    for (const key of Object.keys(unvisited)) {
        const node = nodes[key]
        if (node.energy < lowest) {
            lowest = node.energy
            current = node.key
        }
    }
    if (current === done || current === '') {
        break
    }
}

//evaluate(initial_situation, 0)
console.log(nodes[done].energy)