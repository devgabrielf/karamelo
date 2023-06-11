import { API_BASE_URL } from "$lib/consts";
import type { AnimalSimple } from "$types";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, parent }) => {
	const { user } = await parent();

	const response = await fetch(`${API_BASE_URL}/animals/mine/`, {
		headers: {
			Authorization: `Bearer ${user?.accessToken}`,
		},
	});

	if (!response.ok) {
		throw redirect(303, "/perfil");
	}

	const animals: AnimalSimple[] = await response.json();

	return {
		animals,
		user,
		title: "Animais cadastrados"
	};
}) satisfies PageLoad;
