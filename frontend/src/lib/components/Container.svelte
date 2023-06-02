<script lang="ts">
	export let className = "";
</script>

<div class="flex h-[calc(100vh-9rem)] w-screen flex-col items-center justify-center {className}">
	<slot />
</div>
