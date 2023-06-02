<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	const dispatch = createEventDispatcher();

	const onClose = () => {
		dispatch("close");
	};

	$: {
		if (dialog && showModal) {
			dialog.showModal();
		} else if (dialog) {
			dialog.close();
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={onClose}
	on:click|self={onClose}
	class="rounded-lg p-0 backdrop:bg-black/90"
>
	<div on:click|stopPropagation class="p-8">
		<slot />
	</div>
</dialog>

<style lang="postcss">
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
</style>
