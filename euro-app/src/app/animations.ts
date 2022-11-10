import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";
import { cartesian } from "./tools/cartesian";

function upRoutes(count: number)  {
    let range = [...Array(count).keys()];
    return Array.from(cartesian(range, range))
            .filter(([a, b]) => a < b)
            .map(([a, b]) => `${a} => ${b}`)
            .join(', ');
}

function downRoutes(count: number) {
    let range = [...Array(count).keys()];
    return Array.from(cartesian(range, range))
            .filter(([a, b]) => a > b)
            .map(([a, b]) => `${a} => ${b}`)
            .join(', ');
}

const duration = '0.3s';

export const slideLeft = [
    style({ overflowX: 'hidden' }),
    query(':enter, :leave', [style({ position: 'absolute', width: '100%', height: '100%' })], {optional: true}),
    query(':enter', [style({ transform: 'translateX(100%)' })], {optional: true}),
    group([
        query(':leave', [animate(`${duration} ease-out`, style({ transform: 'translateX(-100%)' }))], {optional: true}),
        query(':enter', [animate(`${duration} ease-out`, style({ transform: 'translateX(0%)' }))], {optional: true})
    ]),
];

export const slideRight = [
    style({ overflowX: 'hidden' }),
    query(':enter, :leave', [style({ position: 'absolute', width: '100%', height: '100%' })], {optional: true}),
    query(':enter', [style({ transform: 'translateX(-100%)' })], {optional: true}),
    group([
        query(':leave', [animate(`${duration} ease-out`, style({ transform: 'translateX(100%)' }))], {optional: true}),
        query(':enter', [animate(`${duration} ease-out`, style({ transform: 'translateX(0%)' }))], {optional: true})
    ]),
];

export const slideInAnimation = trigger(
    'slideInOut', [
        transition(upRoutes(7), slideLeft), 
        transition(downRoutes(7), slideRight)
    ]
);
