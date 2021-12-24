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

const line_parser = (new RegExp(/^i\[\d+\]$/))


interface State extends Record<Register, string> {
    index: number
}

function* varGen(): Generator<string> {
    let c = 0
    while (true)
        yield `v${c++}`
}

const new_var = varGen()
const variables: Record<string, string> = {}

function pushVar(val: string): string {
    /*
    if (val.length < 30) {
        return val
    }
    */

    const variable = new_var.next().value
    variables[variable] = val
    return variable
}

const ops = {
    inp(state: State, register: Register) {
        state[register] = `i[${state.index}]`
        state.index++
    },

    add_r(state: State, register: Register, val: Register) {
        const register_val = parseInt(state[register])
        const val_val = parseInt(state[val])
        if (isNaN(register_val) || isNaN(val_val)) {
            if (!isNaN(register_val) && register_val === 0) {
                state[register] = state[val]
                return
            }
            if (!isNaN(val_val) && val_val === 0) {
                return
            }
            state[register] = pushVar(`(${state[register]} + ${state[val]})`)
        } else {
            state[register] = (register_val + val_val).toString()
        }
    },

    add_v(state: State, register: Register, val: number) {
        const register_val = parseInt(state[register])
        if (isNaN(register_val)) {
            if (val === 0) {
                return
            }
            state[register] = pushVar(`(${state[register]} + (${val}))`)
        } else {
            state[register] = (register_val + val).toString()
        }
    },

    mul_r(state: State, register: Register, val: Register) {
        const register_val = parseInt(state[register])
        const val_val = parseInt(state[val])
        if (isNaN(register_val) || isNaN(val_val)) {
            if (!isNaN(register_val) && register_val === 0) {
                return
            }
            if (!isNaN(register_val) && register_val === 1) {
                state[register] = state[val]
                return
            }
            if (!isNaN(val_val) && val_val === 0) {
                state[register] = '0'
                return
            }
            if (!isNaN(val_val) && val_val === 1) {
                return
            }
            state[register] = pushVar(`(${state[register]} * ${state[val]})`)
        } else {
            state[register] = (register_val * val_val).toString()
        }
    },

    mul_v(state: State, register: Register, val: number) {
        const register_val = parseInt(state[register])
        if (isNaN(register_val)) {
            if (val === 0) {
                state[register] = '0'
                return
            }
            if (val === 1) {
                return
            }
            state[register] = pushVar(`(${state[register]} * (${val}))`)
        } else {
            state[register] = (register_val * val).toString()
        }
    },

    div_r(state: State, register: Register, val: Register) {
        const register_val = parseInt(state[register])
        const val_val = parseInt(state[val])
        if (isNaN(register_val) || isNaN(val_val)) {
            if (!isNaN(val_val) && val_val === 1) {
                return
            }
            state[register] = pushVar(`(${state[register]} / ${state[val]})`)
        } else {
            state[register] = Math.floor(register_val / val_val).toString()
        }
    },

    div_v(state: State, register: Register, val: number) {
        const register_val = parseInt(state[register])
        if (isNaN(register_val)) {
            if (val === 1) {
                return
            }
            state[register] = pushVar(`(${state[register]} / (${val}))`)
        } else {
            state[register] = Math.floor(register_val / val).toString()
        }
    },

    mod_r(state: State, register: Register, val: Register) {
        const register_val = parseInt(state[register])
        const val_val = parseInt(state[val])
        if (isNaN(register_val) || isNaN(val_val))
            state[register] = pushVar(`(${state[register]} % ${state[val]})`)
        else
            state[register] = (register_val % val_val).toString()
    },

    mod_v(state: State, register: Register, val: number) {
        const register_val = parseInt(state[register])
        if (isNaN(register_val))
            state[register] = pushVar(`(${state[register]} % (${val}))`)
        else
            state[register] = (register_val % val).toString()
    },

    eql_r(state: State, register: Register, val: Register) {
        const register_val = parseInt(state[register])
        const val_val = parseInt(state[val])
        if (isNaN(register_val) || isNaN(val_val)) {
            if (isNaN(register_val) && !isNaN(val_val) && line_parser.exec(state[register])) {
                if (val_val >= 10 || val_val <= 0) {
                    state[register] = '0'
                    return
                }
            }
            if (isNaN(val_val) && !isNaN(register_val) && line_parser.exec(state[val])) {
                if (register_val >= 10 || register_val <= 0) {
                    state[register] = '0'
                    return
                }
            }

            state[register] = pushVar(`(if (${state[register]} == ${state[val]}) {1} else {0})`)
        } else {
            state[register] = register_val === val_val ? '1' : '0'
        }
    },

    eql_v(state: State, register: Register, val: number) {
        const register_val = parseInt(state[register])
        if (isNaN(register_val)) {
            if (line_parser.exec(state[register])) {
                if (val >= 10 || val <= 0) {
                    state[register] = '0'
                    return
                }
            }
            state[register] = pushVar(`(if (${state[register]} == ${val}) {1} else {0})`)
        } else {
            state[register] = register_val === val ? '1' : '0'
        }
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

function check() {
    const state: State = {
        index: 0,
        x: '0',
        y: '0',
        z: '0',
        w: '0',
    }

    for (const op of program) {
        op(state)
    }

    console.log(state)
    console.log('z', state.z)
    //console.log(variables)
    for (const [name, assignment] of Object.entries(variables)) {
        const _assignment = assignment.replace(/i\[(\d+)\]/gm, 'i$1')
        console.log(`let ${name}:i128 = ${_assignment};`)
    }

    // Deno.exit()

}

type Serial = [number, number, number, number, number, number, number, number, number, number, number, number, number, number]

check()