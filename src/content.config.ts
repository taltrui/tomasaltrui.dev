import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One Markdown file per language: src/content/writing/<lang>/<slug>.md. The file name is the URL slug;
// both versions of an article share `translationKey`.
const writing = defineCollection({
	loader: glob({ pattern: "*/*.md", base: "./src/content/writing" }),
	schema: z.object({
		title: z.string(),
		date: z.string(),
		translationKey: z.string(),
		description: z.string().optional(),
	}),
});

export const collections = { writing };
