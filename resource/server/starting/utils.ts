export const fullName = (table?: string) => `lenix_starting${table && `_${table}`}` as const
