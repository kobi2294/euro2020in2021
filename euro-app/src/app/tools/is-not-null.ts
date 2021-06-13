import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export function isNotNull<T>(input: null | T): input is T {
    return input !== null;
}

export function isNotUndefined<T>(input: undefined | T): input is T {
    return input !== undefined;
}

export function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
    return (input !== undefined) && (input !== null);
}

export function filterNotNull<T>() {
    return (source$: Observable<null | T>) => source$.pipe(
        filter(isNotNull)
    );
}

export function filterNotUndefined<T>() {
    return (source$: Observable<undefined | T>) => source$.pipe(
        filter(isNotUndefined)
    );
}

export function filterNotNullOrUndefined<T>() {
    return (source$: Observable<undefined | null | T>) => source$.pipe(
        filter(isNotNullOrUndefined)
    );
}
