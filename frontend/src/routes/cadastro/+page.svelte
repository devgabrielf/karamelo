<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import type { ActionData, PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";
	import { toast, ToastType } from "$lib/toast";
	import { getCities, getUFs } from "$api/ibge";

	import { Button, Box, Container, Field, SelectField } from "$components";

	export let data: PageData;
	export let form: ActionData;

	type SelectType =
		| {
				value: string;
				label: string;
		  }
		| undefined;

	const { form: sForm, errors, enhance } = superForm(data.form);

	$: error = form?.error;

	$: {
		if (error) {
			toast(error, ToastType.ERROR);
		}
	}

	let ufs: SelectType[] = [];
	let cities: SelectType[] = [];

	const fetchCities = async (uf: string) => {
		const citiesJson = await getCities(uf);
		cities = citiesJson.map(city => ({
			value: city.nome,
			label: city.nome,
		}));
	};

	$: {
		if (selectedUf) {
			fetchCities(selectedUf.value);
		} else {
			cities = [];
			selectedCity = undefined;
		}
	}

	let selectedUf: SelectType;
	let selectedCity: SelectType;

	onMount(async () => {
		const ufsJson = await getUFs();
		ufs = ufsJson.map(uf => ({
			value: uf.sigla,
			label: uf.sigla,
		}));
	});
</script>

<Container>
	<Box>
		<form method="POST" use:enhance class="flex w-[28rem] flex-col gap-4">
			<Field
				name="name"
				label="Nome"
				type="text"
				placeholder="Insira seu nome"
				bind:value={$sForm.name}
				error={$errors.name?.[0]}
			/>
			<div class="flex gap-6">
				<SelectField
					name="uf"
					label="UF"
					items={ufs}
					bind:value={selectedUf}
					showChevron={!selectedUf}
					placeholder="UF"
					error={$errors.uf?.[0]}
					className="flex-[2]"
				/>
				<SelectField
					name="city"
					label="Cidade"
					items={cities}
					bind:value={selectedCity}
					showChevron={!selectedCity}
					placeholder="Cidade"
					error={$errors.city?.[0]}
					className="flex-[5]"
				>
					<p slot="empty">Selecione a UF</p>
				</SelectField>
			</div>
			<Field
				name="email"
				label="E-mail"
				type="text"
				placeholder="Insira o e-mail"
				bind:value={$sForm.email}
				error={$errors.email?.[0]}
			/>
			<Field
				name="password"
				label="Senha"
				type="password"
				placeholder="Insira a senha"
				bind:value={$sForm.password}
				error={$errors.password?.[0]}
			/>
			<Field
				name="passwordConfirmation"
				label="Confirmação de senha"
				type="password"
				placeholder="Repita a senha"
				bind:value={$sForm.passwordConfirmation}
				error={$errors.passwordConfirmation?.[0]}
			/>
			<div class="flex w-full flex-col gap-4">
				<Button as="button" type="submit" size="medium" variant="primary" className="mt-4"
					>Cadastrar</Button
				>
				<p class="mx-auto text-sm">
					Ou <a
						href="/entrar{$page.url.search}"
						class="font-bold text-amber-600 transition-colors hover:text-amber-700"
						>acesse sua conta</a
					>
				</p>
			</div>
		</form>
	</Box>
</Container>
