import { asserts, random, State } from '@lenix/lenix'
import { cache, checkDependency, sleep } from '@overextended/ox_lib'
import { notify, createVehicle, registerContext, showContext, createPed } from '@overextended/ox_lib/client'
import type { Vec3, Vec4 } from 'lenix'
import { api, useTimer } from 'lenix/client'
import type { AtLeastOne } from 'types/index'
import { behavior } from '../lib'
import { GetPlayer } from '@overextended/ox_core/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_target', '1.18.1', true)

interface Membership {
	charIds: number[]
	groups: {
		name: string
		grade?: number
	}[]
}

type Model = {
	[Category in keyof typeof VEHICLES]: keyof typeof VEHICLES[Category]
}[keyof typeof VEHICLES]

const deleteAfter = 15 * 60_000
const warnAt = deleteAfter * 0.1
const sets = 10
const interval = 200

const state = new State({ lastVehicle: null as number | null })

const variants: Record<string, {
	model: Model
	allowed?: AtLeastOne<Membership>
	disallowed?: AtLeastOne<Membership>
	color?: [number, number, number]
	plate?: string
	image?: string
}[]> = {
	std: [
		{
			model: 'cypher',
			allowed: {
				charIds: [1],
				groups: [
					{
						name: 'police',
						grade: 2
					}
				]
			},
			disallowed: {
				charIds: [2],
				groups: [
					{
						name: 'cartel',
						grade: 1
					}
				]
			},
			plate: `LENIX${random(100, 999)}`,
			color: [0, 255, 206],
		}
	],
}

const locations = [
	{
		ped: [-252.2817, -297.2987, 21.6264, 69.0925],
		vehicle: [-256.1688, -333.2883, 29.1064, 9.207],
		variant: 'std',
	},
	{
		ped: [-295.1785, -622.0973, 32.7741, 175.3196],
		vehicle: [-301.8, -626.566, 32.1928, 271.8865],
		variant: 'std',
	},
	{
		ped: [1851.5194, 2583.6697, 45.6639, 357.8237],
		vehicle: [1855.4651, 2578.8855, 45.4116, 271.0542],
		variant: 'std',
	},
	{
		ped: [-292.8378, -985.7634, 31.0969, 41.8034],
		vehicle: [-301.6614, -990.4818, 31.0812, 343.2394],
		variant: 'std',
	},
	{
		ped: [418.6655, -991.6953, 21.3117, 90.1289],
		vehicle: [429.1385, -986.8941, 21.3117, 91.0006],
		variant: 'std',
	},
] as const satisfies {
	ped: Vec4
	vehicle: Vec4
	variant: keyof typeof variants
}[]

const game = {
	despawnLastVehicle: () => {
		if (!state.lastVehicle) return 
	
		DeleteEntity(state.lastVehicle)
		state.lastVehicle = null
	
		notify({
			title: 'Your vehicle have been removed.',
			type: 'success',
		})
	},
	
	handleDeletionSchedule(vehicleHandle: number) {
		const clearTimer = useTimer({
			duration: deleteAfter,
			updateInterval: warnAt,
			onTick: timeLeft => {
				if (vehicleHandle !== state.lastVehicle) {
					clearTimer()
					return
				}
	
				const occupied = GetVehicleNumberOfPassengers(vehicleHandle) > 0 || !IsVehicleSeatFree(vehicleHandle, -1)
				if (occupied) {
					this.handleDeletionSchedule(vehicleHandle)
					clearTimer()
					return
				}
	
				if (timeLeft <= warnAt) {
					notify({
						title: `Your unattended vehicle will be removed in ${Math.ceil(warnAt / 1000)} seconds.`,
						type: 'warning',
					})
					return
				}
			},
			onEnd: () => {
				if (vehicleHandle !== state.lastVehicle) return
	
				this.despawnLastVehicle()
				clearTimer()
			}
		})
	},
	
	async spawnVehicle(model: Model, spawn: Vec4, plate = 'LENIX', rgb: Vec3 = [255, 255, 255]) {
		this.despawnLastVehicle()
	
		const { handle } = await createVehicle(model, ...spawn, true)
	
		for (const i of Array(sets).keys()) {
			setTimeout(() => {
				SetEntityAlpha(handle, 51, false)
				setTimeout(() => SetEntityAlpha(handle, 102, false), 100)
			}, i * interval)
		}
		await sleep(sets * interval)
		ResetEntityAlpha(handle)
	
		plate && SetVehicleNumberPlateText(handle, plate)
	
		SetVehicleEngineOn(handle, true, false, true)
		// @ts-expect-error double check the args
		TaskEnterVehicle(cache.ped, handle, 1000, -1, 1.0, 0, 0)
	
		SetVehicleCustomPrimaryColour(handle, ...rgb)
		SetVehicleCustomSecondaryColour(handle, ...rgb)
	
		state.lastVehicle = handle
		this.handleDeletionSchedule(handle)
	}
}

