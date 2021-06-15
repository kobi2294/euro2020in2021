import { NumberMapping, StringMapping } from "./mappings";

export function groupByString<T>(data: T[], keySelector: (item: T) => string): StringMapping<T[]> {
    const res: StringMapping<T[]> = {};

    data.forEach(item => {
        let key = keySelector(item);

        if (!res[key]) {
            res[key] = [];
        }

        res[key].push(item);
    })

    return res;
}

export function groupByNumber<T>(data: T[], keySelector: (item: T) => number): NumberMapping<T[]> {
    const res: NumberMapping<T[]> = {};

    data.forEach(item => {
        let key = keySelector(item);

        if (!res[key]) {
            res[key] = [];
        }

        res[key].push(item);
    })

    return res;
}