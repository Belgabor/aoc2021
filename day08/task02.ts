// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

interface Display {
    patterns: string[]
    digits: string[]
}

interface LetterAnalysis {
    occurs_in: string[]
    count: number
}

function analyse_letters(letter_map: Record<string, LetterAnalysis>, string: string) {
    for (const letter of string) {
        if (letter_map[letter] === undefined) {
            letter_map[letter] = {
                occurs_in: [],
                count: 0,
            }
        }

        letter_map[letter].occurs_in.push(string)
        letter_map[letter].count++
    }
}

function get_number(display: Display, digit_map: Record<string, number>): number {
    let number = 0
    for (let index = 0; index < 4; index++) {
        number += (10 ** (3-index)) * digit_map[display.digits[index]]
    }

    return number
}

const char_sort = (str: string) => str.split('').sort((a, b) => a.localeCompare(b)).join('');

const displays: Display[] = []

for (const line of lines) {
    const [patterns, digits] = line.split(' | ', 2)
    const display = {
        patterns: patterns.split(' ').map(char_sort),
        digits: digits.split(' ').map(char_sort)
    }

    displays.push(display)
}

let total = 0

for (const display of displays) {
    const strings: string[] = Array(10)
    const five: string[] = []
    const six: string[] = []

    for (const pattern of display.patterns) {
        switch(pattern.length) {
            case 2:
                strings[1] = pattern
                break
            case 3:
                strings[7] = pattern
                break
            case 4:
                strings[4] = pattern
                break
            case 5:
                five.push(pattern)
                break
            case 6:
                six.push(pattern)
                break
            case 7:
                strings[8] = pattern
                break    
        }
    }

    const b_or_d: string[] = []
    for (const _char of strings[4]) {
        if (!strings[1].includes(_char)) {
            b_or_d.push(_char)
        }
    }

    const five_analysis: Record<string, LetterAnalysis> = {}
    for (const fiver of five) {
        analyse_letters(five_analysis, fiver)
    }

    const c_or_f: string[] = []
    let b = ''
    let e = ''
    let d = ''
    for (const [error_letter, analysis] of Object.entries(five_analysis)) {
        if (analysis.count === 1) {
            if (b_or_d.includes(error_letter)) {
                b = error_letter
                d = b_or_d[0] === error_letter ? b_or_d[1] : b_or_d[0]
            } else {
                e = error_letter
            }
        } else if (analysis.count === 2) {
            c_or_f.push(error_letter)
        }
    }

    strings[2] = five_analysis[e].occurs_in[0]
    strings[5] = five_analysis[b].occurs_in[0]
    for (const fiver of five) {
        if (fiver !== strings[2] && fiver !== strings[5]) {
            strings[3] = fiver
            break
        }
    }

    for (const sixer of six) {
        if (!(sixer.includes(c_or_f[0]) && sixer.includes(c_or_f[1]))) {
            strings[6] = sixer
            break
        }
    }
    
    for (const sixer of six) {
        if (sixer !== strings[6]) {
            if (sixer.includes(d)) {
                strings[9] = sixer
            } else {
                strings[0] = sixer
            }
        }
    }

    const digit_map: Record<string, number> = {}
    for (let index = 0; index < strings.length; index++) {
        const string = strings[index]
        digit_map[string] = index
    }

    total += get_number(display, digit_map)
}

console.log(total)