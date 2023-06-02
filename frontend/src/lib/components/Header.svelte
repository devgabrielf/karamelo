<script lang="ts">
	import { page } from "$app/stores";
	import type { User } from "$types";

	import { Button, UserDropdown } from "$components";
	import { getRedirectUrl } from "$utils";

	const excludedPaths = ["/", "/entrar", "/cadastro"];

	let redirectSearchParam: string;

	$: {
		if ($page.route.id) {
			let redirectURL = $page.route.id;

			Object.entries($page.params).forEach(([key, value]) => {
				redirectURL = redirectURL?.replace(`[${key}]`, value);
			});

			redirectSearchParam =
				redirectURL && $page.route.id && !excludedPaths.includes($page.route.id)
					? `?${getRedirectUrl(redirectURL)}`
					: excludedPaths.includes($page.route.id)
					? $page.url.search
					: "";
		}
	}

	export let user: User | null;
</script>

<header
	class="fixed top-0 z-50 h-16 w-screen max-w-full border-t-4 border-t-amber-600 bg-slate-50 shadow-md"
>
	<div class="mx-auto flex h-full max-w-5xl items-center justify-between">
		<a href="/" class="select-none text-2xl font-bold text-zinc-900 transition-colors">Karamelo</a>
		<nav class=" flex items-center gap-5">
			<Button as="a" href="/cadastrar-animal" variant="tertiary" size="small"
				>Cadastrar animal</Button
			>
			<div class="h-8 w-[1px] bg-zinc-600" />
			{#if user}
				<UserDropdown {user} />
			{:else}
				<Button as="a" href="/cadastro{redirectSearchParam}" variant="tertiary" size="small"
					>Cadastrar</Button
				>
				<Button as="a" href="/entrar{redirectSearchParam}" variant="tertiary" size="small"
					>Entrar</Button
				>
			{/if}
		</nav>
	</div>
</header>
<div class="h-16" />
