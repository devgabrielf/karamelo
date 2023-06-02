import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$api: "src/lib/api",
			$assets: "src/assets",
			$components: "src/lib/components",
			$enums: "src/lib/enums",
			$types: "src/lib/types",
			$utils: "src/lib/utils",
		},
	},
};

export default config;
