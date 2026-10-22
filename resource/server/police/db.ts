import { Constants } from 'common/config/constants'
import { createTable, queryTables } from "../db";

const tables = [
	createTable('start', (table) => {
		table.integer("charId").unsigned().primary();
		table.string('callsign', Constants.roster.max_callsign_length).nullable().unique()

		// table
		// 	.foreign('charId')
		// 	.references('charId')
		// 	.inTable('characters')
		// 	.onDelete('CASCADE')
	}),
];

queryTables(tables)