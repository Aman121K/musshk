# Musshk – Image dimensions for design team

Use these specs for all assets so they look sharp on **mobile** and **website (desktop)** and load efficiently.

---

## Mobile vs website – display sizes

Rough viewport breakpoints used on the site:
- **Mobile:** &lt; 768px width (single column, full-width images)
- **Tablet:** 768px – 1024px
- **Desktop / Website:** ≥ 1024px (max content width ~1400px)

---

## 1. Product photos

**Aspect ratio:** 1:1 (square) everywhere.

| Context | Mobile display | Website display | Source file to deliver |
|--------|-----------------|------------------|-------------------------|
| **Product card (grid)** | ~50% viewport width (e.g. 180×180px) | ~25% container (e.g. 300×300px) | **One file:** 1200 × 1200 (min 1000 × 1000) |
| **Product detail main** | Full width, square (e.g. 360×360px) | ~50% column (e.g. 500×500px) | Same as above |
| **Product thumbnails** | 80×80px | 80×80px | Same file as main is fine |

- **One source size works for both mobile and website.** Delivering **1200 × 1200** covers all uses; **1000 × 1000** minimum.
- **Optional:** Separate mobile-optimized (e.g. 800×800) only if you need smaller file size for mobile; otherwise one 1200×1200 is recommended.

---

## 2. Banners (homepage / promotions / discounts)

**Aspect ratio:** 2:1 everywhere.

| Context | Mobile display | Website display | Source file to deliver |
|--------|-----------------|------------------|-------------------------|
| **Banner (full width)** | Full width, min height **220px** (e.g. 440×220px) | Full width, min height **320px** (e.g. 1600×320px) | **One file:** 2400 × 1200 (min 1600 × 800) |
| **Discount / promo banner** | Same as above | Same as above | Same as above |

- **One source size works for both.** Delivering **2400 × 1200** ensures sharpness on large desktops; **1600 × 800** minimum.
- **Optional variants:**  
  - **Mobile-only export:** 1200 × 600 (smaller file for mobile).  
  - **Website-only export:** 2400 × 1200 or 2880 × 1440 for retina.

---

## 3. Blog images

### 3.1 Blog listing card

| Context | Mobile display | Website display | Source file to deliver |
|--------|-----------------|------------------|-------------------------|
| **Card image** | Full width, height **192px** (e.g. 384×192px) | ~400px wide × **192px** height | **One file:** 1200 × 576 (min 800 × 384) |

- **One source works for both.** Aspect ~2.08:1; important content in center (object-cover crops).

### 3.2 Blog post hero (detail page)

| Context | Mobile display | Website display | Source file to deliver |
|--------|-----------------|------------------|-------------------------|
| **Hero image** | Full width, 16:9 (e.g. 360×202px) | Max ~900px wide, 16:9 (e.g. 900×506px) | **One file:** 1920 × 1080 or 1600 × 900 (min 1200 × 675) |

- **One source works for both.** 16:9; design so key area is centered for crop.

---

## 4. Other assets

| Asset | Mobile display | Website display | Source file to deliver |
|-------|-----------------|------------------|-------------------------|
| **Testimonial avatar** | 48×48px | 48×48px | **128 × 128** (min 96×96); one file for both. |
| **Marketplace logo** | Max 120×48px | Max 120×48px | **240 × 96**; one file for both. |
| **OG / Social share** | N/A (used in link previews) | N/A | **1200 × 630** |
| **Favicon / app icon** | 32×32, 180×180 | 32×32, 512×512 | **512 × 512** (+ 32×32, 180×180 if needed) |

---

## 5. Quick reference – one file for mobile + website

| Asset type | Recommended size (use for both mobile & website) | Aspect |
|------------|---------------------------------------------------|--------|
| Product photo | 1200 × 1200 | 1:1 |
| Banners & discount banners | 2400 × 1200 | 2:1 |
| Blog listing image | 1200 × 576 | ~2.08:1 |
| Blog post hero | 1920 × 1080 | 16:9 |
| Testimonial avatar | 128 × 128 | 1:1 |
| Marketplace logo | 240 × 96 | flexible |
| OG / social share | 1200 × 630 | 1.9:1 |

---

## 6. Optional: separate mobile vs website exports

If the team wants to optimize file size per device:

| Asset | Mobile-only export | Website-only export |
|-------|--------------------|----------------------|
| Product photo | 800 × 800 (optional) | 1200 × 1200 |
| Banner | 1200 × 600 (optional) | 2400 × 1200 |
| Blog listing | 800 × 384 (optional) | 1200 × 576 |
| Blog hero | 1200 × 675 (optional) | 1920 × 1080 |

*Note: The current site uses a single URL per image; separate mobile/website files would require dev support (e.g. `srcset` or different endpoints).*

---

## 7. Technical notes (for dev/design handoff)

- **Product images:** Square container, `object-cover`. Center the product; same crop on mobile and website.
- **Banners:** 2:1 container, `object-contain`. No cropping; one 2:1 file works on all breakpoints.
- **Blog listing:** Fixed height 192px on both mobile and website; width scales. Use one 1200×576 (or 800×384 min).
- **Blog hero:** 16:9 container; max width ~900px on website, full width on mobile. One 1920×1080 (or 1600×900) is enough.
- **Formats:** JPG for photos (quality 80–85); WebP where supported; PNG for logos and graphics with transparency.

---

*Last updated from Musshk frontend. Covers mobile and website (desktop) display sizes.*
