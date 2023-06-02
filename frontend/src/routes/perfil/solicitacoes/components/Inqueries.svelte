<script lang="ts">
	import type { MyInqueries } from "$types";

	import { AnimalCard } from "$components";

	export let inqueries: MyInqueries;
	export let title: string;
    export let color: string;
</script>

{#if inqueries.length}
	<h3 class="mb-6 text-2xl font-bold"><span class={color}>>> </span>{title}</h3>
	<div class="mx-auto mb-12 grid w-full grid-cols-3 gap-8">
		{#each inqueries as inquery}
			<AnimalCard animal={inquery.animal} status={inquery.status} href={null} />
		{/each}
	</div>
{/if}
