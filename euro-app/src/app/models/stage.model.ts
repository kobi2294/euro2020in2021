
export const STAGES = [
    'Group 1',
    'Group 2', 
    'Group 3', 
    'Group 4', 
    'Group 5', 
    'Group 6', 
    'Round Of 16', 
    'Quarter Finals', 
    'Semi Finals', 
    'Finals'
] as const;

export type Stage = typeof STAGES[number];
