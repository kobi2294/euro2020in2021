export type StringMapping<T> = {[key: string]: T};

export type NumberMapping<T> = {[key: number]: T};

export function mapStrings(data: string[]): StringMapping<true> {
    let res: StringMapping<true> = {};
    data.forEach(item => {
        res[item]=true;
    });

    return res;
}

export function mapNumbers(data: number[]): NumberMapping<true> {
    let res: NumberMapping<true> = {};
    data.forEach(item => {
        res[item]=true;
    });

    return res;
}

export function toNumberMapping<T>(data: T[], keySelector: (item: T) => number): NumberMapping<T> {
    let res: NumberMapping<T> = {};
    data.forEach(item => {
        let key = keySelector(item);
        res[key]=item;
    });
    return res;
} 

export function toStringMapping<T>(data: T[], keySelector: (item: T) => string): StringMapping<T> {
    let res: StringMapping<T> = {};
    data.forEach(item => {
        let key = keySelector(item);
        res[key]=item;
    });
    return res;
} 