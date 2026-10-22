import { createTable, db, queryTables } from "../db";
import type { Start } from "types/index";

const tables = [
  createTable('start', (table) => {
    table.integer("charId").unsigned().primary();
    table.enum("type", ["warzone", "police", "gang", "justice", "race"] satisfies Start.Mode[]).notNullable();

    // table
    // 	.foreign('charId')
    // 	.references('charId')
    // 	.inTable('characters')
    // 	.onDelete('CASCADE')
  }),
];

queryTables(tables)