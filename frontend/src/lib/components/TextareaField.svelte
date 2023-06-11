<script lang="ts">
	import type { HTMLTextareaAttributes } from "svelte/elements";

	type $$Props = HTMLTextareaAttributes & {
		name: string;
		label?: string;
		value: string;
		error?: string;
		maxLength?: number;
		hideLength?: boolean;
		autoResize?: boolean;
		rounded?: boolean;
		className?: string;
	};

	export let name: string;
	export let label = "";
	export let value: string;
	export let error = "";
	export let maxLength = 500;
	export let hideLength = false;
	export let autoResize = false;
	export let rounded = false;
	export let className = "";

	let textarea: HTMLTextAreaElement;

	$: if ((value || !value) && autoResize && textarea) {
		textarea.style.height = "0px";

		if (textarea.scrollHeight > 48 && value) {
			textarea.style.height = `${textarea.scrollHeight + 2}px`;
		} else {
			textarea.style.height = `${50}px`;
		}

		if (textarea.scrollHeight >= 122) {
			textarea.style.overflow = "auto";
		} else {
			textarea.style.overflow = "hidden";
		}
	}
</script>

<div class="flex flex-col {className}">
	{#if label}
		<label for={name} class="mb-2 text-lg">{label}</label>
	{/if}
	<textarea
		{name}
		id={name}
		bind:value
		bind:this={textarea}
		on:keydown
		maxlength={hideLength ? 500 : undefined}
		{...$$restProps}
		class="{autoResize
			? 'max-h-[122px] scrollbar-none '
			: 'h-32 '}resize-none caret-amber-600 {rounded
			? 'rounded-[25px]'
			: 'rounded-md'} border border-zinc-200 bg-white p-3 outline-none transition-colors hover:border-zinc-300 focus:border-amber-600 {error
			? 'border-red-500'
			: ''}"
	/>
	{#if !hideLength}
		<span class="ml-auto text-xs {value.length > maxLength ? 'text-red-600' : 'text-zinc-500'}">
			{value.length} / {maxLength}
		</span>
	{/if}
	{#if error}
		<span class="mt-1 block text-sm text-red-500">{error}</span>
	{/if}
</div>
