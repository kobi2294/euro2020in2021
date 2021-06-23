import * as axios from 'axios';
import * as cheerio from 'cheerio';

interface StageDataPair {
    stage: string,
    data: string;
}

interface Match {
    home: string | null,
    away: string | null,
    homeScore: number | null,
    awayScore: number | null,
    date: string,
    stage: string,
    time: string | null
}

export function parseMatches(datas: StageDataPair[]): Match[] {
    let res: Match[] = [];

    for (const pair of datas) {
        const stage = pair.stage;
        const $ = cheerio.load(pair.data);
        const matches = $('.match, .date-caption');
        let date!: string;

        matches.each((_, el) => {
            if ($(el).hasClass('date-caption')) {
                date = $(el).text();
            }

            if ($(el).hasClass('match')) {
                const [home, away] = $(el)
                    .find('.team__label')
                    .toArray()
                    .map(el2 => {
                        return $(el2).text();
                    });
                const [homeScore, awayScore] = $(el)
                    .find('.match__score-text')
                    .toArray()
                    .map(el2 => $(el2).text())
                    .map(str => Number(str));

                const time = $(el)
                    .find('.match__time')
                    .toArray()
                    .map(el2 => $(el2).text())[0];


                res.push({
                    away, awayScore, date, home, homeScore, stage, time
                });
            }
        })
    }

    console.log(res.length);
    console.log(JSON.stringify(res, null, 4));
    return res;
}

export async function getStageIds(): Promise<{[key: string]: number}> {
    const url = 'https://www.eurosport.com/football/calendar-result_evt36881.shtml';
    const html = (await axios.default.get(url)).data as string;
    const $ = cheerio.load(html);
    const rounds = $('.rounds-dropdown__rounds>.rounds-dropdown__round');
    const pairs = rounds
        .toArray()
        .map(el => [$(el).attr('data-label')!, Number($(el).attr('data-param-value'))!] as const);

    const res = Object.fromEntries(pairs);

    return res;
}

export async function main() {
    let url = 'https://www.eurosport.com/_ajax_/results_v8_5/results_teamsports_v8_5.zone?&domainid=135&mime=text/json&dropletid=146&sportid=22&eventid=36881&SharedPageTheme=black&DeviceType=desktop';
    let stageIds = await getStageIds();

    let datas: StageDataPair[] = await Promise.all(Object
        .keys(stageIds)
        .map(stage => axios.default
            .get(url, {
                        params: {
                            O2: 1,
                            langueid: 0,
                            mime: 'text/xml',
                            dropletid: 146,
                            sportid: 22,
                            eventid: 36881,
                            roundid: stageIds[stage]
                        }
            })
            .then(res => ({ stage, data: res.data as string }))));

    let res = parseMatches(datas);
}

main();

