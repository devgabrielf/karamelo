<script lang="ts">
	import { Send, X } from "lucide-svelte";
	import { getAvatar } from "$utils";
	import { API_BASE_URL } from "$lib/consts";
	import { ToastType, toast } from "$lib/toast";
	import { createEventDispatcher } from "svelte";
	import { SvelteToast } from "@zerodevx/svelte-toast";
	import type { Inquery, Message, User } from "$types";

	import { Modal, TextareaField } from "$components";
	import { formatHour, getByDay } from "$utils/date";

	const dispatch = createEventDispatcher();

	const onClose = () => {
		dispatch("close");
	};

	export let inqueryId: string | undefined = undefined;
	export let inquery: Inquery | undefined = undefined;
	export let showMessages: boolean;
	export let user: User;

	let showMessagesModal = false;

	const getMessages = async () => {
		const response = await fetch(
			`${API_BASE_URL}/inqueries/${inquery ? `${inquery.id}/messages/` : `${inqueryId}/`}`,
			{
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			},
		);

		if (response.ok) {
			const responseJson = await response.json();

			if (inquery) {
				inquery.messages = responseJson.messages;
			} else {
				inquery = responseJson;
			}

			window.requestAnimationFrame(() => {
				if (scrollableContainer) {
					scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
				}
			});

			showMessagesModal = true;
		} else {
			toast("Ocorreu um erro ao carregar as mensagens.", ToastType.ERROR);
		}
	};

	$: if (showMessages) {
		getMessages();
	}

	$: isInqueryAuthor = user.id === inquery?.author.id;

	let scrollableContainer: HTMLDivElement;

	let currentMessage = "";

	let isFetching = false;

	const handleMessage = async () => {
		if (!currentMessage || isFetching || !inquery) {
			return;
		}

		isFetching = true;

		const response = await fetch(
			`${API_BASE_URL}/inqueries/${inquery ? inquery.id : inqueryId}/messages/`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: currentMessage,
				}),
			},
		);

		if (response.ok) {
			currentMessage = "";

			const message: Message = await response.json();

			inquery.messages = [...inquery.messages, message];
		} else {
			toast("Ocorreu um erro ao enviar a mensagem.", ToastType.ERROR, "messages");
		}

		isFetching = false;
	};
</script>

{#if inquery}
	<Modal
		bind:showModal={showMessagesModal}
		on:close={() => {
			showMessagesModal = false;
			onClose();
		}}
	>
		<div class="relative flex w-screen max-w-lg flex-col">
			<button
				on:click={() => (showMessagesModal = false)}
				aria-label="Fechar"
				title="Fechar"
				class="absolute -top-1 -right-1 text-zinc-400 transition-colors hover:text-zinc-500"
			>
				<X />
			</button>
			<header class="flex items-center gap-4 border-b pb-4">
				<img
					src={getAvatar(isInqueryAuthor ? inquery.animal.author.avatar : inquery.author.avatar)}
					alt={isInqueryAuthor ? inquery.animal.author.name : inquery.author.name}
					class="h-12 w-12 rounded-full"
				/>
				<span class="text-lg"
					>{isInqueryAuthor ? inquery.animal.author.name : inquery.author.name}</span
				>
			</header>
			{#if inquery.messages.length}
				<div
					bind:this={scrollableContainer}
					class="flex h-full max-h-[50vh] min-h-[400px] flex-col overflow-y-auto px-1 py-4 pb-8 scrollbar scrollbar-thumb-slate-200 scrollbar-thumb-rounded-2xl scrollbar-w-[6px]"
				>
					{#each getByDay(inquery.messages) as day (day.date)}
						<div class="flex flex-col items-center gap-4">
							<span class="rounded-2xl bg-slate-100 px-3 py-1 text-sm text-zinc-600"
								>{day.date}</span
							>
							{#each day.items as message (message.id)}
								<div
									class="flex flex-col {message.authorId === user.id
										? 'items-end self-end'
										: 'self-start'}"
								>
									<p
										class="mb-[2px] max-w-[26rem] rounded-[20px] py-2 px-4 {message.authorId ===
										user.id
											? 'bg-sky-500 text-zinc-50'
											: 'bg-slate-100 text-zinc-800'}"
									>
										{message.content}
									</p>
									<time class="mb-2 text-xs text-zinc-500">{formatHour(message.createdAt)}</time>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex h-full min-h-[400px] flex-col items-center justify-center gap-4">
					<div class="text-zinc-300">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="120"
							height="120"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
							<path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
						</svg>
					</div>
					<p class="text-center text-xl text-zinc-400">
						Envie uma mensagem <br />para {(isInqueryAuthor
							? inquery.animal.author.name
							: inquery.author.name
						).split(" ")[0]}
					</p>
				</div>
			{/if}
			<form on:submit|preventDefault={handleMessage} class="flex items-end gap-3 pt-4">
				<TextareaField
					name="message"
					bind:value={currentMessage}
					placeholder="Digite sua mensagem..."
					hideLength
					autoResize
					rounded
					on:keydown={event => {
						if (event.key === "Enter") {
							event.preventDefault();

							if (currentMessage) {
								handleMessage();
							}
						}
					}}
					className="flex-1"
				/>
				<button
					type="submit"
					disabled={!currentMessage || isFetching}
					class="rounded-full p-[14px] {currentMessage && !isFetching
						? 'bg-amber-600 text-zinc-50 transition-colors hover:bg-amber-700'
						: 'cursor-not-allowed bg-zinc-100 text-zinc-400'}"
				>
					<Send size={22} />
				</button>
			</form>
		</div>
		<SvelteToast target="messages" />
	</Modal>
{/if}
