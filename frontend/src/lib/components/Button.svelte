<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

	type Element = $$Generic<"button" | "a">;

	interface ButtonComponentElements {
		button: HTMLButtonAttributes;
		a: HTMLAnchorAttributes;
	}

	type $$Props = ButtonComponentElements[Element] & {
		as: Element;
		variant?: "primary" | "secondary" | "tertiary" | "approve" | "reject";
		size?: "small" | "medium" | "large";
		className?: string;
	};

	export let as: Element;
	export let variant: "primary" | "secondary" | "tertiary" | "approve" | "reject" = "primary";
	export let size: "small" | "medium" | "large" = "large";
	export let className = "";

	const variants = {
		primary: "border-amber-600 bg-amber-600 text-zinc-50 hover:border-amber-700 hover:bg-amber-700",
		secondary: "border-amber-600 bg-transparent text-zinc-900 hover:text-amber-600",
		tertiary: "border-transparent bg-transparent text-zinc-900 hover:text-amber-600",
		approve: "border-green-600 bg-green-600 text-zinc-50 hover:border-green-700 hover:bg-green-700",
		reject: "border-red-600 bg-transparent text-red-600 hover:text-red-700",
	};

	const sizes = {
		small: "rounded-lg px-2 py-1",
		medium: "rounded-lg px-3 py-[0.4rem] text-md",
		large: "rounded-lg px-3 py-[0.6rem] text-xl",
	};
</script>

<svelte:element
	this={as}
	class="select-none border text-center font-bold transition-colors active:opacity-70 {sizes[
		size
	]} {variants[variant]} {className}"
	on:click
	{...$$restProps}
>
	<slot />
</svelte:element>
