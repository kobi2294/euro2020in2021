export function count<T>(data: T[], predicate: (item: T) => boolean): number {
    if (!data) return 0;
    return data.reduce((sum, item) => predicate(item) ?  sum + 1 : sum, 0);
}