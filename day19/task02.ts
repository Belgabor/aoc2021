// deno-lint-ignore-file camelcase ban-unused-ignore require-await
import { deepClone } from "https://cdn.jsdelivr.net/gh/motss/deno_mod@v0.10.0/deep_clone/mod.ts";
export { }
import { Scanner, Location, ResolvedScanner, Orientation, Axis } from './types.ts'
import { Maybe } from '../lib/types.ts'

const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)


function initScanner(id: number): Scanner {
    return {
        id,
        beacons: [],
        orientation: undefined,
        location: undefined,
    }
}

function parseLocation(line: string): Location {
    return <Location>line.split(',', 3).map(val => parseInt(val))
}

const scanners = function (): Record<number, Scanner> {
    const scanners: Record<number, Scanner> = {}
    let current: Scanner = initScanner(-1)
    let id = 0

    for (const line of lines) {
        if (line.startsWith('---')) {
            current = initScanner(id++)
        } else if (line === '') {
            scanners[current.id] = current
        } else {
            current.beacons.push(parseLocation(line))
        }
    }
    scanners[current.id] = current

    return scanners
}()

function initOrientation(): Orientation {
    return {
        x: {
            direction: 1,
            order: 0,
        },
        y: {
            direction: 1,
            order: 1,
        },
        z: {
            direction: 1,
            order: 2,
        },
    }
}

function nextDirection(on: Orientation) {
    if (on.x.direction === 1) {
        if (on.y.direction === 1) {
            if (on.z.direction === 1) {
                on.x.direction = -1
            } else {
                on.x.direction = -1
                on.y.direction = -1
                on.z.direction = 1
            }
        } else {
            if (on.z.direction === 1) {
                on.y.direction = 1
                on.z.direction = -1
            } else {
                on.x.direction = -1
            }
        }
    } else {
        if (on.y.direction === 1) {
            if (on.z.direction === 1) {
                on.x.direction = 1
                on.y.direction = -1
            } else {
                on.x.direction = 1
                on.y.direction = -1
                on.z.direction = -1
            }
        } else {
            if (on.z.direction === 1) {
                on.x.direction = -1
                on.y.direction = 1
                on.z.direction = -1
            } else {
                on.x.direction = 1
                on.y.direction = 1
                on.z.direction = 1
            }
        }
    }
}

function nextOrder(on: Orientation) {
    on.x.direction = 1
    on.y.direction = 1
    on.z.direction = 1

    if (on.x.order === 0) {
        if (on.y.order === 1) {
            on.x.order = 2
            on.y.order = 0
            on.z.order = 1
        } else {
            on.x.order = 0
            on.y.order = 1
            on.z.order = 2
        }
    } else if (on.x.order === 1) {
        if (on.y.order === 2) {
            on.x.order = 1
            on.y.order = 0
            on.z.order = 2
        } else {
            on.x.order = 2
            on.y.order = 1
            on.z.order = 0
        }
    } else {
        if (on.y.order === 0) {
            on.x.order = 1
            on.y.order = 2
            on.z.order = 0
        } else {
            on.x.order = 0
            on.y.order = 2
            on.z.order = 1
        }
    }
}

async function nextOrientation(prev: Orientation): Promise<Maybe<Orientation>> {
    const next = <Orientation>await deepClone(prev)
    if (next.x.direction === -1 && next.y.direction === -1 && next.z.direction === -1) {
        if (next.x.order === 0 && next.y.order === 2) {
            return undefined
        }
        nextOrder(next)
    } else {
        nextDirection(next)
    }
    return next
}

function transform(beacon: Location, orientation: Orientation, root: Location = [0, 0, 0]): Location {
    const lookup: Axis[] = Array(3)
    lookup[orientation.x.order] = {
        order: 0,
        direction: orientation.x.direction,
    }
    lookup[orientation.y.order] = {
        order: 1,
        direction: orientation.y.direction,
    }
    lookup[orientation.z.order] = {
        order: 2,
        direction: orientation.z.direction,
    }

    return [
        root[0] + (beacon[lookup[0].order] * lookup[0].direction),
        root[1] + (beacon[lookup[1].order] * lookup[1].direction),
        root[2] + (beacon[lookup[2].order] * lookup[2].direction),
    ]
}

