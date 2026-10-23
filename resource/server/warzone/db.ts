import { createTable, queryTables } from '../db'
import type { Warzone } from 'types/index'

/* FORIEGN */
const tables = [
	createTable('warzone_profiles', table => {
		table.string('profile_id', 64).primary()
		table.string('name', 32).notNullable()
		table
			.enum('status', ['online', 'offline', 'dnd'] satisfies Warzone.Profile['status'][])
			.notNullable()
			.defaultTo('online')
	}),
	createTable('warzone_friends', table => {
		table.string('sender_id', 64).notNullable()
		table.string('receiver_id', 64).notNullable()
		table.enum('status', ['pending', 'accepted']).notNullable()

		table.primary(['sender_id', 'receiver_id'])
	}),
	createTable('warzone_matches', table => {
		table.increments('match_id').primary()
		table.string('map', 64).notNullable()
		table.integer('played_at').unsigned().notNullable()
	}),
	createTable('warzone_performances', table => {
		table.integer('match_id').unsigned().notNullable()
		table.string('profile_id', 64).notNullable()
		table.enum('result', ['win', 'loss'] satisfies Warzone.Performance['result'][]).notNullable()
		table.integer('kills').unsigned().notNullable().defaultTo(0)
		table.integer('deaths').unsigned().notNullable().defaultTo(0)
		table.integer('assists').unsigned().notNullable().defaultTo(0)

		table.primary(['match_id', 'profile_id'])
	}),
]

queryTables(tables)
