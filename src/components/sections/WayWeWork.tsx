"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  type MotionValue,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

/* =========================
   PAGE
========================= */

export default function Page() {
  return (
    <main className="w-full">
      <WayWeWork />
      <HowWeHelp />
    </main>
  );
}

/* =========================
   WAY WE WORK (YELLOW)
========================= */

function WayWeWork() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const dragBoundsRef = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={sectionRef} id="our-work" className="w-full bg-white overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="relative w-full overflow-visible">
          <div className="relative z-20 w-full h-[360px] sm:h-[460px] lg:h-[560px] rounded-[22px] overflow-hidden bg-[#F3FF00]">
            <motion.img
              src="/waywork/bg.svg"
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-cover"
              style={{ transformOrigin: "50% 50%", willChange: "transform" }}
              animate={{
                scale: [1, 1.06, 1],
                x: [0, 18, 0, -18, 0],
                rotate: [0, 0.6, 0, -0.6, 0],
              }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(1200px 650px at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 62%)",
              }}
            />

            <div
              ref={dragBoundsRef}
              aria-hidden="true"
              className="absolute inset-[16px] sm:inset-[22px] lg:inset-[30px] pointer-events-none"
            />
          </div>

          <div className="absolute inset-0 z-30">
            <h2
              className="
                pointer-events-none
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                w-full px-6 sm:px-10
                text-[#0D1440]
                font-extrabold tracking-tight leading-[0.92]
                text-center select-none
                text-[clamp(34px,6.6vw,120px)]
                lg:whitespace-nowrap
              "
            >
              The Way We Work
            </h2>

            <AirPill
              progress={scrollYProgress}
              strength={120}
              dragBoundsRef={dragBoundsRef}
              label="DISCOVERY & STRATEGY"
              className="left-[34%] top-[16%] sm:left-[25%] sm:top-[20%]"
              trail="left"
              pillClass="bg-white text-[#B7AE00]"
              trailClass="bg-[#C9D240]/45"
            />
            <AirPill
              progress={scrollYProgress}
              strength={140}
              dragBoundsRef={dragBoundsRef}
              label="PROFESSIONALISM"
              className="left-[74%] top-[10%] sm:left-[84%] sm:top-[16%]"
              trail="right"
              pillClass="bg-[#151B3A] text-white"
              trailClass="bg-[#D8D8DD]/55"
            />
            <AirPill
              progress={scrollYProgress}
              strength={150}
              dragBoundsRef={dragBoundsRef}
              label="CREATIVE PRODUCTION & DESIGN"
              className="left-[72%] top-[24%] sm:left-[58%] sm:top-[30%]"
              trail="right"
              pillClass="bg-[#3F7BFF] text-white"
              trailClass="bg-[#AFC6FF]/45"
            />
            <AirPill
              progress={scrollYProgress}
              strength={110}
              dragBoundsRef={dragBoundsRef}
              label="TRANSPARENCY"
              className="left-1/2 top-[55%] sm:left-[46%] sm:top-[54%]"
              trail="left"
              pillClass="bg-[#10E6C6] text-[#08352F]"
              trailClass="bg-[#10E6C6]/22"
            />
            <AirPill
              progress={scrollYProgress}
              strength={150}
              dragBoundsRef={dragBoundsRef}
              label="ANALYSIS & OPTIMIZATION"
              className="left-[30%] top-[72%] sm:left-[16%] sm:top-[68%]"
              trail="left"
              pillClass="bg-[#151B3A] text-white"
              trailClass="bg-[#151B3A]/30"
            />
            <AirPill
              progress={scrollYProgress}
              strength={170}
              dragBoundsRef={dragBoundsRef}
              label="EXECUTION & MANAGEMENT"
              className="left-[64%] top-[86%] sm:left-[64%] sm:top-[82%]"
              trail="right"
              pillClass="bg-[#C0183C] text-white"
              trailClass="bg-[#B58C0E]/45"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AirPill({
  label,
  className,
  trail,
  pillClass,
  trailClass,
  progress,
  strength = 140,
  dragBoundsRef,
}: {
  label: string;
  className: string;
  trail: "left" | "right" | "none";
  pillClass: string;
  trailClass: string;
  progress: MotionValue<number>;
  strength?: number;
  dragBoundsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dir = trail === "right" ? 1 : trail === "left" ? -1 : 0;

  const baseX = useTransform(progress, [0, 0.5, 1], [dir * strength, 0, dir * -strength]);
  const baseXSpring = useSpring(baseX, { stiffness: 120, damping: 22, mass: 0.8 });

  const opacity = useTransform(progress, [0.08, 0.18, 0.9], [0, 1, 1]);
  const opacitySpring = useSpring(opacity, { stiffness: 120, damping: 24 });

  const dragX = useMotionValue(0);

  return (
    <motion.div
      style={{ x: baseXSpring, opacity: opacitySpring }}
      className={["absolute -translate-x-1/2 -translate-y-1/2", className].join(" ")}
    >
      <motion.div
        drag="x"
        dragConstraints={dragBoundsRef}
        dragElastic={0.12}
        dragMomentum={false}
        whileDrag={{ scale: 1.03 }}
        style={{ x: dragX, touchAction: "pan-y" }}
      >
        {trail !== "none" && (
          <span
            aria-hidden="true"
            className={[
              "pointer-events-none absolute top-1/2 -translate-y-1/2",
              "h-[42px] sm:h-[45px]",
              "w-[220vw]",
              "rounded-[18px]",
              trailClass,
              trail === "right" ? "left-[58%]" : "right-[58%]",
            ].join(" ")}
          />
        )}

        <div
          className={[
            "relative z-10",
            "h-[40px] sm:h-[48px]",
            "px-7 sm:px-10",
            "rounded-full",
            "flex items-center justify-center",
            "text-[11px] sm:text-[13px]",
            "font-semibold whitespace-nowrap",
            "shadow-[0_14px_28px_rgba(0,0,0,0.18)]",
            "cursor-grab active:cursor-grabbing",
            pillClass,
          ].join(" ")}
        >
          {label}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================
   HOW WE HELP (NAVY)
========================= */

type Tab = {
  id: string;
  number: string;
  label: string;
  title: string;
  desc: string;
  bullets: string[];
  icon: string;
  iconAlt: string;
};

type HowWeHelpProps = {
  className?: string;
};

const NAVY = "#181B4A";
const NEON = "#00FFB6";
const NEON_48 = "rgba(0,255,182,0.48)";
const NEON_22 = "rgba(0,255,182,0.22)";

function HowWeHelp({ className = "" }: HowWeHelpProps) {
  const tabs: Tab[] = useMemo(
    () => [
      {
        id: "t1",
        number: "01",
        label: "Content Creation",
        title: "Content Creation",
        desc: "Our content creation process is a comprehensive, end-to-end engine designed to transform raw ideas into high-performing digital assets.",
        bullets: [
          "Custom Design & Visuals",
          "Social Media Management",
          "Growth & Strategy",
          "Analytics & Reporting",
        ],
        icon: "/howwehelp/content-creation.svg",
        iconAlt: "Content Creation icon",
      },
      {
        id: "t2",
        number: "02",
        label: "Design",
        title: "Design",
        desc: "Our design process transforms ideas into clear, compelling visual systems that communicate your brand story and elevate your presence across all touchpoints.",
        bullets: [
          "Brand Identity & Visual Systems",
          "Print & Digital Design",
          "Presentation & Pitch Deck Design",
          "Campaign & Event Materials",
        ],
        icon: "/howwehelp/design.svg",
        iconAlt: "Design icon",
      },
      {
        id: "t3",
        number: "03",
        label: "Social Media Management",
        title: "Social Media Management",
        desc: "Our social media management approach builds strong brand presence, meaningful engagement, and consistent communication across all platforms.",
        bullets: [
          "Content Planning & Scheduling",
          "Visual Direction & Feed Design",
          "Community Management",
          "Performance Optimization",
        ],
        icon: "/howwehelp/social-media-management.svg",
        iconAlt: "Social Media Management icon",
      },
      {
        id: "t4",
        number: "04",
        label: "Growth & Strategy",
        title: "Growth & Strategy",
        desc: "Our growth and strategy framework aligns creative vision with business goals, turning insights into scalable brand success.",
        bullets: [
          "Brand Positioning & Messaging",
          "Campaign Strategy & Planning",
          "Audience Research & Market Insights",
          "Conversion Optimization",
        ],
        icon: "/howwehelp/growth-strategy.svg",
        iconAlt: "Growth & Strategy icon",
      },
      {
        id: "t5",
        number: "05",
        label: "Analytics & Reporting",
        title: "Analytics & Reporting",
        desc: "Our analytics and reporting system transforms data into actionable insights, helping you track performance, refine strategy, and scale with confidence.",
        bullets: [
          "Performance Dashboards",
          "Campaign Analysis",
          "Audience Behavior Reports",
          "Data-Driven Recommendations",
        ],
        icon: "/howwehelp/analytics-reporting.svg",
        iconAlt: "Analytics & Reporting icon",
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string>(tabs[0].id);
  const activeIndex = useMemo(() => tabs.findIndex((t) => t.id === activeId), [tabs, activeId]);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  const panelTransition = {
    duration: 0.48,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const columnTransition = {
    duration: 0.62,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  };

  return (
    <section id="how-we-help" className={`relative w-full ${className}`} style={{ background: NAVY }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[110px] sm:-top-[140px] h-[140px] sm:h-[190px]"
        style={{ backgroundColor: NAVY }}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14 md:py-16">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-start">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2" style={{ background: NEON }} />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: NEON }}>
              HOW WE HELP
            </h2>
          </div>

          <p className="text-sm md:text-base leading-relaxed" style={{ color: NEON_48 }}>
            We handle the entire lifecycle of your content. We build your roadmap, create your visuals, manage
            your launch, and scale your reach.
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          {/* Mobile */}
          <div className="md:hidden">
            <div className="relative h-[470px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={panelTransition}
                  className="absolute inset-0 will-change-transform"
                >
                  <ActivePanel tab={activeTab} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {tabs.map((t) => {
                const isActive = t.id === activeId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveId(t.id)}
                    className="shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold border transition-all duration-300"
                    style={{
                      borderColor: isActive ? NEON : NEON_22,
                      backgroundColor: isActive ? NEON : "rgba(255,255,255,0.04)",
                      color: isActive ? "#081B17" : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {t.number} • {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <div className="flex gap-4 h-[470px]">
              {tabs.map((t) => {
                const isActive = t.id === activeId;

                return (
                  <div
                    key={t.id}
                    className="relative h-full overflow-hidden will-change-[flex]"
                    style={{
                      flex: isActive ? "1 1 0%" : "0 0 58px",
                      minWidth: isActive ? "0" : "58px",
                      transitionProperty: "flex-basis, flex-grow, flex-shrink",
                      transitionDuration: `${columnTransition.duration}s`,
                      transitionTimingFunction: columnTransition.ease,
                    }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 0.985,
                      }}
                      transition={panelTransition}
                      style={{
                        pointerEvents: isActive ? "auto" : "none",
                        transformOrigin: "center center",
                        willChange: "opacity, transform",
                        zIndex: isActive ? 2 : 1,
                      }}
                    >
                      <ActivePanel tab={t} />
                    </motion.div>

                    <motion.div
                      className="absolute inset-0"
                      initial={false}
                      animate={{
                        opacity: isActive ? 0 : 1,
                        scale: isActive ? 0.985 : 1,
                      }}
                      transition={panelTransition}
                      style={{
                        pointerEvents: isActive ? "none" : "auto",
                        transformOrigin: "center center",
                        willChange: "opacity, transform",
                        zIndex: isActive ? 1 : 2,
                      }}
                    >
                      <ClosedColumn tab={t} onClick={() => setActiveId(t.id)} />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   Active Panel
========================= */

function ActivePanel({ tab }: { tab: Tab }) {
  return (
    <div
      className="relative overflow-hidden h-full w-full rounded-[14px]"
      style={{
        border: `1px solid ${NEON_48}`,
        background:
          "radial-gradient(900px 520px at 40% 28%, rgba(0,255,182,0.09) 0%, rgba(0,0,0,0) 62%)," +
          "radial-gradient(700px 420px at 88% 70%, rgba(0,255,182,0.06) 0%, rgba(0,0,0,0) 70%)," +
          "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 55%, rgba(0,0,0,0.06) 100%)",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute -inset-[60px] pointer-events-none opacity-[0.05]"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,255,182,0.75) 50%, rgba(0,0,0,0) 100%)",
          transform: "rotate(12deg)",
          willChange: "transform",
        }}
        animate={{ x: [-18, 18] }}
        transition={{ duration: 8.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      <div className="absolute right-8 top-7 md:right-10 md:top-9">
        <span className="text-[18px] md:text-[22px] font-semibold tracking-wide" style={{ color: NEON }}>
          {tab.number}
        </span>
      </div>

      <div className="h-full px-6 md:px-10 pt-8 md:pt-10 pb-10">
        <h3 className="text-[30px] md:text-[38px] leading-[1.05] font-medium" style={{ color: NEON }}>
          {tab.title}
        </h3>

        <p className="mt-4 md:mt-6 max-w-[560px] text-[13px] md:text-[16px] leading-[1.55]" style={{ color: NEON_48 }}>
          {tab.desc}
        </p>

        {!!tab.bullets?.length && (
          <ul className="mt-10 md:mt-16 space-y-3">
            {tab.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: NEON }}>
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] md:text-[14px] font-medium" style={{ color: NEON }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="pointer-events-none absolute bottom-7 right-7 md:bottom-10 md:right-10 h-[120px] w-[180px] md:h-[140px] md:w-[220px] opacity-90">
          <Image
            src={tab.icon}
            alt={tab.iconAlt}
            fill
            className="object-contain object-right-bottom"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================
   Closed Column
========================= */

function ClosedColumn({ tab, onClick }: { tab: Tab; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full h-full overflow-hidden rounded-[14px] cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.01]"
      style={{
        border: `1px solid ${NEON_22}`,
        background:
          "radial-gradient(260px 520px at 50% 20%, rgba(0,255,182,0.06) 0%, rgba(0,0,0,0) 60%)," +
          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.00) 70%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-200 rounded-[14px]"
        style={{
          background: `radial-gradient(circle at center, ${NEON_22} 0%, transparent 70%)`,
        }}
      />

      <div className="absolute left-1/2 -translate-x-1/2 top-8 transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
        <span
          className="text-[18px] md:text-[22px] font-semibold tracking-wide transition-colors duration-200 group-hover:text-[#00FFB6]"
          style={{ color: NEON_48 }}
        >
          {tab.number}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="whitespace-nowrap text-[18px] md:text-[22px] font-medium transition-colors duration-200 group-hover:text-[#00FFB6]"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: NEON_48,
          }}
        >
          {tab.label}
        </span>
      </div>
    </button>
  );
}