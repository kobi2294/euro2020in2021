"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.getStageIds = exports.parseMatches = void 0;
var axios = __importStar(require("axios"));
var cheerio = __importStar(require("cheerio"));
function parseMatches(datas) {
    var res = [];
    var _loop_1 = function (pair) {
        var stage = pair.stage;
        var $ = cheerio.load(pair.data);
        var matches = $('.match, .date-caption');
        var date;
        matches.each(function (_, el) {
            if ($(el).hasClass('date-caption')) {
                date = $(el).text();
            }
            if ($(el).hasClass('match')) {
                var _a = $(el)
                    .find('.team__label')
                    .toArray()
                    .map(function (el2) {
                    return $(el2).text();
                }), home = _a[0], away = _a[1];
                var _b = $(el)
                    .find('.match__score-text')
                    .toArray()
                    .map(function (el2) { return $(el2).text(); })
                    .map(function (str) { return Number(str); }), homeScore = _b[0], awayScore = _b[1];
                var time = $(el)
                    .find('.match__time')
                    .toArray()
                    .map(function (el2) { return $(el2).text(); })[0];
                res.push({
                    away: away, awayScore: awayScore, date: date, home: home, homeScore: homeScore, stage: stage, time: time
                });
            }
        });
    };
    for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
        var pair = datas_1[_i];
        _loop_1(pair);
    }
    console.log(res.length);
    console.log(JSON.stringify(res, null, 4));
    return res;
}
exports.parseMatches = parseMatches;
function getStageIds() {
    return __awaiter(this, void 0, void 0, function () {
        var url, html, $, rounds, pairs, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://www.eurosport.com/football/calendar-result_evt36881.shtml';
                    return [4 /*yield*/, axios.default.get(url)];
                case 1:
                    html = (_a.sent()).data;
                    $ = cheerio.load(html);
                    rounds = $('.rounds-dropdown__rounds>.rounds-dropdown__round');
                    pairs = rounds
                        .toArray()
                        .map(function (el) { return [$(el).attr('data-label'), Number($(el).attr('data-param-value'))]; });
                    res = Object.fromEntries(pairs);
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.getStageIds = getStageIds;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var url, stageIds, datas, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://www.eurosport.com/_ajax_/results_v8_5/results_teamsports_v8_5.zone?&domainid=135&mime=text/json&dropletid=146&sportid=22&eventid=36881&SharedPageTheme=black&DeviceType=desktop';
                    return [4 /*yield*/, getStageIds()];
                case 1:
                    stageIds = _a.sent();
                    return [4 /*yield*/, Promise.all(Object
                            .keys(stageIds)
                            .map(function (stage) { return axios.default
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
                            .then(function (res) { return ({ stage: stage, data: res.data }); }); }))];
                case 2:
                    datas = _a.sent();
                    res = parseMatches(datas);
                    return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
main();
//# sourceMappingURL=main.js.map