<script lang="ts">
	import { onMount } from "svelte";
	import { Search } from "lucide-svelte";
	import { Species } from "$enums";
	import type { PageData } from "./$types";
	import { getCities, getUFs } from "$api/ibge";

	import { AnimalCard, NoResults, SelectField } from "$components";
	import { API_BASE_URL } from "$lib/consts";

	export let data: PageData;

	$: animals = data.animals;
	$: totalAnimals = data.total;

	type SelectType =
		| {
				value: string;
				label: string;
		  }
		| undefined;

	let species = [
		{ value: "", label: "Todos" },
		{ value: Species.DOG, label: "Cães" },
		{ value: Species.CAT, label: "Gatos" },
	];

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

	let selectedSpecies = species[0];
	let selectedUf: SelectType;
	let selectedCity: SelectType;

	let isFetching = false;

	const handleFilter = async () => {
		if (isFetching) {
			return;
		}

		isFetching = true;

		const filter: {
			species?: string;
			uf?: string;
			city?: string;
		} = {};

		if (selectedSpecies.value) {
			filter.species = selectedSpecies.value;
		}

		if (selectedUf?.value) {
			filter.uf = selectedUf.value;
		}

		if (selectedCity?.value) {
			filter.city = selectedCity.value;
		}

		const response = await fetch(`${API_BASE_URL}/animals?${new URLSearchParams(filter)}`);

		if (!response.ok) {
			return;
		}

		const responseJSON = await response.json();

		animals = responseJSON.animals;
		totalAnimals = responseJSON.total;

		isFetching = false;
	};

	onMount(async () => {
		const ufsJson = await getUFs();
		ufs = ufsJson.map(uf => ({
			value: uf.sigla,
			label: uf.sigla,
		}));
	});
</script>

<div class="relative flex h-80 items-center justify-center border-b-4 border-amber-600">
	<img
		src="src/assets/hero.jpg"
		alt="Imagem de um cachorro e um gato"
		class="absolute left-0 top-0 -z-20 h-full w-full object-cover"
	/>
	<div class="absolute top-0 left-0 -z-10 h-full w-full bg-slate-900/50" />
	<h1 class="text-center font-rowdies text-5xl font-bold text-zinc-50">
		Ajude um pet a encontrar<br /> sua nova casa
	</h1>
</div>
<form
	on:submit|preventDefault={handleFilter}
	class="relative z-10 mx-auto mb-16 mt-[-2.3rem] flex max-w-2xl items-center gap-5 rounded-xl border-t-4 border-amber-600 bg-zinc-50 p-4 shadow-md"
>
	<SelectField
		name="species"
		items={species}
		bind:value={selectedSpecies}
		clearable={false}
		searchable={false}
		showChevron
		className="flex-[4]"
	/>
	<SelectField
		name="uf"
		items={ufs}
		bind:value={selectedUf}
		showChevron={!selectedUf}
		placeholder="UF"
		className="flex-[3]"
	/>
	<SelectField
		name="city"
		items={cities}
		bind:value={selectedCity}
		showChevron={!selectedCity}
		placeholder="Cidade"
		className="flex-[7]"
	>
		<p slot="empty">Selecione a UF</p>
	</SelectField>
	<button
		type="submit"
		aria-label="Buscar"
		title="Buscar"
		disabled={isFetching}
		class="rounded-lg bg-amber-600 p-2 transition-colors hover:bg-amber-700"
	>
		<Search color="white" />
	</button>
</form>
{#if animals.length}
	<div class="mx-auto mb-16 grid max-w-5xl grid-cols-4 gap-8">
		{#each animals as animal (animal.id)}
			<AnimalCard {animal} />
		{/each}
	</div>
{:else}
	<div class="py-10">
		<NoResults description="Nenhum animal encontrado." />
	</div>
{/if}
