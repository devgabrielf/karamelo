<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";
	import { AnimalStatus, InqueryStatus, Sex } from "$enums";
	import { getAvatar, getFormattedAge, getRedirectUrl, getSexIcon } from "$utils";
	import { ToastType, toast } from "$lib/toast";
	import { CheckCircle2, MessageCircle } from "lucide-svelte";

	import { Box, Button, Modal, TextareaField } from "$components";
	import AnimalPictureSlider from "./components/AnimalPictureSlider.svelte";
	import { API_BASE_URL } from "$lib/consts";
	import type { Inquery } from "$types";
	import InqueryMessages from "$components/InqueryMessages.svelte";

	export let data: PageData;

	$: animal = data.animal;
	$: user = data.user;
	$: inquery = animal.inquery;
	$: showInqueryModal = data.openInquery;

	let inqueryMessage = "";
	let messageError = "";

	let showMessagesModal = false;

	let isFetching = false;

	const handleModalOpen = () => {
		if (!user) {
			goto(`/entrar/?${getRedirectUrl(`/animais/${animal.id}/?inquery=true`)}`);
			return;
		}

		showInqueryModal = true;
	};

	const validateMessage = () => {
		if (!inqueryMessage) {
			messageError = "Insira a mensagem";
			return false;
		}

		if (inqueryMessage.length < 10) {
			messageError = "A mensagem deve conter pelo menos 10 caracteres";
			return false;
		}

		if (inqueryMessage.length > 500) {
			messageError = "A mensagem deve no máximo 500 caracteres";
			return false;
		}

		messageError = "";
		return true;
	};

	const handleInquery = async () => {
		if (!validateMessage() || isFetching || !user) {
			return;
		}

		isFetching = true;

		const response = await fetch(`${API_BASE_URL}/inqueries/create/${animal.id}/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: inqueryMessage,
			}),
		});

		if (response.ok) {
			const _inquery: Inquery = await response.json();

			showInqueryModal = false;
			inqueryMessage = "";
			inquery = _inquery;

			toast("Solicitação enviada com sucesso!", ToastType.SUCCESS);
		} else {
			toast("Ocorreu um erro ao enviar a solicitação.", ToastType.ERROR);
		}

		isFetching = false;
	};

	const handleEvaluate = async (action: "approve" | "disapprove") => {
		if (isFetching || !user) {
			return;
		}

		isFetching = true;

		const response = await fetch(`${API_BASE_URL}/animals/${animal.id}/${action}/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		});

		if (response.ok) {
			goto("/perfil/animais-pendentes/", {
				invalidateAll: true,
			});

			toast(`Animal ${action === "approve" ? "aprovado" : "reprovado"}.`, ToastType.SUCCESS);
		} else {
			toast(
				`Ocorreu um erro ao ${action === "approve" ? "aprovar" : "reprovar"} o animal.`,
				ToastType.ERROR,
			);
		}

		isFetching = false;
	};

	onMount(() => {
		window.history.replaceState({}, document.title, window.location.pathname);
	});
</script>

<AnimalPictureSlider {animal} />
<div class="mx-auto mt-12 mb-8 flex max-w-5xl items-start gap-8">
	<Box className=" flex flex-[2] flex-col">
		<div class="mb-4 flex items-center">
			<strong class="flex-1 text-4xl">{animal.name}</strong>
			<img
				src={getSexIcon(animal.sex)}
				alt={animal.sex === Sex.MALE ? "Male" : "Female"}
				class="h-6 w-6"
			/>
		</div>
		<div class="flex gap-3 text-zinc-500">
			<span>
				{animal.city}, {animal.uf}
			</span>
			•
			<span>
				{animal.sex === Sex.FEMALE ? "Fêmea" : "Macho"}
			</span>
			•
			<span>
				{getFormattedAge(animal.months)}
			</span>
		</div>
		<div class="mt-4 border-t pt-4">
			<h3 class="mb-2 text-xl font-bold">Sobre:</h3>
			<p class="">{animal.description}</p>
		</div>
	</Box>
	<Box className="flex flex-1 flex-col gap-4">
		<p class="text-sm">
			Publicado em {new Intl.DateTimeFormat("pt-BR").format(new Date(animal.createdAt))} por:
		</p>
		<div class=" ml-2 flex items-center gap-4">
			<img
				src={getAvatar(animal.author.avatar)}
				alt={animal.author.name}
				class="h-12 w-12 rounded-full"
			/>
			<span class="text-lg">{animal.author.name}</span>
		</div>
		{#if animal.status === AnimalStatus.PENDING}
			<div class="mt-2 flex gap-4 border-t pt-6">
				<Button
					as="button"
					on:click={() => handleEvaluate("disapprove")}
					variant="reject"
					size="small"
					className="flex-1"
				>
					Reprovar
				</Button>
				<Button
					as="button"
					on:click={() => handleEvaluate("approve")}
					variant="approve"
					size="small"
					className="flex-1"
				>
					Aprovar
				</Button>
			</div>
		{:else if user?.id !== animal.author.id}
			{#if !inquery}
				<p class="mt-2 border-t pt-3 text-center text-lg font-bold">
					Se interessou por {animal.name}?
				</p>
				<Button as="button" on:click={handleModalOpen} className="w-full">Quero adotar</Button>
			{:else if inquery.status === InqueryStatus.PENDING}
				<div>
					<div class="mt-2 mb-3 flex justify-center border-t pt-8">
						<CheckCircle2 size={32} color="green" />
					</div>
					<p class="text-center text-lg text-zinc-500">Solicitação enviada!</p>
				</div>
			{:else}
				<div>
					<p class="mt-2 mb-4 border-t pt-6 text-center text-lg text-zinc-500">
						Solicitação aceita!
					</p>
					<Button
						on:click={() => (showMessagesModal = true)}
						as="button"
						className="w-full flex gap-2 justify-center items-center"
					>
						Mensagens
						<MessageCircle />
					</Button>
				</div>
			{/if}
		{:else}
			<div class="mt-2 w-full border-t pt-2" />
			<Button as="a" href="/animais/{animal.id}/solicitacoes/" className="w-full">
				Ver solicitações
			</Button>
		{/if}
	</Box>
	{#if !inquery}
		<Modal bind:showModal={showInqueryModal} on:close={() => (showInqueryModal = false)}>
			<form on:submit|preventDefault={handleInquery} class="flex w-96 flex-col gap-8">
				<h2 class="text-xl">
					Para manifestar interesse na adoção de <b>{animal.name}</b>, deixe sua mensagem:
				</h2>
				<TextareaField name="message" bind:value={inqueryMessage} error={messageError} />
				<div class="flex gap-4">
					<Button
						as="button"
						on:click={() => (showInqueryModal = false)}
						type="button"
						variant="secondary"
						size="medium"
						className="flex-1"
					>
						Cancelar
					</Button>
					<Button as="button" type="submit" size="medium" className="flex-1">
						Enviar solicitação
					</Button>
				</div>
			</form>
		</Modal>
	{/if}
</div>
{#if inquery?.status === InqueryStatus.APPROVED && user}
	<InqueryMessages
		on:close={() => (showMessagesModal = false)}
		bind:showMessages={showMessagesModal}
		inqueryId={inquery.id}
		{user}
	/>
{/if}
