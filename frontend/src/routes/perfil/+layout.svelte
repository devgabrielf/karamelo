<script lang="ts">
	import { page } from "$app/stores";
	import { Link } from "./components";
</script>

<div class="mx-auto pt-20 flex w-full max-w-5xl items-start gap-8">
	<aside class="flex flex-col gap-4 fixed">
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
	</aside>
	<div class="flex-1 flex flex-col ml-96">
		<slot />
	</div>
</div>
