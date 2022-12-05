export interface Audit {
    readonly email: string;
    readonly displayName: string;
    readonly agent: string;
    readonly standalone: boolean;
    readonly displayModeStandalone: boolean;
    readonly version: string;
    readonly timestamp: string;
}