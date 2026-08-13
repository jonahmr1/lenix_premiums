import { asserts } from "@lenix/lenix"

export const getProfileId = (client: number) => GetPlayerIdentifierByType(client.toString(), 'license')

export const getSourceByProfileId = (profile_id: string) => {
	const src = Number(getPlayers().find(player => getProfileId(Number(player)) === profile_id))
	asserts(src, `Failed to get profile_id<${profile_id}>'s source`)

	return src
}

export const fullName = (table: string) => `lenix_competitive_${table}` as const
