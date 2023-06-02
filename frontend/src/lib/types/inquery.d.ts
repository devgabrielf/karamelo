import type { InqueryStatus } from "$enums";
import type { AnimalSimple } from "./animal";
import type { User } from "./user";

type Message = {
	id: number;
	content: string;
	authorId: string;
	createdAt: string;
};

export type Inquery = {
	id: string;
	message: string;
	status: InqueryStatus;
	animalId: string;
	authorId: string;
	createdAt: string;
	messages: Message[];
	animal: AnimalSimple & { author: Pick<User, "id" | "name" | "avatar"> };
	author: Pick<User, "id" | "name" | "city" | "uf" | "picture" | "homeImages">;
};

export type MyInqueries = (Pick<Inquery, "id" | "status" | "createdAt"> & {
	animal: AnimalSimple;
})[];

export type InqueriesByAnimal = {
	inqueries: (Pick<Inquery, "id" | "status" | "createdAt"> & {
		author: Pick<User, "id" | "name" | "avatar" | "homeImages">;
	})[];
} & {
	animal: AnimalSimple;
};
