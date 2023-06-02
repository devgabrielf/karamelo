import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async event => {
	const { user } = await event.parent();

	if (!user) {
		throw redirect(303, "/");
	}
}) satisfies LayoutServerLoad;
