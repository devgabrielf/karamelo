<script lang="ts">
	import type { LayoutData } from "./$types";

	import { Box, NoResults } from "$components";
	import InqueryItem from "./components/InqueryItem.svelte";

	export let data: LayoutData;

	$: animal = data.animal;
	$: inqueries = data.inqueries;
</script>

<Box>
	<h1 class="mb-3 text-3xl font-bold">Solicitações</h1>
	<p class="mb-8">Pessoas que demonstraram interesse em adotar {animal.name}:</p>
	{#if inqueries.length}
		<ul class="flex flex-col gap-2">
			{#each inqueries as inquery (inquery.id)}
				<InqueryItem animalId={animal.id} {inquery} />
			{/each}
		</ul>
	{:else}
		<div class="py-10">
			<NoResults description="Ainda não há nenhuma solicitação." />
		</div>
	{/if}
</Box>
