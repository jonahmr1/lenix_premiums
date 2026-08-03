import { asserts } from "@lenix/lenix"
import { createPolar, type Environment } from "@polar-sh/sdk/2026-04"
import { palette } from 'lenix'
import { ResourceName } from "common/resource"

const LICENSE = GetConvar('lenix:license_key', '')
asserts(LICENSE.length, palette('red', 'Could not load license key, make sure you add the following into your server config: `set lenix:license_key YOUR_LENIX_LICENSE_KEY`'))

const ORGANIZATION = '6e2643d5-12e4-4b8a-80e7-a5107fe65408'
const ENVIRONMENT: Environment = "production"
const SERVER_NAME = GetConvar("sv_hostname", GetConvar("sv_projectName", "Unknown Name"))
const VALIDATION_INTERVAL = 15

;(async () => {
	const {
		customerPortal: {
			licenseKeys: {
				validate, activate, deactivate
			}
		}
	} = createPolar({
		accessToken: "",
		environment: ENVIRONMENT,
	})

	const serverInstance = crypto.randomUUID()
	const activation = await activate({
		key: LICENSE,
		organization_id: ORGANIZATION,
		label: `fivem:${SERVER_NAME}`,
		conditions: {
			server_instance: serverInstance,
		},
	})

	const validateLicense = async () => {
		const validation = await validate({
			key: LICENSE,
			organization_id: ORGANIZATION,
			activation_id: activation.id,
			conditions: {
				server_id: serverInstance,
			},
		})

		asserts(validation.status !== 'revoked', `Your license is ${palette('red', validation.status)}`)
		asserts(validation.status !== 'disabled', `Your license is ${palette('yellow', validation.status)}`)
	}

	await validateLicense()

	const validationInterval = setInterval(async () => {
		try {
			await validateLicense()
		} catch (error) {
			console.error(error)
			StopResource(ResourceName)
		}
	}, 60_000 * VALIDATION_INTERVAL)

	on("onResourceStop", async (resourceName: string) => {
		if (resourceName !== ResourceName) return

		clearInterval(validationInterval)
		await deactivate({
			key: LICENSE,
			organization_id: ORGANIZATION,
			activation_id: activation.id,
		})
	})

	console.log(palette('green', 'License validated successfully'))
	
	import("common")
})()
