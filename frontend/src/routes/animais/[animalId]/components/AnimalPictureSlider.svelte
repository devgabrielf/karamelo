<script lang="ts">
	import { nanoid } from "nanoid";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import type { Animal } from "$types/animal";

	export let animal: Animal;

	$: pictures = animal.pictures;

	$: getFormattedPicture = (index: number) => {
		if ((pictures.length === 2 && index === 2) || pictures.length === 1) {
			index = 0;
		}

		return {
			id: `${pictures[index].id}-${nanoid(4)}`,
			src: pictures[index].src,
			index,
		};
	};

	$: previousHiddenPicture = getFormattedPicture(pictures.length - 2);
	$: previousPicture = getFormattedPicture(pictures.length - 1);
	$: currentPicture = getFormattedPicture(0);
	$: nextPicture = getFormattedPicture(1);
	$: nextHiddenPicture = getFormattedPicture(2);

	$: currentPictures =
		pictures.length > 1
			? [previousHiddenPicture, previousPicture, currentPicture, nextPicture, nextHiddenPicture]
			: [getFormattedPicture(0)];

	let isSliding = false;

	const getNextPicture = () => {
		const lastPicture = currentPictures[currentPictures.length - 1];
		const newNextIndex = lastPicture.index === pictures.length - 1 ? 0 : lastPicture.index + 1;
		const newNext = pictures[newNextIndex];

		return {
			id: `${newNext.id}-${nanoid(4)}`,
			src: newNext.src,
			index: newNextIndex,
		};
	};

	const getPreviousPicture = () => {
		const firstPicture = currentPictures[0];
		const newPreviousIndex =
			firstPicture.index === 0 ? pictures.length - 1 : firstPicture.index - 1;
		const newPrevious = pictures[newPreviousIndex];

		return {
			id: `${newPrevious.id}-${nanoid(4)}`,
			src: newPrevious.src,
			index: newPreviousIndex,
		};
	};

	const slide = (direction: "left" | "right") => {
		if (isSliding) {
			return;
		}

		isSliding = true;

		currentPictures =
			direction === "left"
				? [...currentPictures.slice(1), getNextPicture()]
				: [getPreviousPicture(), ...currentPictures.slice(0, -1)];

		setTimeout(() => {
			isSliding = false;
		}, 200);
	};
</script>

<div
	class="relative mb-8 flex w-full items-center justify-center border-b-4 border-b-amber-600 bg-slate-900 py-2"
>
	<div class="flex w-full max-w-5xl items-center">
		{#if pictures.length > 1}
			<button
				on:click={() => slide("right")}
				class="rounded-full p-1 transition-colors hover:bg-slate-50/5"
			>
				<ChevronLeft size={32} color="#fff" />
			</button>
		{/if}
		<div class="flex flex-1 justify-center">
			<div
				class="relative flex h-96 w-full max-w-[54rem] items-center justify-center overflow-hidden"
			>
				{#each currentPictures as picture, index (picture.id)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<img
						src={picture.src}
						alt={animal.name}
						style={pictures.length > 1
							? `transform: scale(${index === 2 ? 1 : 0.75}) translateX(${
									24 * (index - 2)
							  }rem); z-index: ${2 - Math.abs(index - 2)};`
							: ""}
						on:click={() => {
							if ([1, 3].includes(index)) {
								slide(index === 1 ? "right" : "left");
							}
						}}
						class="absolute top-0 aspect-square w-full max-w-sm rounded-lg object-cover transition-all duration-500 {index !==
							2 && pictures.length > 1
							? index === 0 || index === 4
								? 'opacity-0'
								: 'cursor-pointer opacity-60 hover:opacity-70'
							: ''}"
					/>
				{/each}
			</div>
		</div>
		{#if pictures.length > 1}
			<button
				on:click={() => slide("left")}
				class="rounded-full p-1 transition-colors hover:bg-slate-50/5"
			>
				<ChevronRight size={32} color="#fff" />
			</button>
		{/if}
	</div>
</div>
