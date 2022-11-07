
export const STAGES = [
    'Group 1',
    'Group 2', 
    'Group 3', 
    'Group 4', 
    'Group 5', 
    'Group 6', 
    'Group 7', 
    'Group 8',
    'Round Of 16', 
    'Quarter Finals', 
    'Semi Finals', 
    'Third Place', 
    'Finals'
] as const;

export type StageEnum = typeof STAGES[number];
