import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

const BASE_URL = "https://chhandas.vercel.app";
const DEFAULT_TITLE =
  "छन्द Retrospective | Nepali & Sanskrit Poetry Meter Analyzer";
const DEFAULT_DESCRIPTION =
  "Analyze Nepali and Sanskrit poetry meters (Chhandas). Detect Anustubh, Indravajra, Vasantatilaka and more. Interactive tools for syllable counting, gana patterns, and poetry writing assistance.";
const DEFAULT_KEYWORDS =
  "chhanda, chhandas, छन्द, nepali poetry, sanskrit poetry, meter analyzer, anustubh, अनुष्टुप्, indravajra, vasantatilaka, gana, matra, syllable counter";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.svg`;

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | छन्द Retrospective` : DEFAULT_TITLE;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    // Update meta tags
    updateMeta("description", description);
    updateMeta("keywords", keywords);
    updateMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", fullCanonical, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:type", ogType, true);

    // Twitter
    updateMeta("twitter:title", fullTitle, true);
    updateMeta("twitter:description", description, true);
    updateMeta("twitter:url", fullCanonical, true);
    updateMeta("twitter:image", ogImage, true);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", fullCanonical);
    } else {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      canonicalLink.setAttribute("href", fullCanonical);
      document.head.appendChild(canonicalLink);
    }
  }, [
    fullTitle,
    description,
    keywords,
    fullCanonical,
    ogImage,
    ogType,
    noIndex,
  ]);

  return null;
}

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: undefined, // Uses default
    description:
      "Analyze Nepali and Sanskrit poetry meters (Chhandas). Detect classical meters like Anustubh, Indravajra, Vasantatilaka. Free online chhanda checker tool.",
    canonical: "/",
  },
  test: {
    title: "Chhanda Test",
    description:
      "Test if your Nepali or Sanskrit poetry follows a specific chhanda meter. Verify your poems against classical patterns like Anustubh, Indravajra, and more.",
    keywords:
      "chhanda test, poetry test, meter verification, chhanda checker, nepali poetry test, sanskrit meter test",
    canonical: "/test",
  },
  patternGenerator: {
    title: "Chhanda Pattern Generator",
    description:
      "Generate chhanda patterns for practice. Create custom gana patterns and learn Sanskrit/Nepali poetry meter structures.",
    keywords:
      "chhanda pattern, gana generator, poetry pattern, matra pattern, chhanda practice",
    canonical: "/pattern-generator",
  },
  syllableCounter: {
    title: "Syllable & Matra Analyzer",
    description:
      "Count syllables and matras in Nepali text. Analyze guru and laghu patterns. Perfect tool for understanding poetry meter structure.",
    keywords:
      "syllable counter, matra counter, guru laghu, nepali syllable, akshara counter",
    canonical: "/syllable-counter",
  },
  quiz: {
    title: "Chhanda Learning Quiz",
    description:
      "Test your knowledge of Sanskrit and Nepali poetry meters. Interactive quiz to learn chhandas and gana patterns.",
    keywords:
      "chhanda quiz, poetry quiz, gana quiz, learn chhanda, nepali poetry quiz",
    canonical: "/quiz",
  },
  poetryAssistant: {
    title: "Poetry Writing Assistant",
    description:
      "Write Nepali and Sanskrit poetry with real-time chhanda analysis. Get instant feedback on meter and gana patterns as you write.",
    keywords:
      "poetry assistant, chhanda helper, poetry writing tool, nepali poetry writer, sanskrit composition",
    canonical: "/poetry-assistant",
  },
  comparison: {
    title: "Chhanda Comparison Tool",
    description:
      "Compare two poems to check if they follow the same chhanda meter. Analyze pattern similarity and line-by-line comparison.",
    keywords:
      "poem comparison, chhanda compare, meter comparison, poetry analyzer",
    canonical: "/comparison",
  },
  about: {
    title: "About",
    description:
      "Learn about छन्द Retrospective - a free tool for analyzing Nepali and Sanskrit poetry meters. Understand chhandas, ganas, and classical poetic traditions.",
    keywords:
      "about chhanda, nepali poetry, sanskrit poetry, chhanda history, gana explanation",
    canonical: "/about",
  },
};
