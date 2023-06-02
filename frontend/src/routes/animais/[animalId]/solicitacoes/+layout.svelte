<script lang="ts">
	import type { LayoutData } from "./$types";

	import { AnimalCard } from "$components";

	export let data: LayoutData;

	$: animal = data.animal;
</script>

<div class="mx-auto flex w-full max-w-5xl items-start gap-8 pt-20">
	<aside class="fixed flex w-72 flex-col gap-4">
		<AnimalCard {animal} />
	</aside>
	<div class="ml-96 flex flex-1 flex-col pb-8">
		<slot />
	</div>
</div>
