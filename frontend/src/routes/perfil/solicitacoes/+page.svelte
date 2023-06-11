<script lang="ts">
	import { NoResults } from "$components";
	import { InqueryStatus } from "$enums";
	import type { PageData } from "./$types";
	import Inqueries from "./components/Inqueries.svelte";

	export let data: PageData;

	$: user = data.user;
	$: inqueries = data.inqueries;

	$: pendingInqueries = inqueries.filter(inquery => inquery.status === InqueryStatus.PENDING);
	$: approvedInqueries = inqueries.filter(inquery => inquery.status === InqueryStatus.APPROVED);
	$: finishedInqueries = inqueries.filter(inquery =>
		[InqueryStatus.REJECTED, InqueryStatus.FINISHED].includes(inquery.status),
	);
</script>

{#if inqueries.length}
	<Inqueries inqueries={pendingInqueries} title="Solicitações pendentes" color="text-yellow-500" />
	<Inqueries
		inqueries={approvedInqueries}
		title="Solicitações aprovadas"
		color="text-green-600"
		user={user || undefined}
	/>
	<Inqueries inqueries={finishedInqueries} title="Solicitações finalizadas" color="text-lime-600" />
{:else}
	<div class="py-10">
		<NoResults description="Você ainda não realizou nenhuma solicitação." />
	</div>
{/if}
