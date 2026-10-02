export const fullName = (table?: 'modes') => `lenix_starting${table && `_${table}`}` as const
