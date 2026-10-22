import type { Start } from "types/index";

export const table = (table: Start.Mode | 'start') => `lenix${table ? `_${table}` : ''}` as const;
