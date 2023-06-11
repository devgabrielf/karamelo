<script lang="ts">
	import { page } from "$app/stores";
	import { UserRole } from "$enums";
	import type { LayoutData } from "./$types";
	import { Link } from "./components";

	export let data: LayoutData;

	$: user = data.user;
</script>

<div class="mx-auto flex w-full max-w-5xl items-start gap-8 pt-20">
	<aside class="fixed flex flex-col gap-4 w-[21rem]">
		<Link
			title="Perfil"
			description="Visualizar e editar perfil"
			to="/perfil"
			isActive={$page.route.id === "/perfil"}
		/>
		<Link
			title="Solicitações"
			description="Animais pelos quais manifestou interesse"
			to="/perfil/solicitacoes"
			isActive={$page.route.id === "/perfil/solicitacoes"}
		/>
		<Link
			title="Animais cadastrados"
			description="Animais que você cadastrou"
			to="/perfil/animais-cadastrados"
			isActive={$page.route.id === "/perfil/animais-cadastrados"}
		/>
		{#if user?.role === UserRole.ADMIN}
			<p class="mt-4 ml-1 text-sm font-bold text-zinc-500">ADMIN</p>
			<Link
				title="Animais pendentes"
				description="Animais cadastrados por usuários aguardando aprovação"
				to="/perfil/animais-pendentes"
				isActive={$page.route.id === "/perfil/animais-pendentes"}
			/>
		{/if}
	</aside>
	<div class="ml-96 flex flex-1 flex-col">
		<slot />
	</div>
</div>
