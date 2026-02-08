# SEO & Digital Marketing Setup

This document lists what is implemented for search engine crawling, ranking, and digital marketing.

## Implemented

### 1. **robots.txt** (`/robots.txt`)
- **Allow:** All crawlers (Google, Bing, etc.) can index the site.
- **Disallow:** `/checkout`, `/account`, `/login`, `/register`, `/order-success` (keep these out of search results).
- **Sitemap:** Points to `https://musshk.com/sitemap.xml` (uses `NEXT_PUBLIC_SITE_URL`).

### 2. **Sitemap** (`/sitemap.xml`)
- **Static pages:** Home, contact, our-story, FAQs, policies, cart, track-order, reviews, search, collection pages (best-seller, new-arrivals, inspired-perfumes, niche-edition, for-her, for-him), blog.
- **Dynamic product pages:** Fetched from API; each product gets a URL with `lastModified`, `changeFrequency`, and `priority` for better crawling.

### 3. **Meta & marketing tags (root layout)**
- **Title:** Default + template `%s | Musshk` for child pages.
- **Description & keywords:** Default description and keyword list (Musshk, luxury fragrances, perfume India, etc.).
- **Open Graph:** `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:site_name`, `og:locale` for social sharing (Facebook, LinkedIn, etc.).
- **Twitter Card:** `summary_large_image` with title, description, image for Twitter.
- **Robots:** `index: true`, `follow: true`, and `googleBot` so Google can index and follow links.
- **Canonical:** Default canonical URL to avoid duplicate content.
- **Verification placeholders:** Ready for Google Search Console, Bing, Yandex codes in `metadata.verification`.

### 4. **Structured data (JSON-LD)**
- **Organization:** Name, URL, logo, description (for Knowledge Panel / brand).
- **WebSite:** Name, URL, publisher, and **SearchAction** so Google can show a search box for your site.
- **Product (per product page):** Name, description, image, brand, offers (price, currency, availability), optional aggregateRating.

### 5. **Product pages**
- **Dynamic metadata:** Each product page gets its own `title`, `description`, Open Graph, Twitter Card, and canonical URL.
- **Product schema:** Product JSON-LD on each product page for rich results (price, availability, rating in search).

## Environment variables

In the **Musk** app, set:

- **`NEXT_PUBLIC_SITE_URL`**  
  Exact site URL (e.g. `https://musshk.com` or `https://www.musshk.com`). Used for:
  - Canonical URLs
  - Open Graph / Twitter URLs and images
  - Sitemap and robots.txt URLs

See `env.example` for a template.

## Optional next steps

1. **Google Search Console**  
   - Add property for `https://musshk.com` (or www).  
   - Add the verification meta tag in `app/layout.tsx` under `metadata.verification.google`.

2. **Bing Webmaster Tools**  
   - Add site and verification code in `metadata.verification.bing` if desired.

3. **Analytics / ads**  
   - Add Google Analytics or GTM via `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID` and a script in layout or a dedicated component.

4. **Social links**  
   - In `app/layout.tsx`, set `jsonLdOrganization.sameAs` to your social profile URLs (Facebook, Instagram, etc.) for better brand signals.

5. **Better product images for OG**  
   - Use a dedicated 1200×630 image for the default OG image (e.g. logo or hero) and ensure product images are high quality for Product schema and social cards.

## Hiding crawling (if ever needed)

Right now crawling is **allowed** so the site can rank on Google. If you need to **block** crawlers for part of the site or globally:

- To block all: in `app/robots.ts`, set `allow: []` and `disallow: ['/']` for `User-agent: *`.
- To block only certain paths: add paths to the `disallow` array (already done for checkout, account, login, register, order-success).
