import { API_BASE_URL } from "$lib/consts";
import type { User } from "$types";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies, fetch }) => {
	const accessToken = cookies.get("accessToken");
	
	if (!accessToken) {
		return {
			user: null,
		};
	}

	const response = await fetch(`${API_BASE_URL}/users/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (response.status === 401) {
		cookies.delete("accessToken");

		return {
			user: null,
		};
	}

	const user: User = await response.json();

	return {
		user: {
			...user,
			accessToken,
		},
	};
}) satisfies LayoutServerLoad;
