<script lang="ts">
	import { page } from "$app/stores";
	import type { ActionData, PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";
	import { toast, ToastType } from "$lib/toast";

	import { Button, Box, Container, Field } from "$components";

	export let data: PageData;
	export let form: ActionData;

	const { form: sForm, errors, enhance } = superForm(data.form);

	$: error = form?.error;

	$: {
		if (error) {
			toast(error, ToastType.ERROR);
		}
	}
</script>

<Container>
	<Box>
		<form method="POST" use:enhance class="flex w-72 flex-col gap-4">
			<Field
				name="email"
				label="E-mail"
				type="text"
				autocomplete="off"
				placeholder="Insira o e-mail"
				bind:value={$sForm.email}
				error={$errors.email?.[0]}
			/>
			<Field
				name="password"
				label="Senha"
				type="password"
				placeholder="Insira a senha"
				bind:value={$sForm.password}
				error={$errors.password?.[0]}
			/>
			<div class="flex w-full flex-col gap-4">
				<Button as="button" type="submit" size="medium" variant="primary" className="mt-4"
					>Entrar</Button
				>
				<p class="mx-auto text-sm">
					Não possui uma conta? <a
						href="/cadastro{$page.url.search}"
						class="font-bold text-amber-600 transition-colors hover:text-amber-700">Cadastre-se</a
					>
				</p>
			</div>
		</form>
	</Box>
</Container>
