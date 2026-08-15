import { asserts } from "@lenix/lenix"

export const getProfileId = (client: number) => GetPlayerIdentifierByType(client.toString(), 'license')

export const fullName = (table: string) => `lenix_competitive_${table}` as const
