import { oxmysql } from '@overextended/oxmysql'
import knex from 'knex'

const db = knex({ client: 'mysql' })

const mySqlConnectionString = GetConvar('mysql_connection_string', '')
if (!mySqlConnectionString.length) throw 'Could not get database name'

const database = new URL(mySqlConnectionString).pathname.slice(1)
if (!database.length) throw 'Could not get database name'

export const tablePrefix = 'lenix_competitive:'

const create = (
	table: string,
	cb: Parameters<ReturnType<typeof db.schema.withSchema>['createTableIfNotExists']>[1]
) => db.schema.withSchema(database).createTableIfNotExists(`${tablePrefix}${table}`, cb)

const tables = [
	create('profiles', table => {
		table.integer('profile_id').unsigned().primary()
		table.string('name', 32).notNullable()
		table.enum('status', ['online', 'offline', 'dnd']).notNullable().defaultTo('online')
	}),
	create('friends', table => {
		table.integer('sender_id').unsigned().notNullable()
		table.integer('receiver_id').unsigned().notNullable()
		table.enum('status', ['pending', 'accepted']).notNullable()

		table.primary(['sender_id', 'receiver_id'])
	}),
	create('stats', table => {
		table.integer('profile_id').unsigned().primary()
		table.integer('kills').unsigned().notNullable().defaultTo(0)
		table.integer('deaths').unsigned().notNullable().defaultTo(0)
		table.integer('assists').unsigned().notNullable().defaultTo(0)
		table.integer('wins').unsigned().notNullable().defaultTo(0)
		table.integer('losses').unsigned().notNullable().defaultTo(0)
	}),
	create('matches', table => {
		table.increments('match_id').primary()
		table.string('mode', 16).notNullable()
		table.string('map', 64).notNullable()
		table.integer('played_at').unsigned().notNullable()
	}),
	create('performances', table => {
		table.integer('match_id').unsigned().notNullable()
		table.integer('profile_id').unsigned().notNullable()
		table.enum('result', ['win', 'loss']).notNullable()
		table.integer('score_change').notNullable()
		table.integer('kills').unsigned().notNullable().defaultTo(0)
		table.integer('deaths').unsigned().notNullable().defaultTo(0)
		table.integer('assists').unsigned().notNullable().defaultTo(0)

		table.primary(['match_id', 'profile_id'])
	})
]

;(async () => {
	for (const table of tables) {
		const result = await oxmysql.query(table.toQuery())
		if (!result) throw `Failed to create a table`
	}
})