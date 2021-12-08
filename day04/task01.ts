// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const data = await Deno.readTextFile('./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const numbers = lines[0].split(',').map(line => parseInt(line))

const line_parser = (new RegExp(/^( ?(?<a>\d+)) ( ?(?<b>\d+)) ( ?(?<c>\d+)) ( ?(?<d>\d+)) ( ?(?<e>\d+))$/))

lines.shift()

const boards: number[][][] = []
const marks: boolean[][][] = []
while (lines.length) {
    const board: number[][] = Array(5)
    const mark: boolean[][] = Array(5)

    lines.shift()

    for (let index = 0; index < 5; index++) {
        const line = lines.shift() ?? ''
        const matches = line_parser.exec(line)

        if (!matches) {
            Deno.exit(1)
        }
        board[index] = Array(5)
        mark[index] = Array(5).fill(false)
        board[index][0] = parseInt(matches.groups?.a ?? '')
        board[index][1] = parseInt(matches.groups?.b ?? '')
        board[index][2] = parseInt(matches.groups?.c ?? '')
        board[index][3] = parseInt(matches.groups?.d ?? '')
        board[index][4] = parseInt(matches.groups?.e ?? '')
    }

    console.log(board)
    boards.push(board)
    marks.push(mark)
}

function do_mark(value: number) {
    for (let board_index = 0; board_index < boards.length; board_index++) {
        const board = boards[board_index];
        for (let row_index = 0; row_index < board.length; row_index++) {
            const row = board[row_index];
            for (let col_index = 0; col_index < row.length; col_index++) {
                const col = row[col_index];
                if (col === value) {
                    marks[board_index][row_index][col_index] = true
                }
            }
        }
    }
}

function check(): number|undefined {
    for (let board_index = 0; board_index < boards.length; board_index++) {
        const board = marks[board_index];
        for (let row_index = 0; row_index < board.length; row_index++) {
            const row = board[row_index];
            let count = 0
            for (let col_index = 0; col_index < row.length; col_index++) {
                const col = row[col_index];
                if (col) {
                    count++
                }
            }
            if (count === 5) {
                return board_index
            }
        }

        for (let col_index = 0; col_index < 5; col_index++) {
            let count = 0
            for (let row_index = 0; row_index < 5; row_index++) {
                if (board[row_index][col_index]) {
                    count++
                }
            }
            if (count === 5) {
                return board_index
            }                
        }
    }

    return undefined
}

for (const num of numbers) {
    console.log(num)
    do_mark(num)
    const b = check()

    if (b !== undefined) {
        console.log('Found:', b)
        const board = boards[b]
        const mark = marks[b]
        let board_val = 0

        for (let row_index = 0; row_index < board.length; row_index++) {
            const row = board[row_index];
            for (let col_index = 0; col_index < row.length; col_index++) {
                const col = row[col_index];
                if (!mark[row_index][col_index]) {
                    board_val += col
                }
            }
        }

        console.log(board_val * num)

        Deno.exit()
    }
}