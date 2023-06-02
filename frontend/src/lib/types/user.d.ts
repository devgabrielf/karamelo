import type { UserRole, UserStatus } from "$enums";

export type User = {
	id: string;
	name: string;
	avatar?: string;
	picture?: string;
	city: string;
	uf: string;
	email: string;
	homeImages: {
		id: number;
		src: string;
	}[];
	role: UserRole;
	status: UserStatus;
	accessToken: string;
};
