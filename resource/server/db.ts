import { asserts } from '@lenix/lenix'
import type { Start } from 'types/index'
import knex, { Knex } from 'knex'
import { oxmysql } from '@overextended/oxmysql'

export const db = knex({ client: 'mysql' })

const mySqlConnectionString = GetConvar('mysql_connection_string', '')
asserts(mySqlConnectionString, 'Could not get database name')

export const database = new URL(mySqlConnectionString).pathname.slice(1)
asserts(database.length, 'Could not get database name')

export const table = (
	table: Start.Mode | 'start' | 'warzone_profiles' | 'warzone_matches' | 'warzone_friends' | 'warzone_performances',
) => `lenix_${table}` as const

export const createTable = (
	tableName: Parameters<typeof table>[0],
	cb: Parameters<ReturnType<typeof db.schema.withSchema>['createTableIfNotExists']>[1],
) => db.schema.withSchema(database).createTableIfNotExists(table(tableName), cb)

export const queryTables = async (tables: Knex.SchemaBuilder[]) => {
	for (const table of tables) {
		const result = await oxmysql.query(table.toQuery())
		if (!result) throw `Failed to createTable a table`
	}
}
