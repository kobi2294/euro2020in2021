import { CountryEnum } from "./country-enum.model";
import { StageEnum } from "./stage-enum.model";

export interface Match {
    id: number, 
    date: string, 
    home: CountryEnum, 
    away: CountryEnum, 
    stage?: StageEnum, 
    homeScore?: number | null, 
    awayScore?: number | null
}