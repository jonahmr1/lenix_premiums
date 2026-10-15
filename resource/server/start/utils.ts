export const table = (table?: "modes") => `lenix_starting${table && `_${table}`}` as const;
