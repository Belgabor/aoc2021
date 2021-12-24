// deno-lint-ignore-file camelcase ban-unused-ignore no-explicit-any
export { }
import { Maybe } from '../lib/types.ts'
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const registers = ['x', 'y', 'z', 'w'] as const
type Register = typeof registers[number]
type Op = (state: State) => void

interface State extends Record<Register, number> {
    input: Serial
    index: number
}

// Note: 79997391969949

const ops = {
    inp(state: State, register: Register) {
        state[register] = state.input[state.index]
        state.index++
    },

    add_r(state: State, register: Register, val: Register) {
        state[register] = state[register] + state[val]
    },

    add_v(state: State, register: Register, val: number) {
        state[register] = state[register] + val
    },

    mul_r(state: State, register: Register, val: Register) {
        state[register] = state[register] * state[val]
    },

    mul_v(state: State, register: Register, val: number) {
        state[register] = state[register] * val
    },

    div_r(state: State, register: Register, val: Register) {
        state[register] = Math.floor(state[register] / state[val])
    },

    div_v(state: State, register: Register, val: number) {
        state[register] = Math.floor(state[register] / val)
    },

    mod_r(state: State, register: Register, val: Register) {
        state[register] = state[register] % state[val]
    },

    mod_v(state: State, register: Register, val: number) {
        state[register] = state[register] % val
    },

    eql_r(state: State, register: Register, val: Register) {
        state[register] = state[register] === state[val] ? 1 : 0
    },

    eql_v(state: State, register: Register, val: number) {
        state[register] = state[register] === val ? 1 : 0
    },
}

const program: Op[] = []

for (const line of lines) {
    let [op, register, value] = line.split(' ', 4)

    let _value: Maybe<Register | number> = undefined
    if (value !== undefined) {
        if (registers.includes(<any>value)) {
            _value = <Register>value
            op += '_r'
        } else {
            _value = parseInt(value)
            op += '_v'
        }
    }

    if ((<Record<string, any>>ops)[op] === undefined || !registers.includes(<any>register)) {
        console.log('error')
        Deno.exit()
        break
    }

    const _op = <keyof typeof ops>op
    const _register = <Register>register
    const fn = ops[_op]

    if (_op === "inp") {
        program.push(state => (<typeof ops.inp>fn)(state, _register))
    } else {
        program.push(state => (<any>fn)(state, _register, _value))
    }
}


function check(input: Serial): boolean {
    const state: State = {
        input,
        index: 0,
        x: 0,
        y: 0,
        z: 0,
        w: 0,
    }
    console.log(state)

    for (const op of program) {
        op(state)
    }

    console.log(state)
    // Deno.exit()

    return state.z === 0
}



