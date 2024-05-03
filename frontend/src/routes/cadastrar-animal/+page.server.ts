import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { getErrorMessage, getRedirectUrl } from "$utils";
import { API_BASE_URL } from "$lib/consts";

const signUpSchema = z
	.object({
		name: z.string().nonempty("Insira o nome").min(3, "Insira pelo menos 3 caracteres"),
		species: z.string().nonempty("Insira o tipo"),
		sex: z.string().nonempty("Insira o sexo"),
		age: z.coerce.number().min(1, "A idade deve ser maior que 0"),
		uf: z.string().nonempty("Selecione uma UF"),
		city: z.string().nonempty("Selecione uma cidade"),
		description: z
			.string()
			.nonempty("Insira a descrição")
			.min(10, "A descrição deve conter pelo menos 10 caracteres")
			.max(500, "A descrição deve conter no máximo 500 caracteres"),
		pictures: z.string(),
	})
	.refine(
		data => {
			try {
				const pictures = JSON.parse(data.pictures);
				return pictures.length > 0 && pictures.length < 5;
			} catch {
				return false;
			}
		},
		{
			message: "Adicione de 1 a 4 fotos",
			path: ["pictures"],
		},
	);

export const load = (async event => {
	const { user } = await event.parent();

	if (!user) {
		throw redirect(303, `/entrar?${getRedirectUrl("/cadastrar-animal")}`);
	}

	const form = await superValidate(event, signUpSchema);

	return {
		form,
		title: "Cadastrar animal",
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async event => {
		const form = await superValidate(event, signUpSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { fetch, cookies } = event;

		console.log({
			a: JSON.parse(form.data.pictures).map(
				(picture: { fileName: string; src: string }) => picture.fileName,
			),
		});

		const data = {
			name: form.data.name,
			species: JSON.parse(form.data.species).value,
			sex: JSON.parse(form.data.sex).value,
			months: form.data.age,
			uf: JSON.parse(form.data.uf).value,
			city: JSON.parse(form.data.city).value,
			description: form.data.description,
			pictures: JSON.parse(form.data.pictures).map(
				(picture: { fileName: string; src: string }) => picture.fileName,
			),
		};

		const response = await fetch(`${API_BASE_URL}/animals/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get("accessToken")}`,
			},
			body: JSON.stringify(data),
		});

		const responseJson = await response.json();

		if (responseJson.error || responseJson.statusCode === 401) {
			return fail(responseJson.statusCode, {
				form,
				error: getErrorMessage(responseJson.message),
			});
		}

		throw redirect(303, "/perfil/animais-cadastrados/");

		return { form, error: "" };
	},
} satisfies Actions;
