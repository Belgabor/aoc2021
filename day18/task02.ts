// deno-lint-ignore-file camelcase ban-unused-ignore
import { deepClone } from "https://cdn.jsdelivr.net/gh/motss/deno_mod@v0.10.0/deep_clone/mod.ts";
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

type SnailDigit = SnailNumber | number
interface SnailNumber {
    left: SnailDigit
    right: SnailDigit
}

interface ExplodeState {
    current_nesting: number
    exploded: boolean
    rest_left?: number
    rest_right?: number
}

function parse(number: string): SnailDigit {
    if (!isNaN(<number><unknown>number)) {
        return parseInt(number)
    }

    // remove outer braces
    number = number.slice(1, -1)
    let pos = -1
    let nesting = 0
    search:
    for (let index = 0; index < number.length; index++) {
        const char = number[index];
        switch (char) {
            case '[':
                nesting++
                break
            case ']':
                nesting--
                break
            case ',':
                if (nesting === 0) {
                    pos = index
                    break search
                }
                break
        }
    }

    const left = number.slice(0, pos)
    const right = number.slice(pos+1)
    
    return {
        left: parse(left),
        right: parse(right),
    }
}

function dump(number: SnailDigit): string {
    if (typeof number === 'object') {
        return `[${dump(number.left)},${dump(number.right)}]`
    }
    return `${number}`
}

function add_to_first_left(number: SnailNumber, add: number) {
    if (typeof number.left === 'number') {
        number.left += add
    } else {
        add_to_first_left(number.left, add)
    }
}

function add_to_first_right(number: SnailNumber, add: number) {
    if (typeof number.right === 'number') {
        number.right += add
    } else {
        add_to_first_right(number.right, add)
    }
}

function explode(number: SnailDigit, state: ExplodeState) {
    if (typeof number === 'number') {
        return
    }
    state.current_nesting++

    if (state.current_nesting === 4) {
        if (typeof number.left === 'object') {
            // Left side explodes
            state.rest_left = <number>number.left.left
            state.exploded = true
            if (typeof number.right === 'number') {
                number.right += <number>number.left.right
            } else {
                add_to_first_left(number.right, <number>number.left.right)
            }
            number.left = 0
        } else if (typeof number.right === 'object') {
            // right side explodes
            state.rest_right = <number>number.right.right
            state.exploded = true
            number.left += <number>number.right.left
            number.right = 0
        }
    } else {
        explode(number.left, state)
        if (state.exploded) {
            if (state.rest_right !== undefined) {
                if (typeof number.right === 'number') {
                    number.right += state.rest_right
                } else {
                    add_to_first_left(number.right, state.rest_right)
                }
                delete state.rest_right
            }
        } else {
            explode(number.right, state)
            if (state.exploded) {
                if (state.rest_left !== undefined) {
                    if (typeof number.left === 'number') {
                        number.left += state.rest_left
                    } else {
                        add_to_first_right(number.left, state.rest_left)
                    }

                    delete state.rest_left
                }
            }
        }
    }

    state.current_nesting--
}

function splitDigit(digit: number): SnailNumber {
    return {
        left: Math.floor(digit/2),
        right: Math.ceil(digit/2),
    }
}

function split(number: SnailDigit): boolean {
    if (typeof number === 'number') {
        return false
    }

    if (typeof number.left === 'number' && number.left >= 10) {
        number.left = splitDigit(number.left)
        return true
    }
    if (typeof number.left === 'object') {
        const did_split = split(number.left)
        if (did_split) {
            return true
        }
    }
    if (typeof number.right === 'number' && number.right >= 10) {
        number.right = splitDigit(number.right)
        return true
    }
    if (typeof number.right === 'object') {
        const did_split = split(number.right)
        if (did_split) {
            return true
        }
    }

    return false
}

function reduce(number: SnailNumber) {
    while (true) {
        const state: ExplodeState = {current_nesting: 0, exploded: false}
        explode(number, state)
        if (state.exploded) {
            continue
        }
        if (split(number)) {
            continue
        }
        break
    }
}

async function add(left: SnailNumber, right: SnailNumber): Promise<SnailNumber> {
    const added: SnailNumber = {
        left: <SnailNumber>await deepClone(left),
        right: <SnailNumber>await deepClone(right),
    }
    reduce(added)
    return added
}

function magnitude(number: SnailDigit): number {
    if (typeof number === 'number') {
        return number
    }
    return (3*magnitude(number.left)) + (2*magnitude(number.right))
}

const numbers: SnailNumber[] = []
for (const line of lines) {
    // console.log(line)
    const parsed = <SnailNumber>parse(line)
    // console.log(dump(parsed))
    numbers.push(parsed)
}

let max = 0

for (let index = 0; index < numbers.length; index++) {
    for (let other = 0; other < numbers.length; other++) {
        if (other === index) {
            continue
        }
        const mag = magnitude(await add(numbers[index], numbers[other]))
        if (mag > max) {
            console.log(dump(numbers[index]), '+', dump(numbers[other]), '=', mag)
            max = mag
        }
    }
}

console.log(max)