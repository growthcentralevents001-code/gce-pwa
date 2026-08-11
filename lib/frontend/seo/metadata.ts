import type { Metadata } from "next";

const SITE = "GCE Events";
const DEFAULT_DESC =
  "Growth Central Events — curated business networking, marketplace experiences, and enterprise solutions.";

export function publicMetadata(input: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const title =
    input.title === SITE || input.title.startsWith("GCE")
      ? input.title
      : `${input.title} · ${SITE}`;
  const description = input.description ?? DEFAULT_DESC;
  const path = input.path ?? "/";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: SITE,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function authMetadata(title: string): Metadata {
  return publicMetadata({
    title,
    description: `${title} for your GCE account.`,
    noIndex: true,
  });
}
