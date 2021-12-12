// deno-lint-ignore-file camelcase ban-unused-ignore
export { }
const test = false
const data = await Deno.readTextFile(test?'./test_data.txt':'./data.txt')
const lines = data.split(/\r?\n/)
console.log(lines)

const line_parser = (new RegExp(/^(?<from>\w+)-(?<to>\w+)$/))

const nodes: Record<string, string[]> = {}


function add_link_to(node: string, to: string) {
    if (nodes[node] === undefined) {
        nodes[node] = []
    }
    nodes[node].push(to)
}

for (const line of lines) {
    const match = line_parser.exec(line);

    if (!match) {
        Deno.exit()
        break
    }

    add_link_to(match.groups?.from ?? '', match.groups?.to ??'');
    add_link_to(match.groups?.to ?? '', match.groups?.from ??'');
}

function serialize(nodes: string[]): string {
    return nodes.join('-')
}

function isLower(node: string): boolean {
    return node.toLocaleLowerCase() === node
}

const explored: Record<string, boolean> = {}


const current_path: string[] = []
const used_lower: Record<string, number> = {}
const found_paths: string[][] = []

function hasTwiceUsed(): boolean {
    for (const count of Object.values(used_lower)) {
        if (count > 1) {
            return true
        }
    }
    return false
}

function abortThis(node: string): boolean {
    if (!isLower(node)) {
        return false
    }

    if (node === 'start' && used_lower['start']>0) {
        return true
    }

    const current = used_lower[node] ?? 0
    if (current === 0) {
        return false
    }
    if (current > 1) {
        return true
    }

    // If we get here, node has been used exactly once
    return hasTwiceUsed()
}

function explore(node: string) {
    if (node === 'end') {
        const full = [...current_path, 'end']
        explored[serialize(full)] = true
        found_paths.push(full)
        console.log(serialize(full))
        return
    }

    if (abortThis(node)) {
        explored[serialize([...current_path, node])] = true
        return
    }


    current_path.push(node)
    if (isLower(node)) {
        used_lower[node] = (used_lower[node] ?? 0) + 1
    }

    for (const link of nodes[node]) {
        explore(link)
    }

    if (isLower(node)) {
        used_lower[node]--
    }
    current_path.pop()
}

explore('start')
console.log(found_paths)
console.log(found_paths.length)