import { Constants } from 'common/config/constants'
import { createTable, queryTables } from "../db";

const tables = [
	createTable('police', (table) => {
		table.integer("charId").unsigned().primary();
		table.specificType(
      'callsign',
      `VARCHAR(${Constants.roster.max_callsign_length}) UNIQUE`,
    )
    .nullable()

		// table
		// 	.foreign('charId')
		// 	.references('charId')
		// 	.inTable('characters')
		// 	.onDelete('CASCADE')
	}),
];

queryTables(tables)