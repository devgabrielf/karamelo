import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { getErrorMessage } from "$utils";
import { API_BASE_URL } from "$lib/consts";

const signUpSchema = z
	.object({
		name: z.string().nonempty("Insira seu nome").min(3, "Insira pelo menos 3 caracteres"),
		uf: z.string().nonempty("Selecione uma UF"),
		city: z.string().nonempty("Selecione uma cidade"),
		email: z.string().nonempty("Insira um e-mail").email("Insira um e-mail válido"),
		password: z
			.string()
			.nonempty("Insira uma senha")
			.min(6, "A senha deve conter pelo menos 6 caracteres"),
		passwordConfirmation: z.string(),
	})
	.refine(data => data.password.length < 6 || data.password === data.passwordConfirmation, {
		message: "A senha e a confirmação de senha não correspondem",
		path: ["passwordConfirmation"],
	});

export const load = (async event => {
	const { user } = await event.parent();

	if (user) {
		throw redirect(303, "/");
	}

	const form = await superValidate(event, signUpSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async event => {
		const form = await superValidate(event, signUpSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { fetch, cookies, url } = event;

		const data = {
			name: form.data.name,
			uf: JSON.parse(form.data.uf).value,
			city: JSON.parse(form.data.city).value,
			email: form.data.email,
			password: form.data.password,
		};

		const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
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

		throw redirect(303, redirectURL || "/perfil");

		return { form, error: "" };
	},
} satisfies Actions;
