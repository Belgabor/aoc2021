// deno-lint-ignore-file camelcase ban-unused-ignore
import { Maybe } from '../lib/types.ts'
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data2.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

interface Region {
    x: [number, number],
    y: [number, number],
    z: [number, number],
}
interface Step extends Region {
    set: boolean,
}

const line_parser = new RegExp(/^(?<switch>on|off) x=(?<x_min>-?\d+)\.\.(?<x_max>-?\d+),y=(?<y_min>-?\d+)\.\.(?<y_max>-?\d+),z=(?<z_min>-?\d+)\.\.(?<z_max>-?\d+)$/)

const steps: Step[] = []

for (const line of lines) {
    if (line.startsWith('#')) {
        continue
    }
    const match = line_parser.exec(line)
    if (!match || !match.groups) {
        console.log('?')
        Deno.exit()
        break
    }

    const step: Step = {
        set: match.groups.switch === 'on',
        x: [parseInt(match.groups.x_min), parseInt(match.groups.x_max)],
        y: [parseInt(match.groups.y_min), parseInt(match.groups.y_max)],
        z: [parseInt(match.groups.z_min), parseInt(match.groups.z_max)],
    }

    steps.push(step)
}

console.log(steps)

function valid_region(region: Region): boolean {
    return (region.x[1] >= region.x[0]) && (region.y[1] >= region.y[0]) && (region.z[1] >= region.z[0])
}

function generate_options(target: Region, to_remove: Region, key: keyof Region): [number, number][] {
    return [
        [target[key][0], Math.min(to_remove[key][0] - 1, target[key][1])],
        [Math.max(to_remove[key][0], target[key][0]), Math.min(to_remove[key][1], target[key][1])],
        [Math.max(to_remove[key][1] + 1, target[key][0]), target[key][1]],
    ]
}

function merge_dir(a: Region, b: Region, s1: keyof Region, s2: keyof Region, on: keyof Region): Maybe<Region> {
    if (a[s1][0] === b[s1][0] && a[s1][1] === b[s1][1] && a[s2][0] === b[s2][0] && a[s2][1] === b[s2][1]) {
        const result: Record<string, [number, number]> = {
            [s1]: [...a[s1]],
            [s2]: [...a[s2]],
        }
        if ((a[on][1]+1) === b[on][0]) {
            result[on] = [a[on][0], b[on][1]]
            return <Region><unknown>result
        } else if (a[on][0] === (b[on][1]+1)) {
            result[on] = [b[on][0], a[on][1]]
            return <Region><unknown>result
        }
    }

    return undefined
}

function merge(a: Region, b: Region): Maybe<Region> {
    let result = merge_dir(a, b, 'x', 'y', 'z')

    if (result === undefined) {
        result = merge_dir(a, b, 'x', 'z', 'y')
    }

    if (result === undefined) {
        result = merge_dir(a, b, 'y', 'z', 'x')
    }

    return result
}

function merge_regions(regions: Region[]): boolean {
    const length = regions.length
    for (let first = 0; first < length; first++) {
        for (let second = first + 1; second < length; second++) {
            const merged = merge(regions[first], regions[second])
            if (merged !== undefined) {
                regions[first] = merged
                regions.splice(second, 1)
                return true
            }
        }
    }
    return false
}

function remove_region_from(target: Region, to_remove: Region): Region[] {
    const potential_regions: Region[] = []

    const x_options: [number, number][] = generate_options(target, to_remove, 'x')
    const y_options: [number, number][] = generate_options(target, to_remove, 'y')
    const z_options: [number, number][] = generate_options(target, to_remove, 'z')

    // console.log(x_options, y_options, z_options)

    let i_x = 0
    for (const x of x_options) {
        let i_y = 0
        for (const y of y_options) {
            let i_z = 0
            for (const z of z_options) {
                if (!(i_x === 1 && i_y === 1 && i_z === 1)) {
                    potential_regions.push({ x, y, z })
                }

                i_z++
            }
            i_y++
        }
        i_x++
    }
    // console.log(potential_regions)

    const valid = potential_regions.filter(valid_region)
    // console.log(valid)

    while (merge_regions(valid)) {/*pass*/}
    // console.log(valid)

    return valid
}

function get_volume(region: Region): number {
    return (1 + region.x[1] - region.x[0]) * (1 + region.y[1] - region.y[0]) * (1 + region.z[1] - region.z[0])
}

let regions: Region[] = []
let iteration = 0
const iterations = steps.length
const start = performance.now()
for (const step of steps) {
    const start = performance.now()
    iteration++
    const new_regions: Region[] = []

    for (const region of regions) {
        new_regions.push(...remove_region_from(region, step))
    }

    if (step.set) {
        new_regions.push({ x: step.x, y: step.y, z: step.z })
    }
    regions = new_regions
    if (iteration === 2) {
        // break
    }
    console.log(iteration, '/', iterations, regions.length, performance.now() - start)
}

// console.log(regions)
/*
for (const region of regions) {
    console.log(region, get_volume(region))
}
*/
console.log(regions.reduce((prev, region) => prev + get_volume(region), 0))
console.log(performance.now() - start)