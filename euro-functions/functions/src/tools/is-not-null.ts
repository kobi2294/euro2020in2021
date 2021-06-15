export function isNotNull<T>(input: null | T): input is T {
    return input !== null;
}

export function isNotUndefined<T>(input: undefined | T): input is T {
    return input !== undefined;
}

export function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
    return (input !== undefined) && (input !== null);
}
