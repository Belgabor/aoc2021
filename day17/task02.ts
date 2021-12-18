// deno-lint-ignore-file camelcase ban-unused-ignore
export { }

interface Area {
    x_min: number
    x_max: number
    y_min: number
    y_max: number
}

interface Shot {
    x: number
    y: number
    vx: number
    vy: number
}

const target: Area = {
    x_min: 265,
    x_max: 287,
    y_min: -103,
    y_max: -58,
}

// const target: Area = {
//     x_min: 20,
//     x_max: 30,
//     y_min: -10,
//     y_max: -5,
// }

function hits({x, y}: Shot): undefined|boolean {
    if (x>target.x_max || y < target.y_min) {
        return undefined // Will never hit
    }

    if (x>=target.x_min && x<=target.x_max && y>=target.y_min && y<=target.y_max) {
        return true
    }

    return false // Can still hit
}

function step(shot: Shot) {
    shot.x += shot.vx
    shot.y += shot.vy
    if (shot.vx > 0) {
        shot.vx--
    }
    shot.vy--
}

function shoot(shot: Shot): number|undefined {
    let y_max = 0

    while (true) {
        // console.log(shot)
        step(shot)
        // console.log('-->', shot)
        const hit = hits(shot)
        if (hit === undefined) {
            return undefined
        }

        if (hit) {
            return y_max
        }

        y_max = Math.max(y_max??0, shot.y)
    }
}

function initShot(vx: number, vy: number): Shot {
    return {
        x: 0,
        y: 0,
        vx,
        vy,
    }
}

let best = 0
const the_hits: [number, number][] = []
for (let vy = -105; vy < 100000; vy++) {
    for (let vx = 2; vx < 300; vx++) {
        const shot = initShot(vx, vy)
        const result = shoot(shot)

        if (result !== undefined) {
            console.log(vx, vy)
            the_hits.push([vx, vy])
        }

        if (the_hits.length > best) {
            best = the_hits.length
            console.log(best)
        }
    }    
}

console.log(best)
