import { Match } from "../models/match.model";
import * as cheerio from 'cheerio';

export function parseMatches(html: string): Match[] {

    const $ = cheerio.load(html);
    const elements = $('.match');

    elements.each((i, elem) => {
        const teams = $(elem).find('team__name>team__label').text();
        console.log(teams);
        const score = $(elem).find('match__score-text').text();
        console.log(score);
    })

    return [];
}