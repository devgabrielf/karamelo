<script lang="ts">
	import type { HTMLTextareaAttributes } from "svelte/elements";

	type $$Props = HTMLTextareaAttributes & {
		name: string;
		label?: string;
		value: string;
		error?: string;
		maxLength?: number;
		className?: string;
	};

	export let name: string;
	export let label = "";
	export let value: string;
	export let error = "";
	export let maxLength = 500;
	export let className = "";
</script>

<div class="flex flex-col {className}">
	{#if label}
		<label for={name} class="mb-2 text-lg">{label}</label>
	{/if}
	<textarea
		{name}
		id={name}
		on:input
		bind:value
		{...$$restProps}
		class="mb-1 rounded-md border border-zinc-200 bg-white p-3 outline-none transition-colors h-32 hover:border-zinc-300 focus:border-amber-600 resize-none {error
			? 'border-red-500'
			: ''}"
	/>
	<span class="ml-auto text-xs {value.length > maxLength ? "text-red-600" : "text-zinc-500"}">
		{value.length} / {maxLength}
	</span>
	{#if error}
		<span class="text-sm text-red-500">{error}</span>
	{/if}
</div>
