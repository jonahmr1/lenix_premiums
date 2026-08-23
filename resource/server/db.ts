import { asserts } from "@lenix/lenix"
import knex from "knex"

export const db = knex({ client: 'mysql' })

const mySqlConnectionString = GetConvar('mysql_connection_string', '')
asserts(mySqlConnectionString, 'Could not get database name')

export const database = new URL(mySqlConnectionString).pathname.slice(1)
asserts(database.length, 'Could not get database name')
