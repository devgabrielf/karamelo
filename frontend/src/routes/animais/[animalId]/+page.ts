import { API_BASE_URL } from "$lib/consts";
import type { Animal } from "$types";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params, parent, url }) => {
	const { user } = await parent();

	const response = await fetch(`${API_BASE_URL}/animals/${params.animalId}`, {
		headers: {
			Authorization: user ? `Bearer ${user.accessToken}` : "",
		},
	});

	if (!response.ok) {
		throw redirect(303, "/");
	}

	const animal: Animal = await response.json();

	const inquery = url.searchParams.get("inquery");

	return {
		animal,
		user,
		openInquery: inquery === "true",
		title: animal.name,
	};
}) satisfies PageLoad;
