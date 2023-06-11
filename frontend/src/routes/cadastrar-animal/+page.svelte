<script lang="ts">
	import { onMount } from "svelte";
	import type { ActionData, PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";
	import { toast, ToastType } from "$lib/toast";
	import { getCities, getUFs } from "$api/ibge";

	import {
		Button,
		Box,
		Field,
		ImageCard,
		ImageInput,
		SelectField,
		TextareaField,
	} from "$components";
	import { Sex, Species } from "$enums";
	import { API_BASE_URL } from "$lib/consts";

	export let data: PageData;
	export let form: ActionData;

	$: user = data.user;

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

	let species = [
		{ value: Species.DOG, label: "Cão" },
		{ value: Species.CAT, label: "Gato" },
	];

	let sexes = [
		{ value: Sex.MALE, label: "Macho" },
		{ value: Sex.FEMALE, label: "Fêmea" },
	];

	let ufs: SelectType[] = [];
	let cities: SelectType[] = [];

	let isInitialLoad = true;

	const fetchCities = async (uf: string) => {
		const citiesJson = await getCities(uf);
		cities = citiesJson.map(city => ({
			value: city.nome,
			label: city.nome,
		}));

		if (isInitialLoad) {
			selectedCity = { value: user?.city || "", label: user?.city || "" };
			isInitialLoad = false;
		}
	};

	$: {
		if (selectedUf) {
			fetchCities(selectedUf.value);
		} else {
			cities = [];
			selectedCity = undefined;
		}
	}

	$: {
		if ($sForm.age === 0) {
			// @ts-ignore
			$sForm.age = undefined;
		}
	}

	let selectedSpecies = species[0];
	let selectedUf: SelectType;
	let selectedCity: SelectType;
	let selectedSex = sexes[0];

	onMount(async () => {
		const ufsJson = await getUFs();
		ufs = ufsJson.map(uf => ({
			value: uf.sigla,
			label: uf.sigla,
		}));

		selectedUf = { value: user?.uf || "", label: user?.uf || "" };
	});

	let pictures: string[] = [];
	let picturesJSON = "";

	$: {
		picturesJSON = JSON.stringify(pictures);
	}

	let isUploadingImage = false;

	const handleImageUpload = async (event: CustomEvent) => {
		const file = event.detail.file as File;

		if (!file || isUploadingImage || !user) {
			return;
		}

		isUploadingImage = true;

		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${API_BASE_URL}/images/`, {
			method: "POST",
			headers: {
				"Access-Control-Allow-Origin": "origin-list",
				Authorization: `Bearer ${user.accessToken}`,
			},
			body: formData,
		});

		if (response.ok) {
			const picture = await response.json();
			pictures = [...pictures, picture.src];
		} else {
			toast("Ocorreu um erro ao enviar a foto.", ToastType.ERROR);
		}

		isUploadingImage = false;
	};

	const handleImageDelete = async (event: CustomEvent) => {
		const imageSrc = event.detail.imageId as string;
		pictures = pictures.filter(picture => picture !== imageSrc);
	};
</script>

<Box className="max-w-3xl mx-auto my-12">
	<form method="POST" use:enhance class="flex flex-col gap-4">
		<h2 class="text-3xl font-bold">Cadastro de animal</h2>
		<div class="mt-2 flex gap-6">
			<Field
				name="name"
				label="Nome"
				type="text"
				placeholder="Insira o nome do animal"
				autocomplete="off"
				bind:value={$sForm.name}
				error={$errors.name?.[0]}
			/>
			<SelectField
				name="species"
				label="Tipo"
				items={species}
				bind:value={selectedSpecies}
				clearable={false}
				searchable={false}
				showChevron
				className="flex-1"
			/>
			<SelectField
				name="sex"
				label="Sexo"
				items={sexes}
				bind:value={selectedSex}
				clearable={false}
				searchable={false}
				showChevron
				className="flex-1"
			/>
		</div>
		<div class="flex gap-6">
			<Field
				name="age"
				label="Idade"
				type="number"
				placeholder="Insira a idade em meses"
				autocomplete="off"
				bind:value={$sForm.age}
				error={$errors.age?.[0]}
			/>
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
		<TextareaField
			name="description"
			label="Descrição"
			placeholder="Fale um pouco sobre o animal"
			bind:value={$sForm.description}
			error={$errors.description?.[0]}
		/>
		<div>
			<h2 class="text-3xl font-bold">Fotos</h2>
			{#if $errors.pictures?.[0]}
				<span class="mt-1 text-sm text-red-500">
					{$errors.pictures?.[0]}
				</span>
			{/if}
		</div>
		<div class="mt-2 grid grid-cols-3 gap-4">
			{#each pictures as picture (picture)}
				<ImageCard
					id={picture}
					src={picture}
					on:delete={handleImageDelete}
					isDeletable
				/>
			{/each}
			{#if pictures.length < 4}
				<ImageInput on:upload={handleImageUpload} />
			{/if}
			<input name="pictures" type="text" bind:value={picturesJSON} class="hidden" />
		</div>
		<Button
			as="button"
			type="submit"
			size="medium"
			variant="primary"
			className="mt-8 max-w-sm w-full mx-auto">Cadastrar</Button
		>
	</form>
</Box>
