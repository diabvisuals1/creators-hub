"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Project = {
  id: string;
  label: string;
  video: string;
  subtitle?: string;
  paragraphs?: string[];
  poster: string;
  thumbs?: string[];
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
const THUMBS_PER_PAGE = 5;

const VIDEO_ICONS = {
  play: "/video-icons/play.svg",
  pause: "/video-icons/pause.svg",
  sound: "/video-icons/sound.svg",
  mute: "/video-icons/mute.svg",
  close: "/video-icons/close.svg",
  prev: "/video-icons/prev.svg",
  next: "/video-icons/next.svg",
};

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
  const projects: Project[] = useMemo(
    () => [
      {
        id: "p1",
        label: "KAI CENAT / NEW MERCH",
        video: "/projects/kai.mp4",
        subtitle: "[SELECTED PROJECTS]",
        paragraphs: [
          "In this collaboration, our design team spearheaded the creative development and technical execution for Kai Cenat’s signature apparel line.",
          "Our work focused on bridging the gap between high-energy creator culture and premium streetwear aesthetics.",
        ],
        poster: "/projects/thumbs/t1.jpg",
        thumbs: [
          "/projects/thumbs/t1.jpg",
          "/projects/thumbs/t2.jpg",
          "/projects/thumbs/t3.jpg",
          "/projects/thumbs/t4.jpg",
          "/projects/thumbs/t5.jpg",
          "/projects/thumbs/t6.jpg",
        ],
      },
      {
        id: "p2",
        label: "PROJECT TWO / PROMO",
        video: "/projects/p2.mp4",
        subtitle: "[SELECTED PROJECTS]",
        paragraphs: [
          "This project centered on building a sharper promotional narrative with fast visual hooks and a more direct conversion-focused edit structure.",
          "We combined polished pacing, thumbnail strategy, and platform-native motion cues to keep the campaign punchy and memorable.",
        ],
        poster: "/projects/thumbs/t2.jpg",
        thumbs: [
          "/projects/thumbs/t2.jpg",
          "/projects/thumbs/t1.jpg",
          "/projects/thumbs/t3.jpg",
          "/projects/thumbs/t4.jpg",
          "/projects/thumbs/t5.jpg",
          "/projects/thumbs/t6.jpg",
        ],
      },
      {
        id: "p3",
        label: "PROJECT THREE / CAMPAIGN",
        video: "/projects/p3.mp4",
        subtitle: "[SELECTED PROJECTS]",
        paragraphs: [
          "For this campaign, we refined the storytelling around a single hero concept and designed the visuals to feel more cinematic while staying performance-first.",
          "The final delivery balanced brand identity, speed, and clarity to support both reach and retention across social placements.",
        ],
        poster: "/projects/thumbs/t3.jpg",
        thumbs: [
          "/projects/thumbs/t3.jpg",
          "/projects/thumbs/t1.jpg",
          "/projects/thumbs/t2.jpg",
          "/projects/thumbs/t4.jpg",
          "/projects/thumbs/t5.jpg",
          "/projects/thumbs/t6.jpg",
        ],
      },
      {
        id: "p4",
        label: "PROJECT FOUR / EDIT",
        video: "/projects/p4.mp4",
        subtitle: "[SELECTED PROJECTS]",
        paragraphs: [
          "This edit leaned into tension, rhythm, and visual contrast to create a stronger emotional pull from the opening seconds.",
          "Our team focused on shot sequencing, motion emphasis, and sound-driven timing to give the piece a more premium finish.",
        ],
        poster: "/projects/thumbs/t4.jpg",
        thumbs: [
          "/projects/thumbs/t4.jpg",
          "/projects/thumbs/t1.jpg",
          "/projects/thumbs/t2.jpg",
          "/projects/thumbs/t3.jpg",
          "/projects/thumbs/t5.jpg",
          "/projects/thumbs/t6.jpg",
        ],
      },
      {
        id: "p5",
        label: "PROJECT FIVE / SHORT",
        video: "/projects/p5.mp4",
        subtitle: "[SELECTED PROJECTS]",
        paragraphs: [
          "This short-form piece was developed to maximize attention in the first seconds while keeping the edit compact, energetic, and highly shareable.",
          "We shaped the final cut around immediate visual payoff, stronger title readability, and a pacing system built for repeat views.",
        ],
        poster: "/projects/thumbs/t5.jpg",
        thumbs: [
          "/projects/thumbs/t5.jpg",
          "/projects/thumbs/t1.jpg",
          "/projects/thumbs/t2.jpg",
          "/projects/thumbs/t3.jpg",
          "/projects/thumbs/t4.jpg",
          "/projects/thumbs/t6.jpg",
        ],
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideoUi, setShowVideoUi] = useState(true);
  const [thumbPage, setThumbPage] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  const active = projects[index];
  const activePoster = active.poster;

  const totalThumbPages = Math.max(1, Math.ceil(projects.length / THUMBS_PER_PAGE));
  const currentThumbPage = clamp(thumbPage, 0, totalThumbPages - 1);
  const visibleThumbs = projects.slice(
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

  const go = useCallback(
    (nextDir: 1 | -1) => {
      setDirection(nextDir);
      setIndex((i) => {
        const n = projects.length;
        const nextIndex = (i + nextDir + n) % n;
        setThumbPage(Math.floor(nextIndex / THUMBS_PER_PAGE));
        return nextIndex;
      });
    },
    [projects.length]
  );

  const goToIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex === index) return;
      setDirection(nextIndex > index ? 1 : -1);
      setThumbPage(Math.floor(nextIndex / THUMBS_PER_PAGE));
      setIndex(nextIndex);
    },
    [index]
  );

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
  const draggingRef = useRef(false);

  const onCardPointerDown = (e: React.PointerEvent) => {
    if (isFullscreen) return;

    const t = e.target as HTMLElement | null;
    if (t?.closest?.("[data-play-btn]")) return;

    draggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onCardPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || isFullscreen) return;
    lastXRef.current = e.clientX;
  };

  const onCardPointerUp = () => {
    if (!draggingRef.current || isFullscreen) return;
    draggingRef.current = false;

    const startX = startXRef.current;
    const lastX = lastXRef.current;
    startXRef.current = null;
    lastXRef.current = null;

    if (startX == null || lastX == null) return;

    const dx = lastX - startX;
    if (Math.abs(dx) < 70) return;

    go(dx < 0 ? 1 : -1);
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
    if (!isFullscreen) {
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
  }, [isFullscreen, active.id, muted, startRAF, stopRAF]);

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
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-6">
          {/* LEFT */}
          <div
            className="
              relative z-20
              flex w-full flex-col items-center
              px-4 text-center text-[#151A43]
              sm:px-6
              lg:w-[390px] lg:shrink-0 lg:items-start lg:pl-[max(54px,calc((100vw-1152px)/2+54px))] lg:text-left
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

            <div className="mt-10 flex w-[280px] items-center justify-center gap-[6px] lg:justify-start">
              {projects.map((p, i) => (
                <span
                  key={p.id}
                  aria-hidden="true"
                  className={[
                    "h-[4px] rounded-full transition-all duration-300",
                    i === index ? "w-[86px] bg-[#151A43]" : "w-[38px] bg-[#151A43]/35",
                  ].join(" ")}
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
                    onPointerCancel={onCardPointerUp}
                  >
                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                      <motion.div
                        key={active.id}
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
                          alt={active.label}
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

                        <button
                          data-play-btn
                          type="button"
                          aria-label="Play video"
                          onPointerDownCapture={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFullscreen(true);
                          }}
                          className="absolute left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          style={{ width: 96, height: 96 }}
                        >
                          <motion.img
                            src="/playicon.svg"
                            alt=""
                            draggable={false}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.94 }}
                            style={{ width: 96, height: 96, cursor: "pointer" }}
                          />
                        </button>
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
                            key={active.id + "-label"}
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
                              color: "#FF1E1E",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              padding: "0 16px",
                            }}
                          >
                            {active.label}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={() => {
              if (!isMobileView) setShowVideoUi(true);
            }}
            onMouseLeave={() => {
              if (!isMobileView) setShowVideoUi(false);
            }}
            onMouseMove={() => {
              if (!isMobileView) setShowVideoUi(true);
            }}
          >
            {isMobileView ? (
              <>
                <div className="absolute inset-0 bg-[#06111B]" />

                <div className="absolute left-4 right-4 top-4 z-[240] pr-14 text-white">
                  <div className="text-[10px] font-semibold tracking-[0.16em] opacity-85">
                    {active.subtitle ?? "[SELECTED PROJECTS]"}
                  </div>

                  <div className="mt-4 font-extrabold leading-[0.9] tracking-tight">
                    <div className="text-[34px]">
                      {active.label.split("/")[0]?.trim()}
                    </div>
                    <div className="text-[34px]">
                      / {active.label.split("/")[1]?.trim()}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setIsFullscreen(false)}
                  className="absolute right-4 top-4 z-[250] grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full bg-black/26 backdrop-blur-sm"
                >
                  <IconImg src={VIDEO_ICONS.close} alt="Close" size={14} />
                </button>

                <div className="absolute left-0 right-0 top-[132px] z-[220] px-3">
                  <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-[18px] border border-white/10 bg-black shadow-[0_20px_40px_rgba(0,0,0,0.34)]">
                    <video
                      ref={videoRef}
                      src={active.video}
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
                        className="grid h-[46px] w-[46px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/12 transition"
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
                        className="grid h-[46px] w-[46px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/12 transition"
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
                            className="absolute left-0 top-0 h-[5px] rounded-full bg-white"
                            style={{ width: `${dur > 0 ? (t / dur) * 100 : 0}%` }}
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

                    <div className="mt-4">
                      <p
                        className="text-[13px] leading-[1.45] text-white/88"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          maskImage:
                            "linear-gradient(180deg, rgba(0,0,0,1) 72%, rgba(0,0,0,0.45) 88%, rgba(0,0,0,0) 100%)",
                        }}
                      >
                        {(active.paragraphs ?? []).join(" ")}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        className="grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/10"
                        aria-label="Previous video"
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
                        {projects.map((project, i) => {
                          const thumbSrc =
                            project.thumbs?.[0] || project.poster || activePoster;
                          const activeThumb = i === index;

                          return (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => goToIndex(i)}
                              aria-label={`Open ${project.label}`}
                              className="relative shrink-0 overflow-hidden rounded-[8px] transition-all duration-300"
                              style={{
                                width: activeThumb ? 136 : 104,
                                height: activeThumb ? 82 : 72,
                                scrollSnapAlign: "center",
                                opacity: activeThumb ? 1 : 0.86,
                                transform: activeThumb ? "translateY(-2px)" : "translateY(0px)",
                                border: activeThumb
                                  ? "1px solid rgba(0,255,182,0.95)"
                                  : "1px solid rgba(255,255,255,0.10)",
                                boxShadow: activeThumb
                                  ? "0 0 0 2px rgba(0,255,182,0.90), 0 0 0 5px rgba(0,255,182,0.14), 0 12px 28px rgba(0,255,182,0.18)"
                                  : "0 8px 18px rgba(0,0,0,0.22)",
                              }}
                            >
                              <ThumbImage
                                src={thumbSrc}
                                alt={project.label}
                                className="absolute inset-0 h-full w-full object-cover"
                              />

                              <div
                                className="absolute inset-0"
                                style={{
                                  background: activeThumb
                                    ? "linear-gradient(180deg, rgba(0,255,182,0.04) 0%, rgba(0,255,182,0.14) 100%)"
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
                        className="grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/10"
                        aria-label="Next video"
                      >
                        <IconImg src={VIDEO_ICONS.next} alt="Next" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={active.video}
                  poster={activePoster}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  muted={muted}
                  controls={false}
                  preload="metadata"
                />

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
                        className="absolute right-7 top-7 z-[240] grid h-[40px] w-[40px] cursor-pointer place-items-center rounded-full bg-black/22 backdrop-blur-sm"
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
                        <div className="text-[11px] font-semibold tracking-[0.16em] opacity-85 sm:text-[12px]">
                          {active.subtitle ?? "[SELECTED PROJECTS]"}
                        </div>

                        <div className="mt-5 font-extrabold leading-[0.92] tracking-tight">
                          <div className="text-[52px] sm:text-[72px] lg:text-[84px]">
                            {active.label.split("/")[0]?.trim()}
                          </div>
                          <div className="text-[52px] sm:text-[72px] lg:text-[84px]">
                            / {active.label.split("/")[1]?.trim()}
                          </div>
                        </div>

                        <div className="mt-10 max-w-[500px] space-y-7 text-[17px] leading-[1.42] opacity-100 sm:text-[20px] lg:text-[22px]">
                          {(active.paragraphs ?? []).map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
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
                              ? "cursor-pointer bg-white/12 hover:bg-white/18"
                              : "cursor-not-allowed bg-white/6 opacity-35",
                          ].join(" ")}
                          aria-label="Previous thumbnails"
                        >
                          <IconImg src={VIDEO_ICONS.prev} alt="Previous" size={22} />
                        </button>

                        <div className="flex min-w-0 flex-1 items-center justify-center gap-4 overflow-hidden">
                          {visibleThumbs.map((project) => {
                            const projectIndex = projects.findIndex((p) => p.id === project.id);
                            const thumbSrc =
                              project.thumbs?.[0] || project.poster || activePoster;
                            const activeThumb = projectIndex === index;

                            return (
                              <button
                                key={project.id}
                                type="button"
                                onClick={() => goToIndex(projectIndex)}
                                aria-label={`Open ${project.label}`}
                                className="relative h-[118px] w-[192px] shrink-0 overflow-hidden rounded-[6px] transition-all duration-300"
                                style={{
                                  opacity: activeThumb ? 1 : 0.92,
                                  transform: activeThumb ? "scale(1.035)" : "scale(1)",
                                  boxShadow: activeThumb
                                    ? "0 0 0 2px rgba(0,255,182,0.92), 0 0 0 6px rgba(0,255,182,0.18), 0 16px 42px rgba(0,255,182,0.20), 0 18px 36px rgba(0,0,0,0.30)"
                                    : "0 8px 24px rgba(0,0,0,0.20)",
                                  border: activeThumb
                                    ? "1px solid rgba(0,255,182,0.95)"
                                    : "1px solid rgba(255,255,255,0.12)",
                                }}
                              >
                                <ThumbImage
                                  src={thumbSrc}
                                  alt={project.label}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />

                                <div
                                  className="absolute inset-0"
                                  style={{
                                    background: activeThumb
                                      ? "linear-gradient(180deg, rgba(0,255,182,0.04) 0%, rgba(0,255,182,0.12) 100%)"
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
                              ? "cursor-pointer bg-white/12 hover:bg-white/18"
                              : "cursor-not-allowed bg-white/6 opacity-35",
                          ].join(" ")}
                          aria-label="Next thumbnails"
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
                            className="grid h-[56px] w-[56px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/12 backdrop-blur-sm transition hover:bg-white/18"
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
                            className="grid h-[56px] w-[56px] shrink-0 cursor-pointer place-items-center rounded-full bg-white/12 backdrop-blur-sm transition hover:bg-white/18"
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
                                className="absolute left-0 top-0 h-[6px] rounded-full bg-white"
                                style={{ width: `${dur > 0 ? (t / dur) * 100 : 0}%` }}
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
