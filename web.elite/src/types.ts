export interface Route {
	to: `/${string}`;
	label: string;
	element: React.JSX.Element;
}

export interface PlayerStats {
	kills: number;
	deaths: number;
	assits: number;
	wins: number;
	losses: number;
}

export interface PartyInvite {
	fromUserId: string;
	toUserId: string;
}

export interface UserNotification {
	id: string;
	type: 'party_invite';
	title: string;
	description: string;
	createdAt: string;
	invite: PartyInvite;
}
