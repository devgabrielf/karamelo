<script lang="ts">
	import { SvelteToast } from "@zerodevx/svelte-toast";
	import "../app.css";
	import { Header, Footer } from "$components";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: user = data.user;
</script>

<Header {user} />
<main class="min-h-[calc(100vh-9rem)]">
	<slot />
</main>
<Footer />
<SvelteToast />
