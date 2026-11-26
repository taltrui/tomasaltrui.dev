export type Lang = "en" | "es";

export const langs: Lang[] = ["en", "es"];

/** URL of `path` (e.g. "/writing") in `lang`: English lives at the root, Spanish under /es. */
export const localize = (lang: Lang, path: string) =>
	lang === "en" ? path : path === "/" ? "/es/" : `/es${path}`;

/** Inverse of `localize`: strips the /es prefix and any trailing slash. */
export const unlocalize = (pathname: string) =>
	pathname.replace(/^\/es(?=\/|$)/, "").replace(/\/+$/, "") || "/";

export const formatDate = (date: string, lang: Lang) =>
	new Date(`${date}T00:00:00`).toLocaleDateString(lang === "en" ? "en-US" : "es-AR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
