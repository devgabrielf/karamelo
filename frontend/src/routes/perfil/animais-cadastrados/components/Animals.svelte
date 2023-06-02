<script lang="ts">
	import type { AnimalSimple } from "$types";

	import { AnimalCard } from "$components";

	export let animals: AnimalSimple[];
	export let title: string;
    export let color: string;
    export let enableLink: boolean = false;
</script>

{#if animals.length}
	<h3 class="mb-6 text-2xl font-bold"><span class={color}>>> </span>{title}</h3>
	<div class="mx-auto mb-12 grid w-full grid-cols-3 gap-8">
		{#each animals as animal}
			<AnimalCard {animal} status={animal.status} href={enableLink ? `/animais/${animal.id}/solicitacoes/` : null} />
		{/each}
	</div>
{/if}
