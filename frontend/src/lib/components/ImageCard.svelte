<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { Search, X } from "lucide-svelte";

	export let id: number | string;
	export let src: string;
	export let alt = "";
	export let isDeletable = false;

	let modal: HTMLDivElement;

	let isOpen = false;

	const dispatch = createEventDispatcher();

	const onDelete = () => {
		dispatch("delete", { imageId: id });
	};

	onMount(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (isOpen && event.key === "Escape") {
				isOpen = false;
			}
		};

		document.addEventListener("keyup", handleEscape, false);

		return () => {
			document.removeEventListener("keyup", handleEscape, false);
		};
	});
</script>

<svelte:head>
   {#if isOpen}
      <style>
         body {
            overflow: hidden;
         }
      </style>
   {/if}
</svelte:head>	

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click|self={() => (isOpen = false)}
	class={isOpen
		? `fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/90 backdrop-blur-sm`
		: ""}
>
	<div
		bind:this={modal}
		class="group relative max-h-[48rem] max-w-3xl rounded-lg {!isOpen
			? 'aspect-square '
			: 'scale-105 transition-transform duration-200'}"
	>
		<img
			{src}
			{alt}
			class="h-full w-full {!isOpen ? 'rounded-md object-cover' : 'object-contain'}"
		/>

		{#if isOpen}
			<button
				on:click={() => (isOpen = false)}
				aria-label="Fechar"
				title="Fechar"
				class="absolute -right-4 -top-4 z-10 rounded-full bg-zinc-700/70 p-1 hover:bg-zinc-800/70"
			>
				<X color="#fff" size={24} />
			</button>
		{:else}
			<button
				on:click|stopPropagation={() => (isOpen = true)}
				aria-label="Visualizar"
				title="Visualizar"
				class="absolute right-[calc(50%-1.7rem)] top-[calc(50%-1.7rem)] z-10 hidden rounded-full bg-zinc-700/60 p-3 hover:bg-zinc-800/60 group-hover:block"
			>
				<Search color="#fff" size={24} />
			</button>
			{#if isDeletable}
				<button
					on:click={onDelete}
					aria-label="Remover foto"
					title="Remover foto"
					class="absolute right-2 top-2 z-10 hidden rounded-full bg-zinc-700/70 p-1 hover:bg-zinc-800/70 group-hover:block"
				>
					<X color="#fff" size={18} />
				</button>
			{/if}
		{/if}
	</div>
</div>
