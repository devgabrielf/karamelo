<script lang="ts">
	import type { PageData } from "./$types";
	import { API_BASE_URL } from "$lib/consts";
	import { toast, ToastType } from "$lib/toast";

	import { Box, ImageCard, ImageInput } from "$components";
	import { AvatarInput } from "./components";

	export let data: PageData;

	$: user = data.user;

	let isUploadingImage = false;
	let isDeletingImage = false;

	const handleImageUpload = async (event: CustomEvent) => {
		const file = event.detail.file as File;

		if (!file || isUploadingImage || !user) {
			return;
		}

		isUploadingImage = true;

		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${API_BASE_URL}/users/me/images/`, {
			headers: {
				"Access-Control-Allow-Origin": "origin-list",
				Authorization: `Bearer ${user.accessToken}`,
			},
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			const { homeImages } = await response.json();
			user.homeImages = homeImages;
		} else {
			toast("Ocorreu um erro ao enviar a foto.", ToastType.ERROR);
		}

		isUploadingImage = false;
	};

	const handleImageDelete = async (event: CustomEvent) => {
		if (isDeletingImage || !user) {
			return;
		}

		isDeletingImage = true;

		const imageId = event.detail.imageId as number;

		const response = await fetch(`${API_BASE_URL}/users/me/images/${imageId}`, {
			method: "DELETE",
			headers: {
				"Access-Control-Allow-Origin": "origin-list",
				Authorization: `Bearer ${user.accessToken}`,
			},
		});

		if (response.ok) {
			user.homeImages = user.homeImages.filter(image => image.id !== imageId);
		} else {
			toast("Ocorreu um erro ao remover a foto.", ToastType.ERROR);
		}

		isDeletingImage = false;
	};
</script>

{#if user}
	<Box className="flex items-center gap-6">
		<AvatarInput {user} />
		<div class="flex flex-col">
			<h2 class="text-3xl font-bold">{user.name}</h2>
			<span class="text-zinc-600">{user.city}, {user.uf}</span>
			<span class="mt-4 text-zinc-600">{user.email}</span>
		</div>
	</Box>
	<Box className="mt-4 mb-8">
		<h2 class="text-3xl font-bold">Fotos do ambiente</h2>
		<p class="mt-2 text-zinc-600">
			Adicione fotos do ambiente no qual seus pets vivem ou vão viver para serem analisadas durante
			suas solicitações de adoção.
		</p>
		<div class="mt-10 grid grid-cols-3 gap-4">
			{#each user.homeImages as image (image.id)}
				<ImageCard
					id={image.id}
					src={image.src}
					on:delete={handleImageDelete}
					isDeletable
				/>
			{/each}
			{#if user.homeImages.length < 6}
				<ImageInput on:upload={handleImageUpload} />
			{/if}
		</div>
	</Box>
{/if}
