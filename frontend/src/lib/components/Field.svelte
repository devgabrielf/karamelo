<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	type $$Props = HTMLInputAttributes & {
		name: string;
		label?: string;
		value: string;
		error?: string;
		className?: string;
	};

	export let name: string;
	export let label = "";
	export let value: string;
	export let error = "";
	export let className = "";
</script>

<div class="flex flex-col {className}">
	{#if label}
		<label for={name} class="mb-2 text-lg">{label}</label>
	{/if}
	<input
		{name}
		id={name}
		on:input
		bind:value
		{...$$restProps}
		class="mb-1 rounded-md border border-zinc-200 bg-white p-2 caret-amber-600 outline-none transition-colors hover:border-zinc-300 focus:border-amber-600 {error
			? 'border-red-500'
			: ''}"
	/>
	{#if error}
		<span class="text-sm text-red-500">{error}</span>
	{/if}
</div>
