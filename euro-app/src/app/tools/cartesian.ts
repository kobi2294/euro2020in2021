export function* cartesian<T>(first: T[], second: T[]): Iterable<[T, T]> {
    for (const a of first) {
        for (const b of second) {
            yield [a, b];
        }
    }
}