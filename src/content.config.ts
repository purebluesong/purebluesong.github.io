import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const thoughts = defineCollection({
	loader: glob({ base: './src/content/thoughts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const hub = defineCollection({
	loader: glob({ base: './src/content/hub', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		updatedDate: z.coerce.date().optional(),
		order: z.number().optional(),
	}),
});

const works = defineCollection({
	loader: glob({ base: './src/content/works', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		kind: z.enum(['site', 'game', 'other']).default('other'),
		url: z.string().url().optional(),
		year: z.number().int().optional(),
		order: z.number().optional(),
	}),
});

export const collections = { thoughts, hub, works };
