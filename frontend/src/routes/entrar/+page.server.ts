import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { getErrorMessage } from "$utils";
import { API_BASE_URL } from "$lib/consts";

const signInSchema = z.object({
	email: z.string().nonempty("Insira um e-mail").email("Insira um e-mail válido"),
	password: z.string().nonempty("Insira uma senha"),
});

export const load = (async event => {
	const { user } = await event.parent();

	if (user) {
		throw redirect(303, "/");
	}

	const form = await superValidate(event, signInSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async event => {
		const form = await superValidate(event, signInSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { fetch, cookies, url } = event;

		const response = await fetch(`${API_BASE_URL}/auth/signin/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(form.data),
		});

		const responseJson = await response.json();

		if (responseJson.error) {
			return fail(responseJson.statusCode, {
				form,
				error: getErrorMessage(responseJson.message),
			});
		}

		cookies.set("accessToken", responseJson.accessToken, { path: "/" });

		const redirectURL = url.searchParams.get("redirect");

		throw redirect(303, redirectURL || "/");

		return { form, error: "" };
	},
} satisfies Actions;