const isEligible = (vehicleMenu: typeof variants[keyof typeof variants][number]) => {
	const player = GetPlayer()

	const disallowed = vehicleMenu.disallowed
	if (disallowed) {
		if (disallowed.charIds) {
			asserts(player.charId)

			if (disallowed.charIds.includes(player.charId)) return
		}

		if (disallowed.groups) {
			for (const { name, grade } of disallowed.groups) {
				const currentGrade: number | undefined = player.getGroup(name)
				if (currentGrade && grade && grade > currentGrade) return
			}
		}
	}
	const allowed = vehicleMenu.allowed
	if (allowed) {
		if (allowed.charIds) {
			asserts(player.charId)

			if (allowed.charIds.includes(player.charId)) return true
		}

		if (allowed.groups) {
			for (const { name, grade } of allowed.groups) {
				const currentGrade: number | undefined = player.getGroup(name)
				if (!currentGrade || grade && grade > currentGrade) return
			}
		}
	}
	return true
}

setImmediate(() => {
	for (const [i, { vehicle, variant }] of locations.entries()) {
		registerContext({
			id: `vehicles_${variant}_menu_${i}`,
			title: 'Vehicles Available',
			options: [
				...variants[variant]!.map(vehicleMenu => ({
					title: vehicleMenu.model,
					onSelect: () => game.spawnVehicle(vehicleMenu.model, vehicle, vehicleMenu.plate, vehicleMenu.color),
					image: `https://docs-backend.fivem.net/vehicles/${vehicleMenu.model}.webp`,
					disabled: isEligible(vehicleMenu)
				})),
			],
		})
	}
})

const load = async () => {
	const disposes = await Promise.all(locations.map(async ({ ped, vehicle, variant: menu }, i) => {
		const name = [`vehicles_${menu}_menu_${i}`, `vehicles_${menu}_return_${i}`] as const
		const entity = await createPed('a_m_m_prolhost_01', ...(ped satisfies Vec4 as Vec4))
		behavior(entity.handle, 'WORLD_HUMAN_CLIPBOARD')

		api.ox_target?.addLocalEntity?.(entity.handle, [
			{
				name: name[0],
				icon: 'fas fa-bars',
				label: 'Vehicles',
				onSelect: async () => {
					const occupied = IsPositionOccupied(vehicle[0], vehicle[1], vehicle[2], 3.0, false, true, true, false, false, 0, false,)
	
					if (occupied) {
						notify({
							title: 'Spawn point is occupied.',
						})
						return
					}
					showContext(name[0])
				},
			},
			{
				name: name[1],
				icon: 'fas fa-trash-arrow-up',
				label: 'Return The Vehicle',
				onSelect: async () => {
					game.despawnLastVehicle()
				},
			},
		])

		return () => api.ox_target?.removeLocalEntity?.(entity.handle, [...name])
	}))

	return () => {
		for (const dispose of disposes) dispose()
	}
}

export default [
	load()
]


