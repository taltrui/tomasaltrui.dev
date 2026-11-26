import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One Markdown file per language: src/content/writing/<lang>/<slug>.md
const writing = defineCollection({
	loader: glob({ pattern: "*/*.md", base: "./src/content/writing" }),
	schema: z.object({
		title: z.string(),
		date: z.string(),
		description: z.string().optional(),
	}),
});

export const collections = { writing };
