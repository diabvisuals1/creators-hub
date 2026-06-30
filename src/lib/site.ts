/**
 * Central site config used across metadata, robots, sitemap and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL (e.g. in Cloudflare env vars) to your real domain;
 * falls back to the value below at build time.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://creatorshub.studio"
).replace(/\/+$/, "");

export const SITE_NAME = "Creators Hub";

export const SITE_TAGLINE = "Crafted to Captivate";

export const SITE_DESCRIPTION =
  "Creators Hub is a creative content agency in Cairo, Egypt helping creators, brands, agencies, and events stand out — long-form & short-form video editing, YouTube thumbnails, social media management, branding, and event content. Available worldwide.";

export const SITE_KEYWORDS = [
  "Creators Hub",
  "creative content agency",
  "content creation agency",
  "video editing agency",
  "video production",
  "YouTube video editing",
  "YouTube thumbnails",
  "shorts and reels editing",
  "social media management",
  "social media content",
  "branding and identity",
  "motion graphics",
  "event content",
  "creators agency Egypt",
  "content agency Cairo",
  "esports content",
];

export const CONTACT_EMAIL = "omar.diab.work@gmail.com";
export const CONTACT_PHONE = "+201105494439";