function check_c(i: Serial): boolean {
    const v0 = (((i[0] + (8)) % (26)) + (13))
    const v1 = ((v0 === i[1] ? 1 : 0) === 0 ? 1 : 0)
    const v2 = ((i[0] + (8)) * ((25 * v1) + (1)))
    const v3 = ((v2 + ((i[1] + (8)) * v1)) % (26))
    const v4 = ((v3 + (13)) === i[2] ? 1 : 0)
    const v5 = ((25 * (v4 === 0 ? 1 : 0)) + (1))
    const v6 = ((v2 + ((i[1] + (8)) * v1)) * v5)
    const v7 = ((i[2] + (3)) * (v4 === 0 ? 1 : 0))
    const v8 = ((((v6 + v7) % (26)) + (12)) === i[3] ? 1 : 0)
    const v9 = ((25 * (v8 === 0 ? 1 : 0)) + (1))
    const v10 = ((i[3] + (10)) * (v8 === 0 ? 1 : 0))
    const v11 = ((((v6 + v7) * v9) + v10) % (26))
    const v12 = Math.floor((((v6 + v7) * v9) + v10) / (26))
    const v13 = ((v11 + (-12)) === i[4] ? 1 : 0)
    const v14 = ((25 * (v13 === 0 ? 1 : 0)) + (1))
    const v15 = ((i[4] + (8)) * (v13 === 0 ? 1 : 0))
    const v16 = ((((v12 * v14) + v15) % (26)) + (12))
    const v17 = ((v16 === i[5] ? 1 : 0) === 0 ? 1 : 0)
    const v18 = (((v12 * v14) + v15) * ((25 * v17) + (1)))
    const v19 = ((v18 + ((i[5] + (8)) * v17)) % (26))
    const v20 = Math.floor((v18 + ((i[5] + (8)) * v17)) / (26))
    const v21 = ((v19 + (-2)) === i[6] ? 1 : 0)
    const v22 = ((25 * (v21 === 0 ? 1 : 0)) + (1))
    const v23 = ((i[6] + (8)) * (v21 === 0 ? 1 : 0))
    const v24 = Math.floor(((v20 * v22) + v23) / (26))
    const v25 = ((((v20 * v22) + v23) % (26)) + (-11))
    const v26 = ((v25 === i[7] ? 1 : 0) === 0 ? 1 : 0)
    const v27 = ((v24 * ((25 * v26) + (1))) + ((i[7] + (5)) * v26))
    const v28 = (((v27 % (26)) + (13)) === i[8] ? 1 : 0)
    const v29 = ((25 * (v28 === 0 ? 1 : 0)) + (1))
    const v30 = ((i[8] + (9)) * (v28 === 0 ? 1 : 0))
    const v31 = ((((v27 * v29) + v30) % (26)) + (14))
    const v32 = ((v31 === i[9] ? 1 : 0) === 0 ? 1 : 0)
    const v33 = (((v27 * v29) + v30) * ((25 * v32) + (1)))
    const v34 = ((v33 + ((i[9] + (3)) * v32)) % (26))
    const v35 = Math.floor((v33 + ((i[9] + (3)) * v32)) / (26))
    const v36 = ((v34 === i[10] ? 1 : 0) === 0 ? 1 : 0)
    const v37 = ((v35 * ((25 * v36) + (1))) + ((i[10] + (4)) * v36))
    const v38 = (((v37 % (26)) + (-12)) === i[11] ? 1 : 0)
    const v39 = ((25 * (v38 === 0 ? 1 : 0)) + (1))
    const v40 = (Math.floor(v37 / (26)) * v39)
    const v41 = ((i[11] + (9)) * (v38 === 0 ? 1 : 0))
    const v42 = Math.floor((v40 + v41) / (26))
    const v43 = (((v40 + v41) % (26)) + (-13))
    const v44 = ((v43 === i[12] ? 1 : 0) === 0 ? 1 : 0)
    const v45 = ((v42 * ((25 * v44) + (1))) + ((i[12] + (2)) * v44))
    const v46 = (((v45 % (26)) + (-6)) === i[13] ? 1 : 0)
    const v47 = ((25 * (v46 === 0 ? 1 : 0)) + (1))
    const v48 = (Math.floor(v45 / (26)) * v47)
    const v49 = ((i[13] + (7)) * (v46 === 0 ? 1 : 0))
    return (v48 + v49) === 0
}


type Serial = [number, number, number, number, number, number, number, number, number, number, number, number, number, number]

function next(serial: Serial): Serial {
    const current: Serial = [...serial]

    serial[13] = serial[13] - 1
    let pos = 13
    while (true) {
        if (serial[pos] === 0) {
            serial[pos - 1] = serial[pos - 1] - 1
            serial[pos] = 9
            pos--
        } else {
            break
        }
    }

    return current
}

function* serial(): Generator<Serial> {
    const num: Serial = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
    while (true)
        yield next(num)
}

const space = 9 ** 14
let iteration = 0
const start = performance.now()

/*
const gen = serial()
while (true) {
    const next = gen.next()
    iteration++
    if (iteration % 5000000 === 0) {
        const runtime = performance.now() - start
        const average = runtime / iteration
        const left = (runtime * (space - iteration)) / iteration
        console.log((100 * iteration / space).toFixed(2), (left / (60 * 1000)).toFixed(2), (average * 1000).toFixed(6))
    }
    if (next.done) {
        break
    }
    if (check(next.value)) {
        console.log(next.value)
        break
    }
}
*/
console.log(check(<Serial>'16931171414113'.split('').map(char => parseInt(char))))
