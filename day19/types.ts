import {Maybe} from '../lib/types.ts'

export type Order = 0 | 1 | 2
export type Direction = -1 | 1
export interface Axis {
    order: Order
    direction: Direction
}

export interface Orientation {
    x: Axis
    y: Axis
    z: Axis
}

export type Location = [number, number, number]

export interface Scanner {
    id: number
    beacons: Location[]
    orientation: Maybe<Orientation>
    location: Maybe<Location>
}

export interface ResolvedScanner extends Scanner {
    orientation: Orientation
    location: Location
}