const VEHICLES = {
	Compacts: {
		asbo: "Asbo",
		blista: "Blista",
		brioso: "Brioso R/A",
		brioso2: "Brioso 300",
		brioso3: "Brioso 300 Widebody",
		club: "Club",
		dilettante: "Dilettante",
		dilettante2: "Dilettante",
		issi2: "Issi",
		issi3: "Issi Classic",
		issi4: "Apocalypse Issi",
		issi5: "Future Shock Issi",
		issi6: "Nightmare Issi",
		kanjo: "Blista Kanjo",
		panto: "Panto",
		prairie: "Prairie",
		rhapsody: "Rhapsody",
		weevil: "Weevil"
	},
	Sedans: {
		asea: "Asea",
		asea2: "Asea",
		asterope: "Asterope",
		asterope2: "Asterope GZ",
		cinquemila: "Cinquemila",
		cog55: "Cognoscenti 55",
		cog552: "Cognoscenti 55 (Armored)",
		cognoscenti: "Cognoscenti",
		cognoscenti2: "Cognoscenti (Armored)",
		deity: "Deity",
		driftchavosv6: "Chavos V6",
		drifthardy: "Hardy",
		emperor: "Emperor",
		emperor2: "Emperor",
		emperor3: "Emperor",
		fugitive: "Fugitive",
		glendale: "Glendale",
		glendale2: "Glendale Custom",
		hardy: "Hardy",
		impaler5: "Impaler SZ",
		ingot: "Ingot",
		intruder: "Intruder",
		limo2: "Turreted Limo",
		minimus: "Minimus",
		premier: "Premier",
		primo: "Primo",
		primo2: "Primo Custom",
		regina: "Regina",
		rhinehart: "Rhinehart",
		romero: "Romero Hearse",
		schafter2: "Schafter",
		schafter5: "Schafter V12 (Armored)",
		schafter6: "Schafter LWB (Armored)",
		stafford: "Stafford",
		stanier: "Stanier",
		stratum: "Stratum",
		stretch: "Stretch",
		superd: "Super Diamond",
		surge: "Surge",
		tailgater: "Tailgater",
		tailgater2: "Tailgater S",
		warrener: "Warrener",
		warrener2: "Warrener HKR",
		washington: "Washington"
	},
	SUVs: {
		aleutian: "Aleutian",
		astron: "Astron",
		baller: "Baller",
		baller2: "Baller",
		baller3: "Baller LE",
		baller4: "Baller LE LWB",
		baller5: "Baller LE (Armored)",
		baller6: "Baller LE LWB (Armored)",
		baller7: "Baller ST",
		baller8: "Baller ST-D",
		bjxl: "BeeJay XL",
		cavalcade: "Cavalcade",
		cavalcade2: "Cavalcade",
		cavalcade3: "Cavalcade XL",
		contender: "Contender",
		dorado: "Dorado",
		dubsta: "Dubsta",
		dubsta2: "Dubsta",
		everon3: "Everon RS",
		fq2: "FQ 2",
		granger: "Granger",
		granger2: "Granger 3600LX",
		gresley: "Gresley",
		habanero: "Habanero",
		huntley: "Huntley S",
		issi8: "Issi Rally",
		iwagen: "I-Wagen",
		jubilee: "Jubilee",
		landstalker: "Landstalker",
		landstalker2: "Landstalker XL",
		mesa: "Mesa",
		mesa2: "Mesa",
		novak: "Novak",
		patriot: "Patriot",
		patriot2: "Patriot Stretch",
		radi: "Radius",
		rebla: "Rebla GTS",
		rocoto: "Rocoto",
		seminole: "Seminole",
		seminole2: "Seminole Frontier",
		serrano: "Serrano",
		squaddie: "Squaddie",
		toros: "Toros",
		vivanite: "Vivanite",
		woodlander: "Woodlander",
		xls: "XLS",
		xls2: "XLS (Armored)"
	},
	Coupes: {
		cogcabrio: "Cognoscenti Cabrio",
		driftfr36: "FR36",
		driftsent2: "Sentinel XS",
		exemplar: "Exemplar",
		f620: "F620",
		felon: "Felon",
		felon2: "Felon GT",
		fr36: "FR36",
		jackal: "Jackal",
		kanjosj: "Kanjo SJ",
		oracle: "Oracle XS",
		oracle2: "Oracle",
		postlude: "Postlude",
		previon: "Previon",
		sentinel: "Sentinel XS",
		sentinel2: "Sentinel",
		sentinel6: "Sentinel XS4",
		windsor: "Windsor",
		windsor2: "Windsor Drop",
		zion: "Zion",
		zion2: "Zion Cabrio"
	},
	Muscles: {
		blade: "Blade",
		brigham: "Brigham",
		broadway: "Broadway",
		buccaneer: "Buccaneer",
		buccaneer2: "Buccaneer Custom",
		buffalo4: "Buffalo STX",
		buffalo5: "Buffalo EVX",
		chino: "Chino",
		chino2: "Chino Custom",
		clique: "Clique",
		clique2: "Clique Wagon",
		coquette3: "Coquette BlackFin",
		deviant: "Deviant",
		dominator: "Dominator",
		dominator2: "Pisswasser Dominator",
		dominator3: "Dominator GTX",
		dominator4: "Apocalypse Dominator",
		dominator5: "Future Shock Dominator",
		dominator6: "Nightmare Dominator",
		dominator7: "Dominator ASP",
		dominator8: "Dominator GTT",
		dominator9: "Dominator GT",
		driftdominator9: "Dominator GT",
		driftdominator10: "Dominator FX",
		driftgauntlet4: "Gauntlet Hellfire",
		driftyosemite: "Drift Yosemite",
		dukes: "Dukes",
		dukes2: "Duke O'Death",
		dukes3: "Beater Dukes",
		ellie: "Ellie",
		eudora: "Eudora",
		faction: "Faction",
		faction2: "Faction Custom 1",
		faction3: "Faction Custom Donk",
		gauntlet: "Gauntlet",
		gauntlet2: "Redwood Gauntlet",
		gauntlet3: "Gauntlet Classic",
		gauntlet4: "Gauntlet Hellfire",
		gauntlet5: "Gauntlet Classic Custom",
		greenwood: "Greenwood",
		hermes: "Hermes",
		hotknife: "Hotknife",
		hustler: "Hustler",
		impaler: "Impaler",
		impaler2: "Apocalypse Impaler",
		impaler3: "Future Shock Impaler",
		impaler4: "Nightmare Impaler",
		impaler6: "Impaler LX",
		imperator: "Apocalypse Imperator",
		imperator2: "Future Shock Imperator",
		imperator3: "Nightmare Imperator",
		lurcher: "Lurcher",
		manana2: "Manana Custom",
		moonbeam: "Moonbeam",
		moonbeam2: "Moonbeam Custom",
		nightshade: "Nightshade",
		peyote2: "Peyote Gasser",
		phoenix: "Phoenix",
		picador: "Picador",
		ratloader: "Rat-Loader",
		ratloader2: "Rat-Truck",
		ruiner: "Ruiner",
		ruiner2: "Ruiner 2000",
		ruiner3: "Ruiner",
		ruiner4: "Ruiner ZZ-8",
		sabregt: "Sabre Turbo",
		sabregt2: "Sabre Turbo Custom",
		slamvan: "Slamvan",
		slamvan2: "Lost Slamvan",
		slamvan3: "Slamvan Custom",
		slamvan4: "Apocalypse Slamvan",
		slamvan5: "Future Shock Slamvan",
		slamvan6: "Nightmare Slamvan",
		stalion: "Stallion",
		stalion2: "Burger Shot Stallion",
		tahoma: "Tahoma Coupe",
		tampa: "Tampa",
		tampa3: "Weaponized Tampa",
		tampa4: "Tampa GT",
		tulip: "Tulip",
		tulip2: "Tulip M-100",
		vamos: "Vamos",
		vigero: "Vigero",
		vigero2: "Vigero ZX",
		vigero3: "Vigero ZX Convertible",
		virgo: "Virgo",
		virgo2: "Virgo Classic Custom",
		virgo3: "Virgo Classic",
		voodoo: "Voodoo Custom",
		voodoo2: "Voodoo",
		weevil2: "Weevil Custom",
		yosemite: "Yosemite",
		yosemite2: "Drift Yosemite"
	},
	"Sports Classic": {
		ardent: "Ardent",
		astrale: "Astrale",
		btype: "Roosevelt",
		btype2: "Fränken Stange",
		btype3: "Roosevelt Valor",
		casco: "Casco",
		cheburek: "Cheburek",
		cheetah2: "Cheetah Classic",
		cheetah3: "LSCM Cheetah Classic",
		coquette2: "Coquette Classic",
		deluxo: "Deluxo",
		dynasty: "Dynasty",
		fagaloa: "Fagaloa",
		feltzer3: "Feltzer Classic",
		gt500: "GT500",
		gt750: "GT750",
		infernus2: "Infernus Classic",
		itali2: "Itali Classic",
		jb700: "JB 700",
		jb7002: "JB 700W",
		mamba: "Mamba",
		manana: "Manana",
		michelli: "Michelli GT",
		monroe: "Monroe",
		nebula: "Nebula Turbo",
		peyote: "Peyote",
		peyote3: "Peyote Custom",
		pigalle: "Pigalle",
		rapidgt3: "Rapid GT Classic",
		retinue: "Retinue",
		retinue2: "Retinue Mk II",
		savestra: "Savestra",
		stinger: "Stinger",
		stingergt: "Stinger GT",
		stromberg: "Stromberg",
		swinger: "Swinger",
		toreador: "Toreador",
		torero: "Torero",
		tornado: "Tornado",
		tornado2: "Tornado",
		tornado3: "Tornado",
		tornado4: "Tornado",
		tornado5: "Tornado Custom",
		tornado6: "Tornado Rat Rod",
		turismo2: "Turismo Classic",
		viseris: "Viseris",
		z190: "190z",
		zion3: "Zion Classic",
		ztype: "Z-Type"
	},
	Sports: {
		alpha: "Alpha",
		banshee: "Banshee",
		bestiagts: "Bestia GTS",
		blista2: "Blista Compact",
		blista3: "Go Go Monkey Blista",
		buffalo: "Buffalo",
		buffalo2: "Buffalo S",
		buffalo3: "Sprunk Buffalo",
		calico: "Calico GTF",
		carbonizzare: "Carbonizzare",
		comet2: "Comet",
		comet3: "Comet Retro Custom",
		comet4: "Comet Safari",
		comet5: "Comet SR",
		comet6: "Comet S2",
		comet7: "Comet S2 Cabrio",
		coquette: "Coquette",
		coquette4: "Coquette D10",
		corsita: "Corsita",
		coureur: "La Coureuse",
		cypher: "Cypher",
		drafter: "8F Drafter",
		drifteuros: "Euros",
		driftfuto: "Futo GTX",
		driftjester: "Jester RR",
		driftremus: "Remus",
		driftrt3: "RT3000",
		drifttampa: "Drift Tampa",
		driftzr350: "ZR350",
		elegy: "Elegy Retro Custom",
		elegy2: "Elegy RH8",
		euros: "Euros",
		everon2: "Hotring Everon",
		feltzer2: "Feltzer",
		flashgt: "Flash GT",
		furoregt: "Furore GT",
		fusilade: "Fusilade",
		futo: "Futo",
		futo2: "Futo GTX",
		gauntlet6: "Hotring Hellfire",
		gb200: "GB200",
		growler: "Growler",
		hotring: "Hotring Sabre",
		imorgon: "Imorgon",
		issi7: "Issi Sport",
		italigto: "Itali GTO",
		italirsx: "Itali RSX",
		jester: "Jester",
		jester2: "Jester (Racecar)",
		jester3: "Jester Classic",
		jester4: "Jester RR",
		jugular: "Jugular",
		khamelion: "Khamelion",
		komoda: "Komoda",
		kuruma: "Kuruma",
		kuruma2: "Kuruma (Armored)",
		locust: "Locust",
		lynx: "Lynx",
		massacro: "Massacro",
		massacro2: "Massacro (Racecar)",
		neo: "Neo",
		neon: "Neon",
		ninef: "9F",
		ninef2: "9F Cabrio",
		omnis: "Omnis",
		omnisegt: "Omnis e-GT",
		panthere: "Panthere",
		paragon: "Paragon R",
		paragon2: "Paragon R (Armored)",
		pariah: "Pariah",
		penumbra: "Penumbra",
		penumbra2: "Penumbra FF",
		r300: "300R",
		raiden: "Raiden",
		rapidgt: "Rapid GT",
		rapidgt2: "Rapid GT",
		rapidgt4: "Rapid GT X",
		raptor: "Raptor",
		remus: "Remus",
		revolter: "Revolter",
		rt3000: "RT3000",
		ruston: "Ruston",
		schafter3: "Schafter V12",
		schafter4: "Schafter LWB",
		schlagen: "Schlagen GT",
		schwarzer: "Schwartzer",
		sentinel3: "Sentinel",
		sentinel4: "Sentinel Classic Widebody",
		sentinel5: "Sentinel GTS",
		seven70: "Seven-70",
		sm722: "SM722",
		specter: "Specter",
		specter2: "Specter Custom",
		stingertt: "Itali GTO Stinger TT",
		streiter: "Streiter",
		sugoi: "Sugoi",
		sultan: "Sultan",
		sultan2: "Sultan Classic",
		sultan3: "Sultan RS Classic",
		surano: "Surano",
		tampa2: "Drift Tampa",
		tenf: "10F",
		tenf2: "10F Widebody",
		tropos: "Tropos Rallye",
		vectre: "Vectre",
		verlierer2: "Verlierer",
		veto: "Veto Classic",
		veto2: "Veto Modern",
		vstr: "V-STR",
		zr350: "ZR350",
		zr380: "Apocalypse ZR380",
		zr3802: "Future Shock ZR380",
		zr3803: "Nightmare ZR380"
	},
	Super: {
		adder: "Adder",
		autarch: "Autarch",
		banshee2: "Banshee 900R",
		bullet: "Bullet",
		champion: "Champion",
		cheetah: "Cheetah",
		cyclone: "Cyclone",
		deveste: "Deveste Eight",
		emerus: "Emerus",
		entity2: "Entity XXR",
		entity3: "Entity MT",
		entityxf: "Entity XF",
		fmj: "FMJ",
		fmj2: "FMJ MK V",
		furia: "Furia",
		gp1: "GP1",
		ignus: "Ignus",
		infernus: "Infernus",
		italigtb: "Itali GTB",
		italigtb2: "Itali GTB Custom",
		krieger: "Krieger",
		le7b: "RE-7B",
		lm87: "LM87",
		luiva: "Luiva",
		nero: "Nero",
		nero2: "Nero Custom",
		osiris: "Osiris",
		penetrator: "Penetrator",
		pfister811: "811",
		prototipo: "X80 Proto",
		reaper: "Reaper",
		s80: "S80RR",
		sc1: "SC1",
		scramjet: "Scramjet",
		sheava: "ETR1",
		sultanrs: "Sultan RS",
		suzume: "Suzume",
		t20: "T20",
		taipan: "Taipan",
		tempesta: "Tempesta",
		tezeract: "Tezeract",
		thrax: "Thrax",
		tigon: "Tigon",
		torero2: "Torero XO",
		turismo3: "Turismo Omaggio",
		turismor: "Turismo R",
		tyrant: "Tyrant",
		tyrus: "Tyrus",
		vacca: "Vacca",
		vagner: "Vagner",
		vigilante: "Vigilante",
		virtue: "Virtue",
		visione: "Visione",
		voltic: "Voltic",
		voltic2: "Rocket Voltic",
		xa21: "XA-21",
		xtreme: "X-treme",
		zeno: "Zeno",
		zentorno: "Zentorno",
		zorrusso: "Zorrusso"
	},
	Motorcycles: {
		akuma: "Akuma",
		avarus: "Avarus",
		bagger: "Bagger",
		bati: "Bati 801",
		bati2: "Bati 801RR",
		bf400: "BF400",
		carbonrs: "Carbon RS",
		chimera: "Chimera",
		cliffhanger: "Cliffhanger",
		daemon: "Daemon",
		daemon2: "Daemon Custom",
		deathbike: "Apocalypse Deathbike",
		deathbike2: "Future Shock Deathbike",
		deathbike3: "Nightmare Deathbike",
		defiler: "Defiler",
		diablous: "Diabolus",
		diablous2: "Diabolus Custom",
		double: "Double-T",
		enduro: "Enduro",
		esskey: "Esskey",
		faggio: "Faggio Sport",
		faggio2: "Faggio",
		faggio3: "Faggio Mod",
		fcr: "FCR 1000",
		fcr2: "FCR 1000 Custom",
		gargoyle: "Gargoyle",
		hakuchou: "Hakuchou",
		hakuchou2: "Hakuchou Drag",
		hexer: "Hexer",
		innovation: "Innovation",
		lectro: "Lectro",
		manchez: "Manchez",
		manchez2: "Manchez Scout",
		manchez3: "Manchez Scout C",
		nemesis: "Nemesis",
		nightblade: "Nightblade",
		oppressor: "Oppressor",
		oppressor2: "Oppressor Mk II",
		pcj: "PCJ 600",
		powersurge: "Powersurge",
		ratbike: "Rat Bike",
		reever: "Reever",
		rrocket: "Rampant Rocket",
		ruffian: "Ruffian",
		sanchez: "Sanchez (livery)",
		sanchez2: "Sanchez",
		sanctus: "Sanctus",
		shinobi: "Shinobi",
		shotaro: "Shotaro",
		sovereign: "Sovereign",
		stryder: "Stryder",
		thrust: "Thrust",
		vader: "Vader",
		vindicator: "Vindicator",
		vortex: "Vortex",
		wolfsbane: "Wolfsbane",
		zombiea: "Zombie Bobber",
		zombieb: "Zombie Chopper"
	},
	'Off-Road': {
		bfinjection: "Injection",
		bifta: "Bifta",
		blazer: "Blazer",
		blazer2: "Blazer Lifeguard",
		blazer3: "Hot Rod Blazer",
		blazer4: "Street Blazer",
		blazer5: "Blazer Aqua",
		bodhi2: "Bodhi",
		boor: "Boor",
		brawler: "Brawler",
		bruiser: "Apocalypse Bruiser",
		bruiser2: "Future Shock Bruiser",
		bruiser3: "Nightmare Bruiser",
		brutus: "Apocalypse Brutus",
		brutus2: "Future Shock Brutus",
		brutus3: "Nightmare Brutus",
		caracara: "Caracara",
		caracara2: "Caracara 4x4",
		dloader: "Duneloader",
		draugur: "Draugur",
		driftl352: "Drift Walkton L35",
		dubsta3: "Dubsta 6x6",
		dune: "Dune Buggy",
		dune2: "Space Docker",
		dune3: "Dune FAV",
		dune4: "Ramp Buggy",
		dune5: "Ramp Buggy",
		freecrawler: "Freecrawler",
		hellion: "Hellion",
		insurgent: "Insurgent Pick-Up",
		insurgent2: "Insurgent",
		insurgent3: "Insurgent Pick-Up Custom",
		kalahari: "Kalahari",
		kamacho: "Kamacho",
		l35: "Walton L35",
		l352: "Walton L35 Stock",
		marshall: "Marshall",
		menacer: "Menacer",
		mesa3: "Mesa",
		monster: "Monster",
		monster3: "Apocalypse Sasquatch",
		monster4: "Future Shock Sasquatch",
		monster5: "Nightmare Sasquatch",
		monstrociti: "MonstroCiti",
		nightshark: "Nightshark",
		outlaw: "Outlaw",
		patriot3: "Patriot Mil-Spec",
		rancherxl: "Rancher XL",
		rancherxl2: "Rancher XL",
		ratel: "Ratel",
		rcbandito: "RC Bandito",
		rebel: "Rusty Rebel",
		rebel2: "Rebel",
		riata: "Riata",
		sandking: "Sandking XL",
		sandking2: "Sandking SWB",
		technical: "Technical",
		technical2: "Technical Aqua",
		technical3: "Technical Custom",
		terminus: "Terminus",
		trophytruck: "Trophy Truck",
		trophytruck2: "Desert Raid",
		vagrant: "Vagrant",
		verus: "Verus",
		winky: "Winky",
		yosemite3: "Yosemite Rancher",
		zhaba: "Zhaba"
	},
	Industrial: {
		bulldozer: "Dozer",
		cutter: "Cutter",
		dump: "Dump",
		flatbed: "Flatbed",
		flatbed2: "Custom Flatbed",
		guardian: "Guardian",
		handler: "Dock Handler",
		mixer: "Mixer",
		mixer2: "Mixer",
		rubble: "Rubble",
		tiptruck: "Tipper",
		tiptruck2: "Tipper"
	},
	Utility: {
		airtug: "Airtug",
		armytanker: "Army Trailer",
		armytrailer: "Army Trailer",
		armytrailer2: "Army Trailer",
		baletrailer: "Baletrailer",
		boattrailer: "Boat Trailer",
		boattrailer2: "Boat Trailer",
		boattrailer3: "Boat Trailer",
		caddy: "Caddy",
		caddy2: "Caddy",
		caddy3: "Caddy",
		driftkeitora: "Keitora",
		docktrailer: "null",
		docktug: "Docktug",
		forklift: "Forklift",
		freighttrailer: "null",
		graintrailer: "Graintrailer",
		keitora: "Keitora",
		mower: "Lawn Mower",
		proptrailer: "null",
		raketrailer: "Trailer",
		ripley: "Ripley",
		sadler: "Sadler",
		sadler2: "Sadler",
		scrap: "Scrap Truck",
		slamtruck: "Slamtruck",
		tanker: "Trailer",
		tanker2: "null",
		towtruck: "Tow Truck",
		towtruck2: "Tow Truck",
		towtruck3: "Tow Truck",
		towtruck4: "Tow Truck",
		tr2: "Trailer",
		tr3: "Trailer",
		tr4: "Trailer",
		tractor: "Tractor",
		tractor2: "Fieldmaster",
		tractor3: "Fieldmaster",
		trailerlarge: "Mobile Operations Center",
		trailerlogs: "Trailer",
		trailers: "Trailer",
		trailers2: "Trailer",
		trailers3: "Trailer",
		trailers4: "Trailer",
		trailers5: "Trailer",
		trailersmall: "Trailer",
		trflat: "Trailer",
		tvtrailer: "Trailer",
		tvtrailer2: "Trailer",
		utillitruck: "Utility Truck",
		utillitruck2: "Utility Truck",
		utillitruck3: "Utility Truck"
	},
	Vans: {
		bison: "Bison",
		bison2: "Bison",
		bison3: "Bison",
		bobcatxl: "Bobcat XL",
		boxville: "Boxville",
		boxville2: "Boxville",
		boxville3: "Boxville",
		boxville4: "Boxville",
		boxville5: "Armored Boxville",
		boxville6: "Boxville (LSDS)",
		burrito: "Burrito",
		burrito2: "Bugstars Burrito",
		burrito3: "Burrito",
		burrito4: "Burrito",
		burrito5: "Burrito",
		camper: "Camper",
		gburrito: "Gang Burrito",
		gburrito2: "Gang Burrito",
		journey: "Journey",
		journey2: "Journey II",
		minivan: "Minivan",
		minivan2: "Minivan Custom",
		paradise: "Paradise",
		pony: "Pony",
		pony2: "Pony",
		rumpo: "Rumpo",
		rumpo2: "Rumpo",
		rumpo3: "Rumpo Custom",
		speedo: "Speedo",
		speedo2: "Clown Van",
		speedo4: "Speedo Custom",
		speedo5: "Speedo Custom",
		surfer: "Surfer",
		surfer2: "Surfer",
		surfer3: "Surfer Custom",
		taco: "Taco Van",
		youga: "Youga",
		youga2: "Youga Classic",
		youga3: "Youga Classic 4x4",
		youga4: "Youga Custom"
	},
	Cycles: {
		bmx: "BMX",
		cruiser: "Cruiser",
		fixter: "Fixter",
		inductor: "Inductor",
		inductor2: "Junk Energy Inductor",
		scorcher: "Scorcher",
		tribike: "Whippet Race Bike",
		tribike2: "Endurex Race Bike",
		tribike3: "Tri-Cycles Race Bike"
	},
	Boats: {
		avisa: "Avisa",
		dinghy: "Dinghy",
		dinghy2: "Dinghy",
		dinghy3: "Dinghy",
		dinghy4: "Dinghy",
		dinghy5: "Weaponized Dinghy",
		jetmax: "Jetmax",
		kosatka: "Kosatka",
		longfin: "Longfin",
		marquis: "Marquis",
		patrolboat: "Kurtz 31 Patrol Boat",
		predator: "Police Predator",
		seashark: "Seashark",
		seashark2: "Seashark",
		seashark3: "Seashark",
		speeder: "Speeder",
		speeder2: "Speeder",
		squalo: "Squalo",
		submersible: "Submersible",
		submersible2: "Kraken",
		suntrap: "Suntrap",
		toro: "Toro",
		toro2: "Toro",
		tropic: "Tropic",
		tropic2: "Tropic",
		tug: "Tug"
	},
	Helicopters: {
		akula: "Akula",
		annihilator: "Annihilator",
		annihilator2: "Annihilator Stealth",
		buzzard: "Buzzard Attack Chopper",
		buzzard2: "Buzzard",
		cargobob: "Cargobob",
		cargobob2: "Cargobob",
		cargobob3: "Cargobob",
		cargobob4: "Cargobob",
		conada: "Conada",
		conada2: "Weaponized Conada",
		frogger: "Frogger",
		frogger2: "Frogger",
		havok: "Havok",
		hunter: "FH-1 Hunter",
		maverick: "Maverick",
		maverick2: "Higgins Helitours Maverick",
		polmav: "Police Maverick",
		savage: "Savage",
		seasparrow: "Sea Sparrow",
		seasparrow2: "Sparrow",
		seasparrow3: "Sparrow",
		skylift: "Skylift",
		supervolito: "SuperVolito",
		supervolito2: "SuperVolito Carbon",
		swift: "Swift",
		swift2: "Swift Deluxe",
		valkyrie: "Valkyrie",
		valkyrie2: "Valkyrie MOD.0",
		volatus: "Volatus"
	},
	Planes: {
		alkonost: "RO-86 Alkonost",
		alphaz1: "Alpha-Z1",
		avenger: "Avenger",
		avenger2: "Avenger",
		avenger3: "Avenger",
		avenger4: "Avenger",
		besra: "Besra",
		blimp: "Atomic Blimp",
		blimp2: "Xero Blimp",
		blimp3: "Blimp",
		bombushka: "RM-10 Bombushka",
		cargoplane: "Cargo Plane",
		cargoplane2: "Cargo Plane",
		cuban800: "Cuban 800",
		dodo: "Dodo",
		duster: "Duster",
		howard: "Howard NX-25",
		hydra: "Hydra",
		jet: "Jet",
		lazer: "P-996 LAZER",
		luxor: "Luxor",
		luxor2: "Luxor Deluxe",
		mammatus: "Mammatus",
		microlight: "Ultralight",
		miljet: "Miljet",
		mogul: "Mogul",
		molotok: "V-65 Molotok",
		nimbus: "Nimbus",
		nokota: "P-45 Nokota",
		pyro: "Pyro",
		raiju: "F-160 Raiju",
		rogue: "Rogue",
		seabreeze: "Seabreeze",
		shamal: "Shamal",
		starling: "LF-22 Starling",
		streamer216: "Streamer216",
		strikeforce: "B-11 Strikeforce",
		stunt: "Mallard",
		titan: "Titan",
		tula: "Tula",
		velum: "Velum",
		velum2: "Velum 5-Seater",
		vestra: "Vestra",
		volatol: "Volatol"
	},
	Service: {
		airbus: "Airport Bus",
		brickade: "Brickade",
		brickade2: "Brickade 6x6",
		bus: "Bus",
		coach: "Dashound",
		pbus2: "Festival Bus",
		rallytruck: "Dune",
		rentalbus: "Rental Shuttle Bus",
		taxi: "Taxi",
		tourbus: "Tour Bus",
		trash: "Trashmaster",
		trash2: "Trashmaster",
		vivanite2: "Vivanite",
		wastelander: "Wastelander"
	},
	Emergency: {
		ambulance: "Ambulance",
		fbi: "FIB",
		fbi2: "FIB",
		firetruk: "Fire Truck",
		lguard: "Lifeguard",
		pbus: "Police Prison Bus",
		polbuffalo: "Buffalo Cruiser",
		polbuffalo6: "Buffalo STX Pursuit",
		polgauntlet: "Gauntlet Interceptor",
		police: "Police Cruiser",
		police2: "Police Cruiser",
		police3: "Police Cruiser",
		police4: "Unmarked Cruiser",
		police5: "Stanier LE Cruiser",
		policeb: "Police Bike",
		policeb2: "Police Bike",
		policeold1: "Police Rancher",
		policeold2: "Police Roadcruiser",
		policet: "Police Transporter",
		pranger: "Park Ranger",
		riot: "Police Riot",
		riot2: "RCV",
		sheriff: "Sheriff Cruiser",
		sheriff2: "Sheriff SUV"
	},
	Military: {
		apc: "APC",
		barracks: "Barracks",
		barracks2: "Barracks Semi",
		barracks3: "Barracks",
		barrage: "Barrage",
		chernobog: "Chernobog",
		crusader: "Crusader",
		halftrack: "Half-track",
		khanjali: "TM-02 Khanjali",
		minitank: "Invade and Persuade Tank",
		rhino: "Rhino Tank",
		scarab: "Apocalypse Scarab",
		scarab2: "Future Shock Scarab",
		scarab3: "Nightmare Scarab",
		thruster: "Thruster",
		trailersmall2: "Anti-Aircraft Trailer",
		vetir: "Vetir"
	},
	Commercial: {
		benson: "Benson",
		benson2: "Benson (Cluckin' Bell)",
		biff: "Biff",
		cerberus: "Apocalypse Cerberus",
		cerberus2: "Future Shock Cerberus",
		cerberus3: "Nightmare Cerberus",
		hauler: "Hauler",
		hauler2: "Hauler Custom",
		mule: "Mule",
		mule2: "Mule",
		mule3: "Mule",
		mule4: "Mule Custom",
		mule5: "Mule",
		packer: "Packer",
		phantom: "Phantom",
		phantom2: "Phantom Wedge",
		phantom3: "Phantom Custom",
		phantom4: "Phantom",
		pounder: "Pounder",
		pounder2: "Pounder Custom",
		stockade: "Stockade",
		stockade3: "Stockade",
		stockade4: "Bobcat Security Stockade",
		terbyte: "Terrorbyte"
	},
	Trains: {
		cablecar: "Cable Car",
		freight: "Freight Train",
		freight2: "Freight Train",
		freightcar: "Freight Train",
		freightcar2: "Freight Train",
		freightcont1: "Freight Train",
		freightcont2: "Freight Train",
		freightgrain: "Freight Train",
		metrotrain: "Freight Train",
		tankercar: "Freight Train"
	},
	'Open Wheels': {
		formula: "PR4",
		formula2: "R88",
		openwheel1: "BR8",
		openwheel2: "DR1"
	}
} as const satisfies Record<string, Record<string, string>>