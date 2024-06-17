import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	base: '.',
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true
		})
	],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({ fallback: 'index.html' }),
		prerender: { entries: ['/'] },
		paths: {
			base: ''
		},
		alias: {
			// this will match a file
			"$lib": "./src/lib",
			"$lib/*": "./src/lib/*",
			"$types": "./src/types",
			"$types/*": "./src/types/*",
			"$stores": "./src/stores",
			"$stores/*": "./src/stores/*"
		}
	}
};

export default config;
