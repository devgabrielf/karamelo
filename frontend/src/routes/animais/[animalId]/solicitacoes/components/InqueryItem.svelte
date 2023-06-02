<script lang="ts">
	import type { ValuesType } from "utility-types";
	import type { InqueriesByAnimal } from "$types";
	import { getAvatar } from "$utils";
	import { InqueryStatus } from "$enums";
	import { ChevronsRight } from "lucide-svelte";

	export let inquery: ValuesType<InqueriesByAnimal["inqueries"]>;

	$: author = inquery.author;

	$: isActive = [InqueryStatus.PENDING, InqueryStatus.APPROVED].includes(inquery.status);

	const getStatusColor = () => {
		switch (inquery.status) {
			case InqueryStatus.PENDING:
				return "bg-yellow-500";
			case InqueryStatus.APPROVED:
				return "bg-green-600";
			case InqueryStatus.REJECTED:
				return "bg-red-600";
		}
	};

	const getStatusLabel = () => {
		switch (inquery.status) {
			case InqueryStatus.PENDING:
				return "pendente";
			case InqueryStatus.APPROVED:
				return "aprovada";
			case InqueryStatus.REJECTED:
				return "rejeitada";
		}
	};
</script>

<li class="w-full rounded-lg hover:bg-gray-200/40 hover:shadow-sm">
	<svelte:element
		this={isActive ? "a" : "div"}
		href="solicitacoes/{inquery.id}/"
		class="group flex items-center justify-between py-2 px-4"
	>
		<div class="flex items-center gap-4">
			<img src={getAvatar(author.avatar)} alt={author.name} class="h-12 w-12 rounded-full" />
			<span class="text-lg">{author.name}</span>
		</div>
		<div class="flex items-center gap-4">
			<p>
				<b>Status:</b>
				<span class="bg-ap mx-1 mb-[1px] inline-block h-2 w-2 rounded-full {getStatusColor()}" />
				{getStatusLabel()}
			</p>
			<div
				class="invisible text-zinc-500 {isActive ? 'group-hover:visible' : ''}"
			>
				<ChevronsRight size={24} />
			</div>
		</div>
	</svelte:element>
</li>
