import { API_BASE_URL } from "$lib/consts";
import type { AnimalSimple } from "$types";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch }) => {
	const response = await fetch(`${API_BASE_URL}/animals/`);

	if (!response.ok) {
		return {
			animals: [],
			total: 0,
		};
	}

	const { animals, total }: { animals: AnimalSimple[]; total: number } = await response.json();

	return {
		animals,
		total,
	};
}) satisfies PageLoad;
