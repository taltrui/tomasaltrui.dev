import { type CollectionEntry, getCollection } from "astro:content";
import { type Lang, langs } from "@/lib/i18n";

export type Post = CollectionEntry<"writing"> & { slug: string };

/** Posts in `lang`, newest first. Entry ids are `<lang>/<slug>`. */
export const getPosts = async (lang: Lang): Promise<Post[]> =>
	(await getCollection("writing", (entry) => entry.id.startsWith(`${lang}/`)))
		.map((entry) => ({ ...entry, slug: entry.id.slice(lang.length + 1) }))
		.toSorted((a, b) => b.data.date.localeCompare(a.data.date));

/** Unprefixed path of `post` in each language, matched by `translationKey`. */
export const getPostPaths = async (post: Post): Promise<Record<Lang, string>> => {
	const entries = await Promise.all(
		langs.map(async (lang) => {
			const translation = (await getPosts(lang)).find(
				(other) => other.data.translationKey === post.data.translationKey,
			);
			if (!translation) {
				throw new Error(`"${post.id}" has no ${lang} version (translationKey "${post.data.translationKey}")`);
			}
			return [lang, `/writing/${translation.slug}`] as const;
		}),
	);
	return Object.fromEntries(entries) as Record<Lang, string>;
};
