// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const algorithm: Array<boolean> = []

for (const position of lines[0]) {
    algorithm.push(position === '#')
}

type Image = Record<number, Record<number, boolean>>
interface Size {
    x_min: number
    x_max: number
    y_min: number
    y_max: number
}

let current_image = function (): Image {
    const image: Image = {}
    let current_line = 0

    for (let index = 2; index < lines.length; index++) {
        const line = lines[index];
        image[current_line] = {}
        for (let char_index = 0; char_index < line.length; char_index++) {
            image[current_line][char_index] = line[char_index] === '#'
        }
        current_line++
    }

    return image
}()

function getSize(image: Image, expansion = 0): Size {
    const y_min = Math.min(...Object.keys(image).map(key => parseInt(key)))
    const y_max = Math.max(...Object.keys(image).map(key => parseInt(key))) + expansion
    const x_min = Math.min(...Object.keys(image[y_min]).map(key => parseInt(key))) - expansion
    const x_max = Math.max(...Object.keys(image[y_min]).map(key => parseInt(key))) + expansion

    return {
        x_min,
        x_max,
        y_min: y_min - expansion,
        y_max,
    }
}

function display(image: Image) {
    const size = getSize(image)

    for (let y = size.y_min; y <= size.y_max; y++) {
        let line = ''
        for (let x = size.x_min; x <= size.x_max; x++) {
            line += image[y][x] ? '#' : '.'
        }
        console.log(line)
    }
}

let iteration = 0

const getUndefinedPixel = algorithm[0] ? (iteration: number) => iteration % 2 === 1 : () => false


function setPixel(image: Image, x: number, y: number, to: boolean) {
    if (image[y] === undefined) {
        image[y] = {}
    }
    image[y][x] = to
}

function getPixel(image: Image, x: number, y: number, iteration: number): boolean {
    return image[y]?.[x] ?? getUndefinedPixel(iteration)
}

function calcPixel(image: Image, _x: number, _y: number, iteration: number): boolean {
    let binary = ''
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            binary += getPixel(image, _x + x, _y + y, iteration) ? '1' : '0'
        }
    }
    return algorithm[parseInt(binary, 2)]
}


function iterate() {
    const new_image: Image = {}
    const expansion = iteration + 1
    const size = getSize(current_image, expansion)
    for (let y = size.y_min; y <= size.y_max; y++) {
        for (let x = size.x_min; x <= size.x_max; x++) {
            setPixel(new_image, x, y, calcPixel(current_image, x, y, iteration))
        }
    }
    iteration++
    console.log('')
    current_image = new_image
    display(current_image)
}

function lit(image: Image): number {
    const size = getSize(image)
    let lit_pixels = 0
    for (let y = size.y_min; y <= size.y_max; y++) {
        for (let x = size.x_min; x <= size.x_max; x++) {
            if (image[y][x]) {
                lit_pixels++
            }
        }
    }
    return lit_pixels
}

display(current_image)
iterate()
iterate()
console.log(lit(current_image))