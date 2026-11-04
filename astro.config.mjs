// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://purebluesong.github.io',
	base: '/',
	output: 'static',
	integrations: [mdx(), sitemap()],
	redirects: {
		'/blog': '/thoughts',
		'/blog/[...slug]': '/thoughts/[...slug]',
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Syne',
			cssVariable: '--font-display',
			weights: ['500', '600', '700', '800'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['Segoe UI', 'Helvetica Neue', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Source Serif 4',
			cssVariable: '--font-body',
			weights: ['400', '600', '700'],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'Noto Serif SC', 'Songti SC', 'serif'],
		},
	],
});
