import { API_BASE_URL } from "$lib/consts";
import type { Inquery } from "$types";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ depends, fetch, params, parent }) => {
	const { user } = await parent();

	if (!user) {
		throw redirect(303, "/");
	}

	depends("animal:inquery");

	const response = await fetch(`${API_BASE_URL}/inqueries/${params.inqueryId}`, {
		headers: {
			Authorization: user ? `Bearer ${user.accessToken}` : "",
		},
	});

	if (!response.ok) {
		throw redirect(303, ".");
	}

	const inquery: Inquery = await response.json();

	if (inquery.animal.author.id !== user.id) {
		throw redirect(303, ".");
	}

	return {
		inquery,
		user,
	};
}) satisfies PageLoad;
