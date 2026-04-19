import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
} from "../../seo/constants";
import { buildAbsoluteUrl } from "../../seo/absoluteUrl";

/**
 * Per-route head tags: title, description, canonical, Open Graph, Twitter.
 * @param {string} [title] - Short page title (appended with site name unless rawTitle is true).
 * @param {string} [description]
 * @param {string} [image] - Absolute URL recommended for og:image.
 * @param {string} [type] - Open Graph type, default "website".
 * @param {boolean} [noindex]
 * @param {boolean} [rawTitle] - When true, `title` is used as the full document title.
 * @param {object|object[]} [jsonLd] - JSON-LD object(s) for structured data.
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  type = "website",
  noindex = false,
  rawTitle = false,
  jsonLd,
}) {
  const { pathname, search } = useLocation();
  const canonical = useMemo(
    () => buildAbsoluteUrl(`${pathname}${search || ""}`),
    [pathname, search]
  );

  const ogImage = useMemo(() => {
    if (!image) return buildAbsoluteUrl("/logo512.png");
    if (/^https?:\/\//i.test(image)) return image;
    const path = image.startsWith("/") ? image : `/${image}`;
    return buildAbsoluteUrl(path);
  }, [image]);

  const pageTitle = useMemo(() => {
    if (!title) return SITE_NAME;
    if (rawTitle) return title;
    return `${title} | ${SITE_NAME}`;
  }, [title, rawTitle]);

  const ldJson = useMemo(() => {
    if (!jsonLd) return null;
    const payload = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    return JSON.stringify(
      payload.length === 1 ? payload[0] : payload
    );
  }, [jsonLd]);

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {ldJson ? (
        <script type="application/ld+json">{ldJson}</script>
      ) : null}
    </Helmet>
  );
}
