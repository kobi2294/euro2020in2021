export type StringMapping<T> = {[key: string]: T};

export type NumberMapping<T> = {[key: number]: T};

export function mapStrings(data: string[]): StringMapping<true> {
    let res: StringMapping<true> = {};
    data.forEach(item => {
        res[item]=true;
    });

    return res;
}