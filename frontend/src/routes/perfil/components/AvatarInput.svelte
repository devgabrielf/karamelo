<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import type { User } from "$types";
	import { X } from "lucide-svelte";
	import { toast, ToastType } from "$lib/toast";
	import { getAvatar } from "$utils";
	import { API_BASE_URL } from "$lib/consts";

	export let user: User;

	let isDeletingPicture = false;
	let isUploadingPicture = false;

	let pictureLabel: HTMLLabelElement;

	const handlePictureDelete = async () => {
		if (isDeletingPicture) {
			return;
		}

		isDeletingPicture = true;

		const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
			headers: {
				"Access-Control-Allow-Origin": "origin-list",
				Authorization: `Bearer ${user.accessToken}`,
			},
			method: "DELETE",
		});

		if (response.ok) {
			invalidateAll();
		} else {
			toast(`Ocorreu um erro ao remover a foto.`, ToastType.ERROR);
		}

		isDeletingPicture = false;
	};

	const handlePictureUpload = async (event: Event) => {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file || isUploadingPicture) {
			return;
		}

		isUploadingPicture = true;

		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
			headers: {
				"Access-Control-Allow-Origin": "origin-list",
				Authorization: `Bearer ${user.accessToken}`,
			},
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			invalidateAll();
		} else {
			toast(
				`Ocorreu um erro ao ${user?.picture ? "atualizar" : "enviar"} a foto.`,
				ToastType.ERROR,
			);
		}

		isUploadingPicture = false;
	};
</script>

<div class="pictureContainer group/container relative rounded-full border-4 border-amber-600 p-1">
	{#if user.picture}
		<button
			on:click={handlePictureDelete}
			aria-label="Remover foto"
			title="Remover foto"
			class="absolute right-0 top-0 z-10 hidden rounded-full bg-zinc-700/70 p-1 hover:bg-zinc-800/70 group-hover/container:block"
		>
			<X color="#fff" size={18} />
		</button>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={() => pictureLabel.click()}
		class="pictureWrapper group/picture relative h-48 w-48 select-none overflow-hidden rounded-full"
	>
		<img
			src={getAvatar(user.picture)}
			alt={user.name}
			class="h-48 w-48 rounded-full object-cover"
		/>
		<div
			class="absolute bottom-0 left-0 flex h-12 w-full justify-center bg-slate-900/60 transition-transform group-hover/picture:translate-y-0 {user.picture
				? 'translate-y-12'
				: ''}"
		>
			<label
				bind:this={pictureLabel}
				for="picture"
				class="mt-3 h-12 cursor-pointer text-xs font-bold uppercase text-zinc-50 {!user.picture
					? 'group-hover/picture:underline'
					: ''}">{user.picture ? "Alterar" : "Enviar"} foto</label
			>
			<input
				on:change={handlePictureUpload}
				type="file"
				name="picture"
				id="picture"
				accept="image/jpeg, image/png"
				class="hidden"
			/>
		</div>
	</div>
</div>

<style lang="postcss">
	.pictureContainer::after {
		content: "";
		width: 2rem;
		height: 2rem;
		position: absolute;
		right: 0;
		top: 0rem;
	}

	.pictureWrapper::after {
		content: "";
		width: 12rem;
		height: 12rem;
		position: absolute;
		left: 0;
		top: 0rem;
		border-radius: 50%;
		cursor: pointer;
	}
</style>
