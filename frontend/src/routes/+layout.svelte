<script lang="ts">
	import { SvelteToast } from "@zerodevx/svelte-toast";
	import "../app.css";
	import { Header, Footer } from "$components";
	import type { PageData } from "./$types";
	import { page } from "$app/stores";

	export let data: PageData;

	$: user = data.user;
</script>

<svelte:head>
	<title>{$page.data.title ? `${$page.data.title} | ` : ""}Karamelo</title>
</svelte:head>

<Header {user} />
<main class="min-h-[calc(100vh-9rem)]">
	<slot />
</main>
<Footer />
<SvelteToast />
