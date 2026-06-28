# Selected Projects — Assets Guide

Drop your real files here. The website maps each category to its own folder and
reads files by number. **Keep the exact file names** (`1`, `2`, … `6`) and the
website picks them up automatically — no code changes needed.

```
public/projects/
├── long-form/     6 videos + 6 posters   (horizontal player)
├── shorts/        6 videos + 6 posters   (VERTICAL 9:16 player)
├── event/         6 videos + 6 posters   (horizontal player)
├── social/        6 images               (gallery grid)
├── thumbnails/    6 images               (gallery grid)
└── branding/      6 images               (gallery grid)
```

## What file goes where

### Video categories — need both a video AND a poster per slot
For each slot `n` (1–6): `n.mp4` (the video) + `n.jpg` (the thumbnail shown before play).

| Category   | Folder        | Slots & current titles |
|------------|---------------|------------------------|
| Long-Form  | `long-form/`  | 1 Island Challenge · 2 24H Survival · 3 $1 vs $1M · 4 World Tour · 5 Mega Build · 6 Final Round |
| Shorts/Reels (VERTICAL) | `shorts/` | 1 Hook 01 · 2 Viral Cut · 3 POV · 4 Trend 02 · 5 Challenge · 6 Teaser |
| Event      | `event/`      | 1 Aftermovie · 2 Promo · 3 Recap · 4 Stage Visuals · 5 Teaser · 6 Highlights |

> Shorts must be **vertical (9:16)** clips — they play inside a phone-style frame.

### Gallery categories — need 1 image per slot
For each slot `n` (1–6): `n.jpg` only (no video).

| Category   | Folder        | Slots |
|------------|---------------|-------|
| Social Media | `social/`   | 1–6 feed posts / story / reel covers |
| Thumbnails | `thumbnails/` | 1–6 thumbnail designs |
| Branding   | `branding/`   | 1–6 brand / identity pieces |

The `n.jpg` files already in each folder are **placeholders** — overwrite them.

## File specs (for performance — please follow)

**Videos (`.mp4`)**
- Codec: **H.264 (AVC) + AAC audio**, `.mp4`
- Resolution: **1080p max** (long-form/event), shorts **1080×1920**
- **Keep each file UNDER 20 MB** — hard cap is **25 MB/file** (Cloudflare Pages limit).
  Trim clips to short highlights (15–30s) and compress (~3–5 Mbps).
- Don't have small files? Tell me and I'll switch to YouTube/Cloudflare Stream embeds instead.

**Images (`.jpg`)**
- ~1280px on the long side, **JPG/WebP, under ~200 KB each**.

You don't have to fill all 6 per category — give me what you have and I'll
shrink the grids/sliders to match. To rename the titles, just tell me.
