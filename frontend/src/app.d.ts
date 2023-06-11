// See https://kit.svelte.dev/docs/types#app

import type { User } from "$types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			user: User | null;
			title?: string;
		}
		// interface Platform {}
	}
}

export {};
