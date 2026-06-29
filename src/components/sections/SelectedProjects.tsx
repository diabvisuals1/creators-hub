"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  Clapperboard,
  Smartphone,
  Mic,
  MessageCircle,
  Image as ImageIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Kind = "video" | "vertical" | "gallery";

type Item = {
  id: string;
  title: string;
  poster: string;
  video?: string;
};

type Category = {
  id: string;
  label: string;
  name: string;
  Icon: LucideIcon;
  kind: Kind;
  accent: string;
  emoji: string;
  subtitle: string;
  blurb: string[];
  items: Item[];
  galleryRatio?: string;
};

const popIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { delay, type: "spring" as const, stiffness: 180, damping: 18 },
});

const cardSwapVariants = {
  enter: (dir: 1 | -1) => ({
    x: dir > 0 ? 110 : -110,
    y: 8,
    rotate: dir > 0 ? 7 : -7,
    scale: 0.94,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring" as const, stiffness: 180, damping: 24 },
      y: { type: "spring" as const, stiffness: 180, damping: 24 },
      rotate: { type: "spring" as const, stiffness: 160, damping: 20 },
      scale: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
      opacity: { duration: 0.22 },
      filter: { duration: 0.22 },
    },
  },
  exit: (dir: 1 | -1) => ({
    x: dir > 0 ? -150 : 150,
    y: -6,
    rotate: dir > 0 ? -9 : 9,
    scale: 0.9,
    opacity: 0,
    filter: "blur(8px)",
    transition: {
      duration: 0.28,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

const labelVariants = {
  enter: (dir: 1 | -1) => ({
    x: dir > 0 ? 34 : -34,
    opacity: 0,
    rotate: dir > 0 ? 2 : -2,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 22,
      mass: 0.8,
    },
  },
  exit: (dir: 1 | -1) => ({
    x: dir > 0 ? -34 : 34,
    opacity: 0,
    rotate: dir > 0 ? -2 : 2,
    transition: { duration: 0.2 },
  }),
};

const R = 5.33;
const LABEL_MARGIN = 16;
const THUMBS_PER_PAGE = 6;

const VIDEO_ICONS = {
  play: "/video-icons/play.svg",
  pause: "/video-icons/pause.svg",
  sound: "/video-icons/sound.svg",
  mute: "/video-icons/mute.svg",
  close: "/video-icons/close.svg",
  prev: "/video-icons/prev.svg",
  next: "/video-icons/next.svg",
};

/**
 * Asset paths per category. Drop files into:
 *   public/projects/<category>/<n>.jpg   → poster / gallery image
 *   public/projects/<category>/<n>.mp4   → video (video & vertical categories only)
 * Categories: long-form | shorts | event | social | thumbnails | branding
 */
const POSTER = (cat: string, n: number) => `/projects/${cat}/${n}.jpg`;
const VIDEO = (cat: string, n: number) => `/projects/${cat}/${n}.mp4`;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function fmtTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ThumbImage({
  src,
  alt = "",
  className = "",
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !!src && failedSrc === src;

  if (!src || failed) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          color: "rgba(255,255,255,0.92)",
          fontSize: "clamp(16px,2vw,28px)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textAlign: "center",
          padding: "24px",
        }}
      >
        {alt || "IMAGE NOT AVAILABLE"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setFailedSrc(src)}
      className={className}
    />
  );
}

function IconImg({
  src,
  alt,
  size = 20,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}

export default function SelectedProjects() {
  const categories: Category[] = useMemo(
    () => [
      {
        id: "longform",
        label: "LONG-FORM / VIDEOS",
        name: "Long-Form Videos",
        Icon: Clapperboard,
        kind: "video",
        accent: "#FF1E1E",
        emoji: "🎬",
        subtitle: "[ LONG-FORM VIDEOS ]",
        blurb: [
          "Full YouTube edits for creators, lifestyle, and gaming — shaped around pacing, retention, and clear storytelling.",
          "From raw footage to a final export tuned for the platform, every cut is built to keep viewers watching.",
        ],
        items: [
          { id: "lf1", title: "CLIQUE / TEAM VIDEO", poster: POSTER("long-form", 1), video: VIDEO("long-form", 1) },
          { id: "lf2", title: "FC TOURNAMENT / PROMO", poster: POSTER("long-form", 2), video: VIDEO("long-form", 2) },
          { id: "lf3", title: "GAMAX / FEMALE TEAM", poster: POSTER("long-form", 3), video: VIDEO("long-form", 3) },
          { id: "lf4", title: "TSE / ANNOUNCEMENT", poster: POSTER("long-form", 4), video: VIDEO("long-form", 4) },
          { id: "lf5", title: "ALFILKAWY / AL QAQAA", poster: POSTER("long-form", 5), video: VIDEO("long-form", 5) },
        ],
      },
      {
        id: "shorts",
        label: "SHORTS / REELS",
        name: "Shorts / Reels",
        Icon: Smartphone,
        kind: "vertical",
        accent: "#00D27A",
        emoji: "⚡",
        subtitle: "[ SHORTS & REELS ]",
        blurb: [
          "Short-form vertical edits for Reels, Shorts, and TikTok — fast hooks, punchy captions, and snappy sound design.",
          "Built for the first three seconds, so the scroll stops and the replay starts.",
        ],
        items: [
          { id: "sh1", title: "NASR ESPORTS / VALORANT", poster: POSTER("shorts", 1), video: VIDEO("shorts", 1) },
          { id: "sh2", title: "THE BASE / EVENT", poster: POSTER("shorts", 2), video: VIDEO("shorts", 2) },
          { id: "sh3", title: "REEDY / SPORTING CLUB", poster: POSTER("shorts", 3), video: VIDEO("shorts", 3) },
          { id: "sh4", title: "THE BASE / ABOADAM", poster: POSTER("shorts", 4), video: VIDEO("shorts", 4) },
          { id: "sh5", title: "SHORTS / PAJILL", poster: POSTER("shorts", 5), video: VIDEO("shorts", 5) },
          { id: "sh6", title: "THE BASE / MAGIC SHOW", poster: POSTER("shorts", 6), video: VIDEO("shorts", 6) },
        ],
      },
      {
        id: "event",
        label: "EVENT / CONTENT",
        name: "Event Content",
        Icon: Mic,
        kind: "video",
        accent: "#F3D000",
        emoji: "🎤",
        subtitle: "[ EVENT CONTENT ]",
        blurb: [
          "Hype promo edits, live screen visuals, and recap videos that relive the moment.",
          "Plus sponsor and partner visuals that keep the whole production looking sharp and on-brand.",
        ],
        items: [
          { id: "ev1", title: "FC TOURNAMENT / STAGE SCREEN", poster: POSTER("event", 1), video: VIDEO("event", 1) },
          { id: "ev2", title: "FC TOURNAMENT / MOTION", poster: POSTER("event", 2), video: VIDEO("event", 2) },
          { id: "ev3", title: "GAMAX / EWC EVENT", poster: POSTER("event", 3), video: VIDEO("event", 3) },
          { id: "ev4", title: "FC TOURNAMENT / SCREEN ANIM", poster: POSTER("event", 4), video: VIDEO("event", 4) },
        ],
      },
      {
        id: "social",
        label: "SOCIAL / MEDIA",
        name: "Social Media",
        Icon: MessageCircle,
        kind: "gallery",
        accent: "#4186FF",
        emoji: "💬",
        subtitle: "[ SOCIAL MEDIA ]",
        blurb: [
          "Feed posts, story sets, and reel covers designed to keep a profile consistent, recognizable, and scroll-stopping.",
          "Built as a system, so every placement looks like it belongs to the same brand.",
        ],
        galleryRatio: "4 / 5",
        items: [
          { id: "so1", title: "CLIQUE / VCT EMEA", poster: POSTER("social", 1) },
          { id: "so2", title: "GAMAX / EWC POST", poster: POSTER("social", 2) },
          { id: "so3", title: "THE BASE / NEJM", poster: POSTER("social", 3) },
          { id: "so4", title: "CLIQUE / UPCOMING EVENTS", poster: POSTER("social", 4) },
          { id: "so5", title: "SANGOVI / WE'RE BACK", poster: POSTER("social", 5) },
          { id: "so6", title: "REEDY / POST", poster: POSTER("social", 6) },
        ],
      },
      {
        id: "thumbnails",
        label: "THUMBNAIL / DESIGNS",
        name: "Thumbnails",
        Icon: ImageIcon,
        kind: "gallery",
        accent: "#FF7A1A",
        emoji: "🖼️",
        subtitle: "[ THUMBNAILS ]",
        blurb: [
          "Scroll-stopping YouTube thumbnails engineered for contrast, clarity, and curiosity — the difference between a click and a skip.",
          "Each design is tested for readability at every size, from desktop to the smallest mobile feed.",
        ],
        galleryRatio: "16 / 9",
        items: [
          { id: "th1", title: "SANGOVI / THUMBNAIL", poster: POSTER("thumbnails", 1) },
          { id: "th2", title: "ALFILKAWY / MAD LOVER", poster: POSTER("thumbnails", 2) },
          { id: "th3", title: "ALFILKAWY / AL QAQAA", poster: POSTER("thumbnails", 3) },
          { id: "th4", title: "SANGOVI / THUMBNAIL 02", poster: POSTER("thumbnails", 4) },
          { id: "th5", title: "ALFILKAWY / INMATES", poster: POSTER("thumbnails", 5) },
        ],
      },
      {
        id: "branding",
        label: "BRANDING / & DESIGN",
        name: "Branding & Design",
        Icon: Sparkles,
        kind: "gallery",
        accent: "#A855F7",
        emoji: "✨",
        subtitle: "[ BRANDING & DESIGN ]",
        blurb: [
          "Logos, color and typography systems, and brand direction that make a presence feel professional and consistent.",
          "Delivered with ready-to-use assets and guidelines, so the brand stays sharp across every platform.",
        ],
        galleryRatio: "4 / 3",
        items: [
          { id: "br1", title: "CLIQUE / APEX LEGENDS", poster: POSTER("branding", 1) },
          { id: "br2", title: "SANGOVI / IDENTITY", poster: POSTER("branding", 2) },
          { id: "br3", title: "GAMAX / LOGO & BANNER", poster: POSTER("branding", 3) },
          { id: "br4", title: "TSE / DESIGN", poster: POSTER("branding", 4) },
          { id: "br5", title: "CLIQUE / CHAMPION", poster: POSTER("branding", 5) },
          { id: "br6", title: "LOVERS ROCK / DESIGN", poster: POSTER("branding", 6) },
        ],
      },
    ],
    []
  );

  const [catIndex, setCatIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideoUi, setShowVideoUi] = useState(true);
  const [thumbPage, setThumbPage] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  const activeCat = categories[catIndex];
  const items = activeCat.items;
  const activeItem = items[itemIndex];
  const activePoster = activeItem.poster;
  const isGallery = activeCat.kind === "gallery";
  const isVertical = activeCat.kind === "vertical";

  const totalThumbPages = Math.max(1, Math.ceil(items.length / THUMBS_PER_PAGE));
  const currentThumbPage = clamp(thumbPage, 0, totalThumbPages - 1);
  const visibleThumbs = items.slice(
    currentThumbPage * THUMBS_PER_PAGE,
    currentThumbPage * THUMBS_PER_PAGE + THUMBS_PER_PAGE
  );
  const canGoThumbPrev = currentThumbPage > 0;
  const canGoThumbNext = currentThumbPage < totalThumbPages - 1;

  const goThumbPage = useCallback(
    (dir: 1 | -1) => {
      setThumbPage((p) => clamp(p + dir, 0, totalThumbPages - 1));
    },
    [totalThumbPages]
  );

  /** navigate items WITHIN the active category */
  const go = useCallback(
    (nextDir: 1 | -1) => {
      setDirection(nextDir);
      setItemIndex((i) => {
        const n = items.length;
        const nextIndex = (i + nextDir + n) % n;
        setThumbPage(Math.floor(nextIndex / THUMBS_PER_PAGE));
        return nextIndex;
      });
    },
    [items.length]
  );

  const goToItem = useCallback(
    (nextIndex: number) => {
      if (nextIndex === itemIndex) return;
      setDirection(nextIndex > itemIndex ? 1 : -1);
      setThumbPage(Math.floor(nextIndex / THUMBS_PER_PAGE));
      setItemIndex(nextIndex);
    },
    [itemIndex]
  );

  /** switch to a whole category */
  const selectCategory = useCallback(
    (nextCat: number, dir?: 1 | -1) => {
      setDirection(dir ?? (nextCat > catIndex ? 1 : -1));
      setCatIndex(nextCat);
      setItemIndex(0);
      setThumbPage(0);
    },
    [catIndex]
  );

  const prevCategory = useCallback(() => {
    const n = categories.length;
    selectCategory((catIndex - 1 + n) % n, -1);
  }, [catIndex, categories.length, selectCategory]);

  const nextCategory = useCallback(() => {
    const n = categories.length;
    selectCategory((catIndex + 1) % n, 1);
  }, [catIndex, categories.length, selectCategory]);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const startXRef = useRef<number | null>(null);
  const lastXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const lastYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const onCardPointerDown = (e: React.PointerEvent) => {
    if (isFullscreen) return;

    draggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onCardPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || isFullscreen) return;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
  };

  const resetPointer = () => {
    draggingRef.current = false;
    startXRef.current = null;
    lastXRef.current = null;
    startYRef.current = null;
    lastYRef.current = null;
  };

  const onCardPointerUp = () => {
    if (!draggingRef.current || isFullscreen) return;

    const startX = startXRef.current;
    const lastX = lastXRef.current;
    const startY = startYRef.current;
    const lastY = lastYRef.current;
    resetPointer();

    if (startX == null || lastX == null || startY == null || lastY == null) return;

    const dx = lastX - startX;
    const dy = lastY - startY;

    // horizontal drag → swipe to next / prev project
    if (Math.abs(dx) >= 70) {
      go(dx < 0 ? 1 : -1);
      return;
    }

    // a tap / click anywhere on the card (no real movement) → open the project
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      setIsFullscreen(true);
    }
  };

  const onCardPointerCancel = () => {
    resetPointer();
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const rafRef = useRef<number | null>(null);

  const stopRAF = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const tick = useCallback(function updateTime() {
    const v = videoRef.current;
    if (!v) return;
    setT(v.currentTime || 0);
    rafRef.current = requestAnimationFrame(updateTime);
  }, []);

  const startRAF = useCallback(() => {
    stopRAF();
    rafRef.current = requestAnimationFrame(tick);
  }, [stopRAF, tick]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    setMuted(next);
    v.muted = next;
  };

  const seekTo = (next: number) => {
    const v = videoRef.current;
    if (!v) return;
    const to = clamp(next, 0, dur || 0);
    v.currentTime = to;
    setT(to);
  };

  useEffect(() => {
    if (!isFullscreen || isGallery) {
      stopRAF();
      const resetTimer = window.setTimeout(() => {
        setIsPlaying(false);
        setT(0);
        setDur(0);
      }, 0);

      return () => window.clearTimeout(resetTimer);
    }

    const showTimer = window.setTimeout(() => setShowVideoUi(true), 0);
    const v = videoRef.current;
    if (!v) {
      return () => window.clearTimeout(showTimer);
    }

    const onLoaded = () => setDur(v.duration || 0);
    const onPlay = () => {
      setIsPlaying(true);
      startRAF();
    };
    const onPause = () => {
      setIsPlaying(false);
      stopRAF();
    };
    const onEnded = () => {
      setIsPlaying(false);
      stopRAF();
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    v.muted = muted;
    v.currentTime = 0;
    v.play().catch(() => {});

    return () => {
      window.clearTimeout(showTimer);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      stopRAF();
    };
  }, [isFullscreen, isGallery, activeItem.id, muted, startRAF, stopRAF]);

  const uiHideTimer = useRef<number | null>(null);

  const pokeVideoUi = useCallback(() => {
    if (isMobileView || isGallery) return;
    setShowVideoUi(true);
    if (uiHideTimer.current) {
      clearTimeout(uiHideTimer.current);
      uiHideTimer.current = null;
    }
    if (isPlaying) {
      uiHideTimer.current = window.setTimeout(() => setShowVideoUi(false), 1500);
    }
  }, [isMobileView, isGallery, isPlaying]);

  const hideVideoUiNow = useCallback(() => {
    if (uiHideTimer.current) {
      clearTimeout(uiHideTimer.current);
      uiHideTimer.current = null;
    }
    setShowVideoUi(false);
  }, []);

  // While playing, hide all UI 1.5s after the last activity (so only the video shows).
  // Paused → keep the controls visible.
  useEffect(() => {
    if (!isFullscreen || isMobileView || isGallery) return;
    pokeVideoUi();
    return () => {
      if (uiHideTimer.current) {
        clearTimeout(uiHideTimer.current);
        uiHideTimer.current = null;
      }
    };
  }, [isFullscreen, isMobileView, isGallery, pokeVideoUi]);

  const shouldShowDesktopUi = !isMobileView && showVideoUi;

  return (
    <section
      id="selected-projects"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#00FFB6" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero/Frame 30.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-30 w-full py-14 sm:py-20 lg:py-24">
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-8 lg:pl-[max(24px,calc((100vw-1240px)/2+24px))]">
          {/* LEFT */}
          <div
            className="
              relative z-20
              flex w-full flex-col items-center
              px-4 text-center text-[#151A43]
              sm:px-6
              lg:w-[440px] lg:shrink-0 lg:items-start lg:px-0 lg:text-left
            "
          >
            <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-x-[118px] -translate-y-1/2 lg:block">
              <img
                src="/hero/svg/plus.svg"
                alt=""
                draggable={false}
                className="h-[430px] w-auto select-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                aria-label="Previous project"
                onClick={() => go(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-white/25 backdrop-blur"
              >
                <FiChevronLeft className="text-[18px] text-[#151A43]" />
              </motion.button>

              <span className="text-[13px] font-bold tracking-[0.28em] text-[#151A43]">
                SWIPE
              </span>

              <motion.button
                type="button"
                aria-label="Next project"
                onClick={() => go(1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-white/25 backdrop-blur"
              >
                <FiChevronRight className="text-[18px] text-[#151A43]" />
              </motion.button>
            </div>

            <motion.h2
              className="mt-8 text-[clamp(40px,5vw,66px)] font-bold leading-[0.94] tracking-tight text-[#151A43]"
              initial={popIn(0.08).initial}
              animate={popIn(0.08).animate}
              transition={popIn(0.08).transition}
            >
              SELECTED
              <br />
              PROJECTS
            </motion.h2>

            <motion.p
              className="mt-5 max-w-[420px] text-[15px] leading-[1.7] text-[#151A43]/85 sm:text-[16px]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5, ease: "easeOut" }}
            >
              From long-form videos to social content and brand design, explore how
              we help creators and brands show up with impact.
            </motion.p>

            {/* category pills */}
            <div className="mt-7 flex w-full max-w-[420px] flex-wrap justify-center gap-2.5 lg:justify-start">
              {categories.map((c, i) => {
                const activePill = i === catIndex;
                const PillIcon = c.Icon;

                return (
                  <motion.button
                    key={c.id}
                    type="button"
                    aria-label={`Show ${c.name}`}
                    aria-pressed={activePill}
                    onClick={() => selectCategory(i)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.22 + i * 0.05,
                      type: "spring",
                      stiffness: 220,
                      damping: 18,
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-bold tracking-tight transition-colors duration-300 sm:text-[13px]"
                    style={{
                      border: `1.5px solid ${
                        activePill ? "#151A43" : "rgba(21,26,67,0.26)"
                      }`,
                      color: activePill ? "#FFFFFF" : "#151A43",
                    }}
                  >
                    {activePill && (
                      <motion.span
                        layoutId="catPillBg"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-[#151A43]"
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-2">
                      <PillIcon
                        size={15}
                        strokeWidth={2.4}
                        style={{ color: activePill ? c.accent : "#151A43" }}
                      />
                      {c.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* per-category project dots */}
            <div className="mt-7 flex w-full max-w-[300px] items-center justify-center gap-[6px] lg:justify-start">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  aria-label={`Go to ${it.title}`}
                  onClick={() => goToItem(i)}
                  className={[
                    "h-[5px] cursor-pointer rounded-full transition-all duration-300",
                    i === itemIndex ? "w-[44px]" : "w-[18px]",
                  ].join(" ")}
                  style={{
                    backgroundColor:
                      i === itemIndex ? activeCat.accent : "rgba(21,26,67,0.25)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative z-10 min-w-0 flex-1">
            <div className="relative flex justify-end">
              <div
                className="relative aspect-[1.2/0.78] w-full max-w-[980px]"
                style={{ marginRight: "clamp(-120px,-7vw,-28px)" }}
              >
                <div
                  className="relative h-full w-full"
                  style={{
                    transform: "rotate(-2.3deg)",
                    transformOrigin: "72% 50%",
                  }}
                >
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0"
                    animate={{
                      x: direction > 0 ? 42 : 36,
                      y: direction > 0 ? 34 : 30,
                      rotate: direction > 0 ? -0.4 : 0.4,
                    }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background: "#08A678",
                      borderRadius: R,
                      clipPath: "polygon(0 0, 92% 0, 100% 22%, 100% 100%, 0 100%)",
                    }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0"
                    animate={{
                      x: direction > 0 ? 26 : 22,
                      y: direction > 0 ? 22 : 18,
                      rotate: direction > 0 ? -0.25 : 0.25,
                    }}
                    transition={{
                      duration: 0.24,
                      delay: 0.03,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      background: "#1FC393",
                      borderRadius: R,
                      clipPath: "polygon(0 0, 92% 0, 100% 22%, 100% 100%, 0 100%)",
                    }}
                  />

                  <div
                    className="pointer-events-none absolute left-0 top-0"
                    style={{
                      zIndex: 50,
                      transform: "translate(-42%, -46%)",
                    }}
                  >
                    <img
                      src="/hero/bar2.svg"
                      alt=""
                      draggable={false}
                      style={{
                        width: 118,
                        height: 118,
                      }}
                    />
                  </div>

                  <div
                    className="relative h-full w-full overflow-hidden"
                    style={{
                      borderRadius: R,
                      clipPath: "polygon(0 0, 92% 0, 100% 22%, 100% 100%, 0 100%)",
                      boxShadow:
                        "0 34px 70px rgba(0,0,0,0.22), 0 18px 36px rgba(0,0,0,0.14)",
                      cursor: "grab",
                      touchAction: "pan-y",
                      background: "transparent",
                    }}
                    onPointerDown={onCardPointerDown}
                    onPointerMove={onCardPointerMove}
                    onPointerUp={onCardPointerUp}
                    onPointerCancel={onCardPointerCancel}
                  >
                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                      <motion.div
                        key={activeItem.id}
                        custom={direction}
                        variants={cardSwapVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0"
                        style={{
                          transformOrigin: direction > 0 ? "85% 50%" : "15% 50%",
                        }}
                      >
                        <ThumbImage
                          src={activePoster}
                          alt={activeItem.title}
                          className="absolute inset-0 h-full w-full object-cover select-none"
                        />

                        <div
                          aria-hidden="true"
                          className="absolute inset-0"
                          style={{
                            background: activePoster
                              ? "linear-gradient(180deg, rgba(6,12,18,0.10) 0%, rgba(6,12,18,0.18) 24%, rgba(6,12,18,0.36) 58%, rgba(6,12,18,0.72) 100%)"
                              : "transparent",
                          }}
                        />

                        {/* playful category badge (top-left) */}
                        <motion.div
                          className="pointer-events-none absolute left-[78px] top-[26px] z-[55] flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-extrabold tracking-[0.08em] backdrop-blur sm:left-[96px]"
                          style={{
                            backgroundColor: `${activeCat.accent}EE`,
                            color: "#0B0F2A",
                            boxShadow: `0 8px 22px ${activeCat.accent}66`,
                          }}
                          initial={{ opacity: 0, y: -8, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.12, type: "spring", stiffness: 200, damping: 16 }}
                        >
                          <span aria-hidden="true">{activeCat.emoji}</span>
                          {activeCat.label.split("/")[0]?.trim()}
                        </motion.div>

                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute left-1/2 top-1/2 z-[60] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
                        >
                          <motion.img
                            src="/playicon.svg"
                            alt=""
                            draggable={false}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                            style={{ width: 96, height: 96 }}
                          />
                          <motion.span
                            className="rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.22em]"
                            style={{ backgroundColor: "#ffffff", color: activeCat.accent }}
                            animate={{ opacity: [0.75, 1, 0.75] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            {isGallery ? "EXPLORE" : "WATCH"}
                          </motion.span>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <div
                      className="pointer-events-none absolute"
                      style={{
                        left: LABEL_MARGIN,
                        right: LABEL_MARGIN,
                        bottom: 20,
                        height: 68,
                      }}
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          transform: "translateY(10px)",
                          background: "rgba(48,35,12,0.7)",
                          borderRadius: R,
                        }}
                      />

                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ borderRadius: R }}
                      >
                        <AnimatePresence mode="wait" custom={direction} initial={false}>
                          <motion.div
                            key={activeItem.id + "-label"}
                            custom={direction}
                            variants={labelVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 flex items-center justify-center bg-[#F6F6F6]"
                            style={{
                              fontFamily: "var(--font-godber)",
                              fontWeight: 400,
                              fontSize: "clamp(18px,2.2vw,36px)",
                              color: activeCat.accent,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              padding: "0 16px",
                            }}
                          >
                            {activeItem.title}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="absolute inset-0 z-[200] overflow-hidden"
            style={{
              "--cat": activeCat.accent,
              "--catSoft": `${activeCat.accent}33`,
              "--catGlow": `${activeCat.accent}55`,
            } as React.CSSProperties}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={pokeVideoUi}
            onMouseLeave={() => {
              if (!isMobileView && !isGallery) hideVideoUiNow();
            }}
            onMouseMove={pokeVideoUi}
          >
            {isGallery ? (
              <GalleryFullscreen
                category={activeCat}
                categories={categories}
                catIndex={catIndex}
                isMobile={isMobileView}
                onClose={() => setIsFullscreen(false)}
                onPrevCat={prevCategory}
                onNextCat={nextCategory}
                onSelectCategory={(i) => selectCategory(i)}
              />
            ) : isMobileView ? (
              <>
                <div className="absolute inset-0 bg-[#06111B]" />

                <div className="absolute left-4 right-4 top-4 z-[240] pr-14 text-white">
                  <div
                    className="text-[10px] font-semibold tracking-[0.16em]"
                    style={{ color: activeCat.accent }}
                  >
                    {activeCat.subtitle}
                  </div>

                  <div className="mt-3 font-extrabold leading-[0.95] tracking-tight">
                    <div className="text-[20px]">
                      {activeItem.title.split("/")[0]?.trim()}
                    </div>
                    <div className="text-[20px]">
                      / {activeItem.title.split("/")[1]?.trim()}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setIsFullscreen(false)}
                  className="absolute right-4 top-4 z-[250] grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full bg-black/26 backdrop-blur-sm transition-colors hover:bg-[var(--catSoft)]"
                >
                  <IconImg src={VIDEO_ICONS.close} alt="Close" size={14} />
                </button>

                <div className="absolute left-0 right-0 top-[128px] z-[220] px-3">
                  <div
                    className={[
                      "relative mx-auto w-full overflow-hidden border border-white/10 bg-black shadow-[0_20px_40px_rgba(0,0,0,0.34)]",
                      isVertical
                        ? "aspect-[9/16] max-w-[248px] rounded-[22px]"
                        : "aspect-[16/9] rounded-[18px]",
                    ].join(" ")}
                  >
                    <video
                      ref={videoRef}
                      src={activeItem.video}
                      poster={activePoster}
                      className="absolute inset-0 h-full w-full object-cover"
                      playsInline
                      muted={muted}
                      controls={false}
                      preload="metadata"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.20) 100%)",
                      }}
                    />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-[240]">
                  <div
                    className="rounded-t-[24px] border-t border-white/10 bg-[#08111B] px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-4"
                    style={{
                      boxShadow: "0 -14px 32px rgba(0,0,0,0.32)",
                    }}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="grid h-[46px] w-[46px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/12 transition-colors hover:bg-[var(--catSoft)]"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        <IconImg
                          src={isPlaying ? VIDEO_ICONS.pause : VIDEO_ICONS.play}
                          alt={isPlaying ? "Pause" : "Play"}
                          size={18}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="grid h-[46px] w-[46px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/12 transition-colors hover:bg-[var(--catSoft)]"
                        aria-label={muted ? "Unmute" : "Mute"}
                      >
                        <IconImg
                          src={muted ? VIDEO_ICONS.mute : VIDEO_ICONS.sound}
                          alt={muted ? "Muted" : "Sound"}
                          size={18}
                        />
                      </button>

                      <div className="w-[48px] shrink-0 text-[14px] font-semibold tracking-tight text-white/95">
                        {fmtTime(t)}
                      </div>

                      <div className="relative flex-1">
                        <div className="relative h-[5px] rounded-full bg-white/20">
                          <div
                            className="absolute left-0 top-0 h-[5px] rounded-full"
                            style={{
                              width: `${dur > 0 ? (t / dur) * 100 : 0}%`,
                              backgroundColor: activeCat.accent,
                            }}
                          />
                          <input
                            type="range"
                            min={0}
                            max={dur || 0}
                            step={0.1}
                            value={t}
                            onChange={(e) => seekTo(Number(e.target.value))}
                            className="absolute inset-0 w-full cursor-pointer opacity-0"
                            aria-label="Seek"
                          />
                          <div
                            className="absolute top-1/2 h-[16px] w-[16px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.13)]"
                            style={{
                              left: `calc(${dur > 0 ? (t / dur) * 100 : 0}% - 8px)`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-[48px] shrink-0 text-right text-[14px] font-semibold tracking-tight text-white/95">
                        {fmtTime(dur)}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        className="grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 transition-colors hover:bg-[var(--catSoft)]"
                        aria-label="Previous project"
                      >
                        <IconImg src={VIDEO_ICONS.prev} alt="Previous" size={16} />
                      </button>

                      <div
                        className="flex min-w-0 flex-1 gap-3 overflow-x-auto overflow-y-hidden pb-1"
                        style={{
                          scrollSnapType: "x mandatory",
                          WebkitOverflowScrolling: "touch",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {items.map((it, i) => {
                          const thumbSrc = it.poster || activePoster;
                          const activeThumb = i === itemIndex;

                          return (
                            <button
                              key={it.id}
                              type="button"
                              onClick={() => goToItem(i)}
                              aria-label={`Open ${it.title}`}
                              className="relative shrink-0 cursor-pointer overflow-hidden rounded-[8px] transition-all duration-300"
                              style={{
                                width: activeThumb ? 130 : 100,
                                height: activeThumb ? 80 : 70,
                                scrollSnapAlign: "center",
                                opacity: activeThumb ? 1 : 0.86,
                                transform: activeThumb ? "translateY(-2px)" : "translateY(0px)",
                                border: activeThumb
                                  ? `1px solid ${activeCat.accent}`
                                  : "1px solid rgba(255,255,255,0.10)",
                                boxShadow: activeThumb
                                  ? `0 0 0 2px ${activeCat.accent}, 0 0 0 5px ${activeCat.accent}24, 0 12px 28px ${activeCat.accent}2e`
                                  : "0 8px 18px rgba(0,0,0,0.22)",
                              }}
                            >
                              <ThumbImage
                                src={thumbSrc}
                                alt={it.title}
                                className="absolute inset-0 h-full w-full object-cover"
                              />

                              <div
                                className="absolute inset-0"
                                style={{
                                  background: activeThumb
                                    ? `linear-gradient(180deg, ${activeCat.accent}10 0%, ${activeCat.accent}2e 100%)`
                                    : "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.30) 100%)",
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => go(1)}
                        className="grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 transition-colors hover:bg-[var(--catSoft)]"
                        aria-label="Next project"
                      >
                        <IconImg src={VIDEO_ICONS.next} alt="Next" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {isVertical && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url('${activePoster}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(46px) brightness(0.42)",
                      transform: "scale(1.16)",
                    }}
                  />
                )}

                {isVertical ? (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative aspect-[9/16] h-[min(86vh,860px)] max-w-[94vw] overflow-hidden rounded-[26px] border border-white/12 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                      <video
                        ref={videoRef}
                        src={activeItem.video}
                        poster={activePoster}
                        className="absolute inset-0 h-full w-full object-cover"
                        playsInline
                        muted={muted}
                        controls={false}
                        preload="metadata"
                      />
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={activeItem.video}
                    poster={activePoster}
                    className="absolute inset-0 h-full w-full object-cover"
                    playsInline
                    muted={muted}
                    controls={false}
                    preload="metadata"
                  />
                )}

                <AnimatePresence>
                  {shouldShowDesktopUi && (
                    <>
                      <motion.div
                        aria-hidden="true"
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          background:
                            "radial-gradient(1000px 720px at 16% 26%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 18%, rgba(0,0,0,0) 56%)," +
                            "linear-gradient(90deg, rgba(5,10,16,0.72) 0%, rgba(5,10,16,0.48) 26%, rgba(5,10,16,0.24) 48%, rgba(5,10,16,0.10) 66%, rgba(5,10,16,0.03) 100%)," +
                            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.12) 36%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0.34) 100%)",
                        }}
                      />

                      <motion.button
                        type="button"
                        aria-label="Close"
                        onClick={() => setIsFullscreen(false)}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-7 top-7 z-[240] grid h-[40px] w-[40px] cursor-pointer place-items-center rounded-full bg-black/22 backdrop-blur-sm transition-colors hover:bg-[var(--catSoft)]"
                      >
                        <IconImg src={VIDEO_ICONS.close} alt="Close" size={13} />
                      </motion.button>

                      <motion.div
                        className="absolute left-[34px] top-[28px] z-[220] max-w-[560px] text-white sm:left-[42px] sm:top-[34px] lg:left-[54px] lg:top-[38px]"
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ duration: 0.22 }}
                      >
                        <div
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.14em] sm:text-[12px]"
                          style={{ backgroundColor: activeCat.accent, color: "#0B0F2A" }}
                        >
                          <span aria-hidden="true">{activeCat.emoji}</span>
                          {activeCat.subtitle}
                        </div>

                        <div className="mt-4 font-extrabold leading-[0.95] tracking-tight">
                          <div className="text-[24px] sm:text-[30px] lg:text-[36px]">
                            {activeItem.title.split("/")[0]?.trim()}
                          </div>
                          <div className="text-[24px] sm:text-[30px] lg:text-[36px]">
                            / {activeItem.title.split("/")[1]?.trim()}
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="absolute bottom-[128px] left-1/2 z-[235] flex w-[min(76vw,1180px)] -translate-x-1/2 items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 18 }}
                        transition={{ duration: 0.22 }}
                      >
                        <button
                          type="button"
                          onClick={() => goThumbPage(-1)}
                          disabled={!canGoThumbPrev}
                          className={[
                            "grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full backdrop-blur-sm transition",
                            canGoThumbPrev
                              ? "cursor-pointer bg-white/12 hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)]"
                              : "cursor-not-allowed bg-white/6 opacity-35",
                          ].join(" ")}
                          aria-label="Previous projects"
                        >
                          <IconImg src={VIDEO_ICONS.prev} alt="Previous" size={22} />
                        </button>

                        <div className="flex min-w-0 flex-1 items-center justify-center gap-4 overflow-hidden">
                          {visibleThumbs.map((it) => {
                            const itIndex = items.findIndex((x) => x.id === it.id);
                            const thumbSrc = it.poster || activePoster;
                            const activeThumb = itIndex === itemIndex;

                            return (
                              <button
                                key={it.id}
                                type="button"
                                onClick={() => goToItem(itIndex)}
                                aria-label={`Open ${it.title}`}
                                className="relative h-[96px] w-[158px] shrink-0 cursor-pointer overflow-hidden rounded-[6px] transition-all duration-300 hover:scale-[1.05]"
                                style={{
                                  opacity: activeThumb ? 1 : 0.92,
                                  transform: activeThumb ? "scale(1.035)" : "scale(1)",
                                  boxShadow: activeThumb
                                    ? `0 0 0 2px ${activeCat.accent}, 0 0 0 6px ${activeCat.accent}2e, 0 16px 42px ${activeCat.accent}33, 0 18px 36px rgba(0,0,0,0.30)`
                                    : "0 8px 24px rgba(0,0,0,0.20)",
                                  border: activeThumb
                                    ? `1px solid ${activeCat.accent}`
                                    : "1px solid rgba(255,255,255,0.12)",
                                }}
                              >
                                <ThumbImage
                                  src={thumbSrc}
                                  alt={it.title}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />

                                <div
                                  className="absolute inset-0"
                                  style={{
                                    background: activeThumb
                                      ? `linear-gradient(180deg, ${activeCat.accent}10 0%, ${activeCat.accent}1f 100%)`
                                      : "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 100%)",
                                  }}
                                />

                                {activeThumb && (
                                  <div
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                    style={{
                                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
                                    }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => goThumbPage(1)}
                          disabled={!canGoThumbNext}
                          className={[
                            "grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full backdrop-blur-sm transition",
                            canGoThumbNext
                              ? "cursor-pointer bg-white/12 hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)]"
                              : "cursor-not-allowed bg-white/6 opacity-35",
                          ].join(" ")}
                          aria-label="Next projects"
                        >
                          <IconImg src={VIDEO_ICONS.next} alt="Next" size={22} />
                        </button>
                      </motion.div>

                      <motion.div
                        className="absolute bottom-[34px] left-[34px] right-[34px] z-[240] sm:left-[42px] sm:right-[42px] lg:left-[54px] lg:right-[54px]"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 18 }}
                        transition={{ duration: 0.22 }}
                      >
                        <div className="flex items-center gap-4 text-white">
                          <button
                            type="button"
                            onClick={togglePlay}
                            className="grid h-[56px] w-[56px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/12 backdrop-blur-sm transition hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)]"
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            <IconImg
                              src={isPlaying ? VIDEO_ICONS.pause : VIDEO_ICONS.play}
                              alt={isPlaying ? "Pause" : "Play"}
                              size={22}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={toggleMute}
                            className="grid h-[56px] w-[56px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/12 backdrop-blur-sm transition hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)]"
                            aria-label={muted ? "Unmute" : "Mute"}
                          >
                            <IconImg
                              src={muted ? VIDEO_ICONS.mute : VIDEO_ICONS.sound}
                              alt={muted ? "Muted" : "Sound"}
                              size={22}
                            />
                          </button>

                          <div className="w-[72px] shrink-0 text-[28px] font-medium tracking-tight text-white/96">
                            {fmtTime(t)}
                          </div>

                          <div className="relative flex-1">
                            <div className="relative h-[6px] rounded-full bg-white/20">
                              <div
                                className="absolute left-0 top-0 h-[6px] rounded-full"
                                style={{
                                  width: `${dur > 0 ? (t / dur) * 100 : 0}%`,
                                  backgroundColor: activeCat.accent,
                                }}
                              />
                              <input
                                type="range"
                                min={0}
                                max={dur || 0}
                                step={0.1}
                                value={t}
                                onChange={(e) => seekTo(Number(e.target.value))}
                                className="absolute inset-0 w-full cursor-pointer opacity-0"
                                aria-label="Seek"
                              />
                              <div
                                className="absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.15)]"
                                style={{
                                  left: `calc(${dur > 0 ? (t / dur) * 100 : 0}% - 9px)`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="w-[72px] shrink-0 text-right text-[28px] font-medium tracking-tight text-white/96">
                            {fmtTime(dur)}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* =========================
   Gallery Fullscreen (Thumbnails / Social / Branding)
   Shows the whole category's cards as a grid.
========================= */

function GalleryFullscreen({
  category,
  categories,
  catIndex,
  isMobile,
  onClose,
  onPrevCat,
  onNextCat,
  onSelectCategory,
}: {
  category: Category;
  categories: Category[];
  catIndex: number;
  isMobile: boolean;
  onClose: () => void;
  onPrevCat: () => void;
  onNextCat: () => void;
  onSelectCategory: (i: number) => void;
}) {
  const images = category.items;
  const ratio = category.galleryRatio ?? "16 / 9";
  const accent = category.accent;
  const total = images.length;

  const [lightbox, setLightbox] = useState<number | null>(null);
  const openPrev = () =>
    setLightbox((v) => (v === null ? v : (v - 1 + total) % total));
  const openNext = () =>
    setLightbox((v) => (v === null ? v : (v + 1) % total));
  const current = lightbox === null ? null : images[lightbox];

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#06111B]"
      style={{
        "--cat": accent,
        "--catSoft": `${accent}33`,
        "--catGlow": `${accent}55`,
      } as React.CSSProperties}
    >
      {/* playful accent glow blobs */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] top-[8%] h-[42vmin] w-[42vmin] rounded-full"
        style={{ background: `radial-gradient(circle, ${accent}30 0%, transparent 68%)` }}
        animate={{ x: [0, 26, 0], y: [0, -18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[8%] bottom-[6%] h-[38vmin] w-[38vmin] rounded-full"
        style={{ background: `radial-gradient(circle, ${accent}24 0%, transparent 70%)` }}
        animate={{ x: [0, -22, 0], y: [0, 16, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* header */}
      <div className="absolute left-4 right-4 top-4 z-[240] pr-14 text-white sm:left-[42px] sm:right-[42px] sm:top-[34px] lg:left-[54px] lg:top-[38px]">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.14em] sm:text-[12px]"
          style={{ backgroundColor: accent, color: "#0B0F2A" }}
        >
          <span aria-hidden="true">{category.emoji}</span>
          {category.subtitle}
        </div>

        <div className="mt-3 font-extrabold leading-[0.9] tracking-tight sm:mt-5">
          <span className="text-[30px] sm:text-[56px] lg:text-[68px]">
            {category.label.split("/")[0]?.trim()}{" "}
          </span>
          <span
            className="text-[30px] sm:text-[56px] lg:text-[68px]"
            style={{ color: accent }}
          >
            / {category.label.split("/")[1]?.trim()}
          </span>
        </div>

        <p className="mt-3 hidden max-w-[640px] text-[15px] leading-[1.5] text-white/75 sm:block">
          {category.blurb.join(" ")}
        </p>
      </div>

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 z-[250] grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full bg-black/26 backdrop-blur-sm transition-colors hover:bg-[var(--catSoft)] sm:right-7 sm:top-7"
      >
        <IconImg src={VIDEO_ICONS.close} alt="Close" size={14} />
      </button>

      {/* grid of cards */}
      <div
        className={[
          "absolute left-0 right-0 z-[220] overflow-y-auto px-4 sm:px-[42px] lg:px-[72px]",
          isMobile ? "top-[150px] bottom-[120px]" : "top-[240px] bottom-[120px]",
        ].join(" ")}
        style={{ scrollbarWidth: "none" }}
      >
        <div
          className="mx-auto grid w-full max-w-[1180px] gap-4 sm:gap-5"
          style={{
            gridTemplateColumns: isMobile
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(3, minmax(0, 1fr))",
          }}
        >
          {images.map((it, i) => (
            <motion.button
              key={it.id}
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`Preview ${it.title}`}
              initial={{ opacity: 0, y: 26, scale: 0.92, rotate: i % 2 === 0 ? -2 : 2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.06 * i,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              whileHover={{ y: -6, scale: 1.025 }}
              whileTap={{ scale: 0.99 }}
              className="group relative cursor-pointer overflow-hidden rounded-[12px] border border-white/10 bg-black/40 text-left"
              style={{
                aspectRatio: ratio,
                boxShadow: "0 16px 38px rgba(0,0,0,0.34)",
              }}
            >
              <ThumbImage
                src={it.poster}
                alt={it.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(180deg, transparent 40%, ${accent}26 100%)`,
                  boxShadow: `inset 0 0 0 2px ${accent}`,
                }}
              />
              <span
                className="absolute left-3 top-3 grid h-[26px] w-[26px] place-items-center rounded-full text-[12px] font-extrabold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundColor: accent, color: "#0B0F2A" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute bottom-3 left-3 right-3 truncate text-[12px] font-bold tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {it.title}
              </span>

              {/* hover "view" hint */}
              <span
                className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-[0.12em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundColor: accent, color: "#0B0F2A" }}
              >
                VIEW
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* bottom category nav */}
      <div className="absolute bottom-0 left-0 right-0 z-[240]">
        <div className="flex items-center justify-center gap-2 px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-4 sm:gap-3">
          <button
            type="button"
            onClick={onPrevCat}
            className="grid h-[44px] w-[44px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 backdrop-blur-sm transition hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)]"
            aria-label="Previous category"
          >
            <IconImg src={VIDEO_ICONS.prev} alt="Previous" size={18} />
          </button>

          <div
            className="flex max-w-[72vw] items-center gap-2 overflow-x-auto px-1"
            style={{ scrollbarWidth: "none" }}
          >
            {categories.map((c, i) => {
              const activeChip = i === catIndex;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectCategory(i)}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold tracking-[0.04em] transition-all duration-300 hover:-translate-y-[2px]"
                  style={{
                    backgroundColor: activeChip ? c.accent : "rgba(255,255,255,0.08)",
                    color: activeChip ? "#0B0F2A" : "rgba(255,255,255,0.78)",
                    boxShadow: activeChip ? `0 8px 22px ${c.accent}55` : "none",
                  }}
                >
                  <span aria-hidden="true">{c.emoji}</span>
                  <span className="whitespace-nowrap">{c.label.split("/")[0]?.trim()}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onNextCat}
            className="grid h-[44px] w-[44px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 backdrop-blur-sm transition hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)]"
            aria-label="Next category"
          >
            <IconImg src={VIDEO_ICONS.next} alt="Next" size={18} />
          </button>
        </div>
      </div>

      {/* per-design preview (lightbox) */}
      <AnimatePresence>
        {current && (
          <motion.div
            className="absolute inset-0 z-[300] flex items-center justify-center bg-black/90 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close preview"
              onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 z-[320] grid h-[44px] w-[44px] cursor-pointer place-items-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)]"
            >
              <IconImg src={VIDEO_ICONS.close} alt="Close" size={15} />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous design"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPrev();
                  }}
                  className="absolute left-3 top-1/2 z-[320] grid h-[48px] w-[48px] -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)] sm:left-6"
                >
                  <IconImg src={VIDEO_ICONS.prev} alt="Previous" size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next design"
                  onClick={(e) => {
                    e.stopPropagation();
                    openNext();
                  }}
                  className="absolute right-3 top-1/2 z-[320] grid h-[48px] w-[48px] -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-[var(--catSoft)] hover:shadow-[0_0_16px_var(--catGlow)] sm:right-6"
                >
                  <IconImg src={VIDEO_ICONS.next} alt="Next" size={20} />
                </button>
              </>
            )}

            <motion.div
              key={current.id}
              className="relative flex max-h-[88vh] w-full max-w-[1100px] flex-col items-center"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative overflow-hidden rounded-[14px]"
                style={{
                  border: `1px solid ${accent}`,
                  boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 4px ${accent}1f`,
                }}
              >
                <ThumbImage
                  src={current.poster}
                  alt={current.title}
                  className="block max-h-[74vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="mt-4 flex items-center gap-3 text-white">
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em]"
                  style={{ backgroundColor: accent, color: "#0B0F2A" }}
                >
                  {category.emoji} {String((lightbox ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
                <span className="text-[14px] font-bold tracking-wide sm:text-[16px]">
                  {current.title}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
