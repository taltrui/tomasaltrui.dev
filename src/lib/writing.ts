import { type CollectionEntry, getCollection } from "astro:content";
import type { Lang } from "@/lib/i18n";

export type Post = CollectionEntry<"writing"> & { slug: string };

/** Posts in `lang`, newest first. Entry ids are `<lang>/<slug>`. */
export const getPosts = async (lang: Lang): Promise<Post[]> =>
	(await getCollection("writing", (entry) => entry.id.startsWith(`${lang}/`)))
		.map((entry) => ({ ...entry, slug: entry.id.slice(lang.length + 1) }))
		.toSorted((a, b) => b.data.date.localeCompare(a.data.date));
