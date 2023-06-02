<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Plus } from "lucide-svelte";

	let inputLabel: HTMLLabelElement;
	let input: HTMLInputElement;

	const dispatch = createEventDispatcher();

	const onUpload = (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		dispatch("upload", { file });

		input.value = "";
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click={() => inputLabel.click()}
	class="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-slate-300 transition-colors hover:border-slate-400"
>
	<div class="full rounded-full bg-slate-300/30 p-2">
		<Plus color="#aaa" size={32} />
	</div>
	<label
		bind:this={inputLabel}
		on:click|stopPropagation
		for="image"
		class="label relative cursor-pointer text-sm font-bold uppercase text-zinc-400 transition-colors group-hover:text-zinc-500"
	>
		Adicionar foto
	</label>
	<input
		bind:this={input}
		on:change={onUpload}
		type="file"
		name="image"
		id="image"
		accept="image/jpeg, image/png"
		class="hidden"
	/>
</div>
