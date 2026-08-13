export const getProfileId = (client: number) => GetPlayerIdentifierByType(client.toString(), 'license')

export const getSourceByProfileId = (profile_id: string) => Number(getPlayers().find(player => getProfileId(Number(player)) === profile_id))

export const fullName = (table: string) => `lenix_competitive_${table}` as const
