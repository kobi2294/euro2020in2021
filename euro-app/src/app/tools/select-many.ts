export function selectMany<K, T>(data: K[], selector: (item: K) => T[]): T[] {
    let res: T[] = [];

    data.forEach(item => {
        let values = selector(item);
        res = [...res, ...values];
    });

    return res;
}