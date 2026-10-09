import Cloudflare from 'cloudflare'
import { writeFile } from 'fs/promises'

const client = new Cloudflare()
const assets = new Set()

for await (const object of client.r2.buckets.objects.list(
	'lenix',
	{
		account_id: 'f5e9fdff75338a76039f9397081730cd',
		per_page: 1000,
	}
)) if (object.key !== undefined) assets.add(object.key)

	await writeFile(
	new URL('./assets.json', import.meta.url),
	JSON.stringify([...assets], null, 2),
)