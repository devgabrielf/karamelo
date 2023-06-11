import { API_BASE_URL } from "$lib/consts";
import type { MyInqueries } from "$types";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, parent }) => {
	const { user } = await parent();

	const response = await fetch(`${API_BASE_URL}/inqueries/mine/`, {
		headers: {
			Authorization: `Bearer ${user?.accessToken}`,
		},
	});

	if (!response.ok) {
		throw redirect(303, "/perfil");
	}

	const inqueries: MyInqueries = await response.json();

	return {
		inqueries,
		user,
		title: "Solicitações"
	};
}) satisfies PageLoad;
