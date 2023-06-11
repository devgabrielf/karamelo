<script lang="ts">
	import type { User } from "$types";
	import { getAvatar } from "$utils";
	import { onMount } from "svelte";
	import { scale } from "svelte/transition";

	import { Button } from "$components";
	import { invalidateAll } from "$app/navigation";
	import { UserRole } from "$enums";

	export let user: User;

	let isOpen = false; // menu state
	let menu: HTMLDivElement; // menu wrapper DOM reference

	onMount(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (isOpen && !menu.contains(event.target as Node)) {
				isOpen = false;
			}
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (isOpen && event.key === "Escape") {
				isOpen = false;
			}
		};

		document.addEventListener("click", handleOutsideClick, false);
		document.addEventListener("keyup", handleEscape, false);

		return () => {
			document.removeEventListener("click", handleOutsideClick, false);
			document.removeEventListener("keyup", handleEscape, false);
		};
	});
</script>

<div bind:this={menu} class="relative flex items-center">
	<div>
		<Button
			as="button"
			variant="tertiary"
			size="small"
			on:click={() => (isOpen = !isOpen)}
			className="flex items-center {isOpen ? 'text-amber-600' : ''}"
		>
			<div class="mr-2 rounded-full border-2 border-amber-600 p-0.5">
				<img
					class="h-8 w-8 rounded-full object-cover"
					src={getAvatar(user.avatar)}
					alt={user.name}
				/>
			</div>
			{user.name.split(" ")[0]}
		</Button>

		{#if isOpen}
			<div
				in:scale={{ duration: 100, start: 0.95 }}
				out:scale={{ duration: 100, start: 0.95 }}
				class="absolute right-0 mt-4 flex origin-top-right flex-col gap-1 rounded-md bg-slate-50 p-2 shadow-md"
			>
				<Button
					as="a"
					on:click={() => (isOpen = false)}
					href="/perfil/"
					variant="tertiary"
					size="small"
					className="text-start font-medium">Perfil</Button
				>
				<Button
					as="a"
					on:click={() => (isOpen = false)}
					href="/perfil/solicitacoes/"
					variant="tertiary"
					size="small"
					className="text-start font-medium">Solicitações</Button
				>
				<Button
					as="a"
					on:click={() => (isOpen = false)}
					href="/perfil/animais-cadastrados/"
					variant="tertiary"
					size="small"
					className="text-start font-medium">Animais cadastrados</Button
				>
				{#if user.role === UserRole.ADMIN}
					<Button
						as="a"
						on:click={() => (isOpen = false)}
						href="/perfil/animais-pendentes/"
						variant="tertiary"
						size="small"
						className="text-start font-medium">Animais pendentes</Button
					>
				{/if}
				<form
					method="POST"
					action="/api/auth/logout/"
					on:submit|preventDefault={async () => {
						const response = await fetch("/logout", {
							method: "POST",
							headers: {
								accept: "application/json",
							},
						});
						if (response.ok) {
							invalidateAll();
						}
					}}
				>
					<Button
						as="button"
						type="submit"
						variant="tertiary"
						size="small"
						className="text-start font-medium w-full">Sair</Button
					>
				</form>
			</div>
		{/if}
	</div>
</div>
