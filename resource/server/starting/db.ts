import { oxmysql } from "@overextended/oxmysql"
import { database, db } from "../db"
import { fullName } from "./utils"
import { asserts } from "@lenix/lenix"


const create = (
	table: string,
	cb: Parameters<ReturnType<typeof db.schema.withSchema>['createTableIfNotExists']>[1]
) => db.schema.withSchema(database).createTableIfNotExists(fullName(table), cb)

const tables = [
	create('characters', table => {
		table.integer('charId').unsigned().primary()
		table.enum('type', ['competitive', 'outlaw']).notNullable()

		table
			.foreign('charId')
			.references('charId')
			.inTable('characters')
			.onDelete('CASCADE')
	}),
]

setImmediate(async () => {
	for (const table of tables) {
		const result = await oxmysql.query(table.toQuery())
		asserts(result, 'Failed to create a table')
	}
})