// deno-lint-ignore-file camelcase ban-unused-ignore
/**
 * Dijkstra's Algorithm
 */
export { }
const test = false
const data = await Deno.readTextFile(test ? './test_data.txt' : './data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

interface PacketBase {
    version: number
    type: 4 | number
}

interface Operator extends PacketBase {
    type: number
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
    while(true) {
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

function read_op(binary: string[], version: number, type: number): ParseResult {
    let length = 6
    const subpackets: Packet[] = []

    const length_type = <'0'|'1'>read_bits(binary, 1)
    length += 1

    if (length_type === '0') {
        let bit_total = read_number(binary, 15)
        length += 15
        length += bit_total
        while (bit_total>0) {
            const packet_result = read_packet(binary)
            bit_total -= packet_result.length
            subpackets.push(packet_result.packet)
        }
    } else {
        let packets = read_number(binary, 11)
        length += 11
        while (packets>0) {
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

    switch(type) {
        case 4:
            return read_literal(binary, version)
        default:
            return read_op(binary, version, type)
    }
}

function sum_versions(packet: Packet): number {
    let sum = packet.version
    if (packet.type !== 4) {
        for (const subpacket of (<Operator>packet).subpackets) {
            sum += sum_versions(subpacket)
        }
    }
    return sum
}

function parse_packet(packet: string) {
    console.log('---')
    console.log('Packet '+packet)

    let binary = ''

    for (const char of packet) {
        binary += map[char] ?? ''
    }
    console.log(binary)

    const binary_array = binary.split('')
    const result = read_packet(binary_array)

    console.log(result)
    console.log(sum_versions(result.packet))
}