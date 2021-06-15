export function sum<T>(data: T[], selector: (item: T) => number): number {
    let sum = 0;

    for (const item of data) {
        sum += selector(item);
    }

    return sum;
}