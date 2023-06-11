import type { AnimalStatus, Sex, Species } from "$enums";
import type { Inquery } from "./inquery";
import type { User } from "./user";

export type Animal = {
	id: string;
	name: string;
	pictures: {
		id: number;
		src: string;
	}[];
	description: string;
	months: number;
	city: string;
	uf: string;
	sex: Sex;
	species: Species;
	status: AnimalStatus;
	createdAt: string;
	author: Pick<User, "id" | "name" | "avatar">;
	inquery: Pick<Inquery, "id" | "message" | "animalId" | "authorId" | "status" | "createdAt"> | null;
};

export type AnimalSimple = Pick<
	Animal,
	"id" | "name" | "months" | "pictures" | "city" | "uf" | "sex" | "species" | "status" | "createdAt"
>;
