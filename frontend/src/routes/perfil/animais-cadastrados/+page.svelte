<script lang="ts">
	import { NoResults } from "$components";
	import { AnimalStatus } from "$enums";
	import type { PageData } from "./$types";
	import Animals from "./components/Animals.svelte";

	export let data: PageData;

	$: animals = data.animals;

	$: pendingAnimals = animals.filter(animal => animal.status === AnimalStatus.PENDING);
	$: approvedAnimals = animals.filter(animal => animal.status === AnimalStatus.APPROVED);
	$: adoptedAnimals = animals.filter(animal =>
		[AnimalStatus.REJECTED, AnimalStatus.ADOPTED].includes(animal.status),
	);
</script>

{#if animals.length}
	<Animals animals={pendingAnimals} title="Animais pendentes" color="text-yellow-500" />
	<Animals animals={approvedAnimals} title="Animais aprovados" color="text-green-600" enableLink />
	<Animals animals={adoptedAnimals} title="Animais adotados" color="text-lime-600" />
{:else}
	<div class="py-10">
		<NoResults description="Você ainda não cadastrou nenhum animal." />
	</div>
{/if}
