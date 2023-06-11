<script lang="ts">
	import { AnimalStatus } from "$enums";
	import type { PageData } from "./$types";

	import { AnimalCard, NoResults } from "$components";

	export let data: PageData;

	$: animals = data.animals;
</script>

{#if animals.length}
	<div class="mx-auto mb-12 grid w-full grid-cols-3 gap-8">
		{#each animals as animal}
			<AnimalCard {animal} href="/animais/{animal.id}/" />
		{/each}
	</div>
{:else}
	<div class="py-10">
		<NoResults description="Ainda não há nenhum animal pendente." />
	</div>
{/if}
