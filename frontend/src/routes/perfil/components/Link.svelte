<script lang="ts">
	export let title: string;
	export let description: string;
	export let to: string;
	export let isActive = false;
</script>

<a
	href={to}
	class="flex flex-col gap-1 rounded-xl border-l-4 bg-slate-50 px-6 py-4 shadow-md transition-all {isActive
		? 'border-amber-600'
		: 'border-slate-300 hover:shadow-black/20'}"
>
	<span class="text-lg font-bold">
		{title}
	</span>
	<p class="text-sm text-zinc-600">
		{description}
	</p>
</a>
