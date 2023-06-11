<script lang="ts">
	import type { MyInqueries, User } from "$types";

	import { AnimalCard, NoResults } from "$components";
	import { InqueryStatus } from "$enums";

	export let inqueries: MyInqueries;
	export let title: string;
	export let color: string;
	export let user: User | undefined = undefined;
</script>

{#if inqueries.length}
	<h3 class="mb-6 text-2xl font-bold"><span class={color}>>> </span>{title}</h3>
	<div class="mx-auto mb-12 grid w-full grid-cols-3 gap-8">
		{#each inqueries as inquery}
			<AnimalCard
				animal={inquery.animal}
				status={inquery.status === InqueryStatus.FINISHED
					? inquery.animal.adopter
						? InqueryStatus.FINISHED
						: InqueryStatus.REJECTED
					: inquery.status}
				href={inquery.status !== InqueryStatus.FINISHED ? `/animais/${inquery.animal.id}` : null}
				inqueryId={inquery.id}
				{user}
			/>
		{/each}
	</div>
{/if}
