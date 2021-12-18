// deno-lint-ignore-file camelcase ban-unused-ignore
/**
 * Dijkstra's Algorithm
 */
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

type OpType = 0 | 1 | 2 | 3 | 5 | 6 | 7

interface PacketBase {
    version: number
    type: 4 | OpType
}

interface Operator extends PacketBase {
    type: OpType
    subpackets: Packet[]
}

interface LiteralValue extends PacketBase {
    type: 4
    value: number
}

type Packet = Operator | LiteralValue

interface ParseResult {
    packet: Packet
    length: number
}

const map: Record<string, string> = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111',
}

for (const line of lines) {
    parse_packet(line)
}

function read_bits(binary: string[], count: number): string {
    let value = ''
    for (let index = 0; index < count; index++) {
        value += binary.shift()
    }
    return value
}

function read_number(binary: string[], bits: number) {
    return parseInt(read_bits(binary, bits), 2)
}

function read_literal(binary: string[], version: number): ParseResult {
    let length = 6
    let num = ''
    while (true) {
        const nibble = read_bits(binary, 5)
        length += 5
        num += nibble.slice(1)
        if (nibble[0] === '0') {
            break
        }
    }
    return {
        packet: {
            version,
            type: 4,
            value: parseInt(num, 2),
        },
        length,
    }
}

function read_op(binary: string[], version: number, type: OpType): ParseResult {
    let length = 6
    const subpackets: Packet[] = []

    const length_type = <'0' | '1'>read_bits(binary, 1)
    length += 1

    if (length_type === '0') {
        let bit_total = read_number(binary, 15)
        length += 15
        length += bit_total
        while (bit_total > 0) {
            const packet_result = read_packet(binary)
            bit_total -= packet_result.length
            subpackets.push(packet_result.packet)
        }
    } else {
        let packets = read_number(binary, 11)
        length += 11
        while (packets > 0) {
            packets--
            const packet_result = read_packet(binary)
            length += packet_result.length
            subpackets.push(packet_result.packet)
        }
    }

    return {
        packet: {
            version,
            type,
            subpackets,
        },
        length,
    }
}

function read_packet(binary: string[]): ParseResult {
    const version = read_number(binary, 3)
    const type = read_number(binary, 3)

    switch (type) {
        case 4:
            return read_literal(binary, version)
        default:
            return read_op(binary, version, <OpType>type)
    }
}

function evaluate(packet: Packet): number {
    switch (packet.type) {
        case 4:
            return packet.value
        case 0:
            return packet.subpackets.map(packet => evaluate(packet)).reduce((partial_sum, value) => partial_sum + value, 0)
        case 1:
            return packet.subpackets.map(packet => evaluate(packet)).reduce((partial_product, value) => partial_product * value, 1)
        case 2:
            return Math.min(...packet.subpackets.map(packet => evaluate(packet)))
        case 3:
            return Math.max(...packet.subpackets.map(packet => evaluate(packet)))
        case 5:
            return evaluate(packet.subpackets[0]) > evaluate(packet.subpackets[1]) ? 1 : 0
        case 6:
            return evaluate(packet.subpackets[0]) < evaluate(packet.subpackets[1]) ? 1 : 0
        case 7:
            return evaluate(packet.subpackets[0]) === evaluate(packet.subpackets[1]) ? 1 : 0
    }

}

function parse_packet(packet: string) {
    console.log('---')
    console.log('Packet ' + packet)

    let binary = ''

    for (const char of packet) {
        binary += map[char] ?? ''
    }
    console.log(binary)

    const binary_array = binary.split('')
    const result = read_packet(binary_array)

    console.log(result)
    console.log(evaluate(result.packet))
}