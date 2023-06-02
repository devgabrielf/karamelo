<script lang="ts">
	import { AnimalStatus, InqueryStatus, Sex } from "$enums";
	import type { AnimalSimple } from "$types";
	import { getSexIcon } from "$utils";

	export let animal: AnimalSimple;
	export let href: string | null = `/animais/${animal.id}`;
	export let status: AnimalStatus | InqueryStatus | undefined = undefined;

	const getStatusBorder = () => {
		switch (status) {
			case AnimalStatus.APPROVED:
			case InqueryStatus.APPROVED:
				return "border-t-green-600";
			case AnimalStatus.PENDING:
			case InqueryStatus.PENDING:
				return "border-t-yellow-500";
			case AnimalStatus.REJECTED:
			case InqueryStatus.REJECTED:
				return "border-t-red-600";
			case AnimalStatus.ADOPTED:
			case InqueryStatus.FINISHED:
				return "border-t-lime-600";
		}
	};
</script>

<div
	class="relative flex flex-col overflow-hidden rounded-xl shadow-md transition-transform {href
		? 'hover:-translate-y-1'
		: ''} {status ? `border-t-[6px] ${getStatusBorder()}` : ''}"
>
	<img src={animal.pictures[0].src} alt={animal.name} class="aspect-[29/20] object-cover" />
	<div class="mt-[-0.5rem] rounded-t-xl bg-slate-50 p-4">
		<div class="mb-2 flex items-center justify-between">
			{#if href}
				<a {href} class="link ... overflow-hidden text-ellipsis text-lg font-bold">{animal.name}</a>
			{:else}
				<span class="... overflow-hidden text-ellipsis text-lg font-bold">{animal.name}</span>
			{/if}
			<img
				src={getSexIcon(animal.sex)}
				alt={animal.sex === Sex.MALE ? "Male" : "Female"}
				class="mr-2 h-5 w-5"
			/>
		</div>
		<p class="... overflow-hidden text-ellipsis text-sm font-bold text-zinc-400">
			{animal.city}, {animal.uf}
		</p>
	</div>
</div>

<style lang="postcss">
	.link::after {
		content: "";
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