function resolveBeaconsOn(beacons: Location[], orientation: Orientation, root: Location = [0, 0, 0]): Location[] {
    const resolved: Location[] = []

    for (const beacon of beacons) {
        resolved.push(transform(beacon, orientation, root))
    }

    return resolved
}

function resolveBeacons(scanner: ResolvedScanner): Location[] {
    return resolveBeaconsOn(scanner.beacons, scanner.orientation, scanner.location)
}

function hits(a: Location, b: Location) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

function match(known: Location[], vs: Location[]): Maybe<Location> {
    for (let main_loop = 0; main_loop < known.length; main_loop++) {
        for (let match_candidate = 0; match_candidate < vs.length; match_candidate++) {
            const potential_location: Location = [
                known[main_loop][0] - vs[match_candidate][0],
                known[main_loop][1] - vs[match_candidate][1],
                known[main_loop][2] - vs[match_candidate][2],
            ]

            let hit_count = 0
            for (let _main_loop = 0; _main_loop < known.length; _main_loop++) {
                if (_main_loop === main_loop) {
                    continue
                }
                for (let _match_candidate = 0; _match_candidate < vs.length; _match_candidate++) {
                    if (_match_candidate === match_candidate) {
                        continue
                    }
                    if (hits(known[_main_loop], [
                        potential_location[0] + vs[_match_candidate][0],
                        potential_location[1] + vs[_match_candidate][1],
                        potential_location[2] + vs[_match_candidate][2],
                    ])) {
                        hit_count++
                    }
                }
            }

            if (hit_count >= 11) {
                return potential_location
            }
        }
    }
    return undefined
}

console.log(scanners)

const current_scanners: Record<number, ResolvedScanner> = {}
const done_scanners: Record<number, ResolvedScanner> = {}

const first = scanners[0]
delete scanners[0]
current_scanners[0] = {
    ...first,
    location: [0, 0, 0],
    orientation: initOrientation(),
}

async function check(scanner: ResolvedScanner, vs: Scanner): Promise<Maybe<ResolvedScanner>> {
    const beacons = resolveBeacons(scanner)

    let check_orientation = initOrientation()

    while (true) {
        // console.log(check_orientation)
        const vs_beacons = resolveBeaconsOn(vs.beacons, check_orientation)
        const matched_on = match(beacons, vs_beacons)
        if (matched_on) {
            return {
                ...vs,
                orientation: check_orientation,
                location: matched_on,
            }
        }

        const next_orientation = await nextOrientation(check_orientation)
        if (next_orientation === undefined) {
            break
        }
        check_orientation = next_orientation
    }
    return undefined
}

while (Object.keys(current_scanners).length > 0) {
    const to_test = Object.values(current_scanners)[0]
    console.log('Testing', to_test.id)
    delete current_scanners[to_test.id]

    const against = {...scanners}
    for (const _against of Object.values(against)) {
        const valid = await check(to_test, _against)
        if (valid) {
            delete scanners[valid.id]
            current_scanners[valid.id] = valid
            console.log('Identified', valid.id)
        }
    }

    done_scanners[to_test.id] = to_test
}

console.log(done_scanners)

function manhattan(a: Location, b: Location): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
}

const scanner_array = Object.values(done_scanners)

const distances: number[] = []
for (let check = 0; check < scanner_array.length; check++) {
    for (let vs = 0; vs < scanner_array.length; vs++) {
        if (check === vs) {
            continue
        }
        distances.push(manhattan(scanner_array[check].location, scanner_array[vs].location))
    }
}

console.log(Math.max(...distances))