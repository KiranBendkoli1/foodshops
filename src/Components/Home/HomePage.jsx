import React, { useEffect, useMemo } from "react";
import FoodPlaces from "./FoodPlaces";
import Seo from "../SEO/Seo";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "../../seo/constants";
import { buildAbsoluteUrl } from "../../seo/absoluteUrl";

const HomePage = () => {
  // Ensure dark theme for home feed
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: buildAbsoluteUrl("/"),
      description: DEFAULT_DESCRIPTION,
    }),
    []
  );

  return (
    <>
      <Seo
        description={DEFAULT_DESCRIPTION}
        jsonLd={jsonLd}
      />
      <FoodPlaces />
    </>
  );
};

export default HomePage;
