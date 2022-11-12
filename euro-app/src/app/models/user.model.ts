import { Guess } from "./guess.model";

export interface User {
    email: string, 
    displayName: string, 
    photoUrl: string, 
    groups?: string[], 
    admin?: boolean, 
    super?: boolean
}