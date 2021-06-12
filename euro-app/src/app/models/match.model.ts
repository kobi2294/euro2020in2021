import { Country } from "./country.model";
import { Stage } from "./stage.model";

export interface Match {
    id: number, 
    date: string, 
    home: Country, 
    away: Country, 
    stage?: Stage, 
    homeScore: number | null, 
    awayScore: number | null
}