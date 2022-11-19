export interface Audit {
    readonly email: string;
    readonly displayName: string;
    readonly agent: string;
    readonly standalone: boolean;
    readonly version: string;
    readonly timestamp: string;
}