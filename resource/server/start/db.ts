import { oxmysql } from "@overextended/oxmysql";
import { database, db } from "../db";
import { table } from "./utils";
import { asserts } from "@lenix/lenix";
import type { Start } from "types/index";

const create = (
  table: Parameters<typeof table>[0],
  cb: Parameters<ReturnType<typeof db.schema.withSchema>["createTableIfNotExists"]>[1],
) => db.schema.withSchema(database).createTableIfNotExists(table(table), cb);

const tables = [
  create("modes", (table) => {
    table.integer("charId").unsigned().primary();
    table.enum("type", ["warzone", "police", "gang", "justice", "race"] satisfies Start.Mode[]).notNullable();

    // table
    // 	.foreign('charId')
    // 	.references('charId')
    // 	.inTable('characters')
    // 	.onDelete('CASCADE')
  }),
];

setImmediate(async () => {
  for (const table of tables) {
    const result = await oxmysql.query(table.toQuery());
    asserts(result, "Failed to create a table");
  }
});
