/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			aspectRatio: {
				"29/20": "29 / 20",
			},
		},
		fontFamily: {
			quicksand: ["Quicksand", "sans-serif"],
			rowdies: ["Rowdies", "sans-serif"],
		},
	},
	plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
