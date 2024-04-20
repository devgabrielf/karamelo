<script lang="ts">
	import { Footprint } from "$components";

	export let description: string;
</script>

<div class="flex flex-col items-center gap-4">
	<Footprint width={100} height={100} color="#d0d0d7" />
	<p class="w-56 text-center text-zinc-500">{description}</p>
</div>
