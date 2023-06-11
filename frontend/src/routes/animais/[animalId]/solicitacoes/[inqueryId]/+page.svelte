<script lang="ts">
	import type { PageData } from "./$types";
	import { ChevronsLeft, MessageCircle } from "lucide-svelte";
	import { getAvatar } from "$utils";
	import { toast, ToastType } from "$lib/toast";
	import { API_BASE_URL } from "$lib/consts";
	import { InqueryStatus } from "$enums";
	import { goto, invalidate } from "$app/navigation";

	import { Box, Button, ImageCard, InqueryMessages } from "$components";

	export let data: PageData;

	$: inquery = data.inquery;
	$: author = data.inquery.author;
	$: user = data.user;
	$: animal = data.animal;

	let showMessagesModal = false;

	let isFetching = false;

	let currentMessage = "";

	const handleReject = async () => {
		if (isFetching) {
			return;
		}

		isFetching = true;

		const response = await fetch(`${API_BASE_URL}/inqueries/${inquery.id}/reject`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			goto(".", {
				invalidateAll: true,
			});

			toast(`Solicitação rejeitada.`, ToastType.SUCCESS);
		} else {
			toast("Ocorreu um erro ao rejeitar a solicitação.", ToastType.ERROR);
		}

		isFetching = false;
	};

	const handleAccept = async () => {
		if (isFetching) {
			return;
		}

		isFetching = true;

		const response = await fetch(`${API_BASE_URL}/inqueries/${inquery.id}/approve`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		});

		if (response.ok) {
			await invalidate("animal:inqueries");
			toast(`Solicitação aceita.`, ToastType.SUCCESS);
		} else {
			toast("Ocorreu um erro ao aceitar a solicitação.", ToastType.ERROR);
		}

		isFetching = false;
	};

	const handleFinish = async () => {
		if (isFetching) {
			return;
		}

		isFetching = true;

		const response = await fetch(`${API_BASE_URL}/animals/${inquery.animal.id}/mark-as-adopted`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				adopterId: author.id,
			}),
		});

		if (response.ok) {
			goto("/perfil/animais-cadastrados/");
			toast(`Solicitação finalizada.`, ToastType.SUCCESS);
		} else {
			toast("Ocorreu um erro ao finalizar a solicitação.", ToastType.ERROR);
		}

		isFetching = false;
	};
</script>

<Box>
	<a
		href="."
		class="flex items-center gap-1 leading-4 text-zinc-500 transition-colors hover:text-zinc-600"
	>
		<ChevronsLeft size="16" />voltar
	</a>
	<div class="mt-8">
		<p class="text-lg">Solicitação enviada por:</p>
		<div class="mt-4 flex flex-col gap-10 rounded-lg border border-slate-200 bg-slate-100 p-8">
			<div class="flex w-full gap-8 ">
				<div class="flex w-36 flex-[1] flex-col items-center gap-4">
					<img
						src={getAvatar(author.picture)}
						alt={author.name}
						class="aspect-square h-36 rounded-full object-cover"
					/>
					<span class="text-lg font-medium text-center">{author.name}</span>
				</div>
				<div class="flex-[2]">
					<h2 class="mb-2 text-lg font-bold">Mensagem:</h2>
					<p>{inquery.message}</p>
				</div>
			</div>
			{#if author.homeImages.length}
				<div>
					<h2 class="mb-4 text-lg font-bold">Fotos:</h2>
					<div class="grid grid-cols-3 gap-4">
						{#each author.homeImages as image (image.id)}
							<ImageCard id={image.id} src={image.src} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
		<div
			class="mt-8 flex items-end justify-end {inquery.status === InqueryStatus.PENDING
				? 'gap-4'
				: 'gap-6'}"
		>
			{#if inquery.status === InqueryStatus.PENDING}
				<Button as="button" on:click={handleReject} variant="reject" size="small" className="w-40">
					Rejeitar
				</Button>
				<Button as="button" on:click={handleAccept} variant="approve" size="small" className="w-40">
					Aceitar
				</Button>
			{:else}
				<div class="flex flex-col items-center gap-1">
					<span>{author.name.split(" ")[0]} adotou {animal.name}?</span>
					<Button
						as="button"
						on:click={handleFinish}
						variant="approve"
						size="small"
						className="w-40"
					>
						Finalizar
					</Button>
				</div>
				<button
					on:click={() => (showMessagesModal = true)}
					aria-label="Mensagens"
					title="Mensagens"
					class="rounded-full bg-slate-200 p-3 text-zinc-600 shadow-md shadow-black/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/25"
				>
					<MessageCircle />
				</button>
			{/if}
		</div>
	</div>
</Box>
<InqueryMessages
	on:close={() => (showMessagesModal = false)}
	bind:showMessages={showMessagesModal}
	{inquery}
	{user}
/>
