import roqa from "@roqajs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [roqa()],
	build: {
		minify: true,
		modulePreload: false,
		rollupOptions: {
			input: "src/main.jsx",
			output: {
				entryFileNames: "main.js",
			},
		},
	},
});
