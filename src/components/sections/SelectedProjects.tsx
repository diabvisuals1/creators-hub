"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

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

const R = 5.33;
const LABEL_MARGIN = 16;

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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={className}
        style={{
          background:
            "linear-gradient(180deg, rgba(250,230,175,0.95) 0%, rgba(220,185,120,0.95) 100%)",
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const active = projects[index];
  const activePoster = active.poster;
  const activeThumbs =
    active.thumbs && active.thumbs.length > 0
      ? active.thumbs
      : [active.poster];

  const go = useCallback(
    (nextDir: 1 | -1) => {
      setIndex((i) => {
        const n = projects.length;
        return (i + nextDir + n) % n;
      });
    },
    [projects.length]
  );

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

  const stopRAF = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const tick = () => {
    const v = videoRef.current;
    if (!v) return;
    setT(v.currentTime || 0);
    rafRef.current = requestAnimationFrame(tick);
  };

  const startRAF = () => {
    stopRAF();
    rafRef.current = requestAnimationFrame(tick);
  };

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
      setIsPlaying(false);
      setT(0);
      setDur(0);
      return;
    }

    const v = videoRef.current;
    if (!v) return;

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
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      stopRAF();
    };
  }, [isFullscreen, active.id, muted]);

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
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      transform: "translate(42px, 34px)",
                      background: "#08A678",
                      borderRadius: R,
                      clipPath: "polygon(0 0, 92% 0, 100% 22%, 100% 100%, 0 100%)",
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      transform: "translate(26px, 22px)",
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
                      background:
                        "linear-gradient(180deg, rgba(250,230,175,1) 0%, rgba(220,185,120,1) 100%)",
                    }}
                    onPointerDown={onCardPointerDown}
                    onPointerMove={onCardPointerMove}
                    onPointerUp={onCardPointerUp}
                    onPointerCancel={onCardPointerUp}
                  >
                    {/* single poster only for this card */}
                    <ThumbImage
                      src={activePoster}
                      alt={active.label}
                      className="absolute inset-0 h-full w-full object-cover select-none"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(10,12,24,0.06) 0%, rgba(10,12,24,0.10) 32%, rgba(10,12,24,0.22) 58%, rgba(10,12,24,0.52) 100%)",
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
                      <img
                        src="/playicon.svg"
                        alt=""
                        draggable={false}
                        style={{ width: 96, height: 96, cursor: "pointer" }}
                      />
                    </button>

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
                        className="absolute inset-0 flex items-center justify-center bg-[#F6F6F6]"
                        style={{
                          borderRadius: R,
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
          >
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
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(900px 600px at 18% 25%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 58%)," +
                  "linear-gradient(90deg, rgba(20,20,28,0.68) 0%, rgba(20,20,28,0.18) 55%, rgba(20,20,28,0.10) 100%)",
              }}
            />

            <button
              type="button"
              aria-label="Close"
              onClick={() => setIsFullscreen(false)}
              className="absolute right-6 top-6 z-[230] grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-full bg-white/20 backdrop-blur"
              style={{ cursor: "pointer" }}
            >
              <FiX className="text-[18px] text-white" />
            </button>

            <div className="absolute left-8 top-8 z-[220] max-w-[420px] text-white">
              <div className="text-[10px] tracking-[0.18em] opacity-70">
                {active.subtitle ?? "[SELECTED PROJECTS]"}
              </div>

              <div className="mt-3 font-extrabold leading-[0.95]">
                <div className="text-[56px]">{active.label.split("/")[0]?.trim()}</div>
                <div className="text-[56px]">/ {active.label.split("/")[1]?.trim()}</div>
              </div>

              <div className="mt-10 space-y-8 text-[14px] leading-[1.7] opacity-90">
                {(active.paragraphs ?? []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-[230] px-8 pb-8">
              <div className="mb-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="grid h-[36px] w-[36px] cursor-pointer place-items-center rounded-full bg-white/15 text-white backdrop-blur"
                  aria-label="Previous video"
                  style={{ cursor: "pointer" }}
                >
                  <FiChevronLeft />
                </button>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-3">
                    {activeThumbs.slice(0, 7).map((src, i) => (
                      <div
                        key={src + i}
                        className="h-[48px] w-[74px] overflow-hidden"
                        style={{
                          borderRadius: 6,
                          boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
                          opacity: i === 0 ? 1 : 0.9,
                        }}
                      >
                        <ThumbImage src={src} />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => go(1)}
                  className="grid h-[36px] w-[36px] cursor-pointer place-items-center rounded-full bg-white/15 text-white backdrop-blur"
                  aria-label="Next video"
                  style={{ cursor: "pointer" }}
                >
                  <FiChevronRight />
                </button>
              </div>

              <div className="flex items-center gap-4 text-white/90">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-full bg-white/15 backdrop-blur"
                  aria-label={isPlaying ? "Pause" : "Play"}
                  style={{ cursor: "pointer" }}
                >
                  {isPlaying ? (
                    <span className="text-[14px] font-bold">||</span>
                  ) : (
                    <span className="text-[14px] font-bold">▶</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="h-[34px] cursor-pointer rounded-full bg-white/15 px-3 text-[12px] backdrop-blur"
                  aria-label={muted ? "Unmute" : "Mute"}
                  style={{ cursor: "pointer" }}
                >
                  {muted ? "MUTED" : "SOUND"}
                </button>

                <div className="w-[54px] text-[12px]">{fmtTime(t)}</div>

                <div className="flex-1">
                  <div className="relative h-[6px] rounded-full bg-white/25">
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
                      className="absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full bg-white"
                      style={{
                        left: `calc(${dur > 0 ? (t / dur) * 100 : 0}% - 7px)`,
                      }}
                    />
                  </div>
                </div>

                <div className="w-[54px] text-right text-[12px]">{fmtTime(dur)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}