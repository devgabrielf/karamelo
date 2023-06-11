import { toast as libToast } from "@zerodevx/svelte-toast";
import type { SvelteToastOptions } from "@zerodevx/svelte-toast/stores";

export enum ToastType {
	SUCCESS = "success",
	ERROR = "error",
}

const themes = {
	success: {
		"--toastBackground": "#48bb78",
		"--toastBarBackground": "#2f855a",
	},
	error: {
		"--toastBackground": "#ef4444",
		"--toastBarBackground": "#b91c1c",
	},
};

export const toast = (message: string, type: ToastType, target: string | undefined = undefined) => {
	const options: SvelteToastOptions = {
		theme: {
			"--toastColor": "#fff",
			"--toastWidth": "fit-content",
			...themes[type],
		},
	};

	if (target) {
		options.target = target;
	}

	libToast.push(message, options);
};
