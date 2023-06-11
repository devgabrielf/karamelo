import { API_BASE_URL } from "$lib/consts";
import type { InqueriesByAnimal } from "$types";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load = (async ({ depends, fetch, parent, params }) => {
	const { user } = await parent();

	depends("animal:inqueries");

	const response = await fetch(`${API_BASE_URL}/inqueries/byanimal/${params.animalId}`, {
		headers: {
			Authorization: `Bearer ${user?.accessToken}`,
		},
	});

	if (!response.ok) {
		throw redirect(303, `/animais/${params.animalId}`);
	}

	const { animal, inqueries }: InqueriesByAnimal = await response.json();

	return {
		animal,
		inqueries,
		user,
		title: `Solicitações de ${animal.name}`
	};
}) satisfies LayoutLoad;
