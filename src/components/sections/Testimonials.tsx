"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import {
  SquarePlay,
  Monitor,
  User,
  Zap,
  Puzzle,
  type LucideIcon,
} from "lucide-react";

type WhyCard = {
  id: string;
  Icon: LucideIcon;
  title: string;
  desc: string;
};

const BRAND_NAVY = "#151A43";
const RED = "#FF1E1E";
const CARD_BLUE = "#4186FF";
const SECTION_BG = "/testimonials/background.png";

function cardFloatSpec(idx: number) {
  return {
    baseY: [18, 58, 28, 70, 20, 56, 30, 66][idx % 8],
    duration: [4.8, 5.2, 4.6, 5.4][idx % 4],
    delay: [0, 0.3, 0.6, 0.9][idx % 4],
  };
}

export default function Testimonials() {
  const items: WhyCard[] = useMemo(
    () => [
      {
        id: "card-01",
        Icon: SquarePlay,
        title: "Video & Design Under One Roof",
        desc: "We handle videos, thumbnails, social media visuals, and motion graphics in one creative workflow.",
      },
      {
        id: "card-02",
        Icon: Monitor,
        title: "Platform-Ready Content",
        desc: "Every piece of content is prepared for the platform it will live on, from YouTube to Reels, TikTok, and event screens.",
      },
      {
        id: "card-03",
        Icon: User,
        title: "Beginner-Friendly Support",
        desc: "Whether you are just starting or already growing, we can help you shape your content, improve your visuals, and build a cleaner online presence.",
      },
      {
        id: "card-04",
        Icon: Zap,
        title: "Fast, Clear Workflow",
        desc: "We work from brief to delivery with clear communication, revisions, and organized production.",
      },
      {
        id: "card-05",
        Icon: Puzzle,
        title: "Flexible Creative Support",
        desc: "Whether you need one edit, monthly content, branding, or full social media management, we can support your production needs.",
      },
    ],
    []
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const [setWidth, setSetWidth] = useState(0);

  /**
   * سرعة الماركي:
   * زودتها شوية عشان الحركة متبقاش بطيئة
   */
  const SPEED = 92; // px/sec

  useEffect(() => {
    const measure = () => {
      if (!firstSetRef.current) return;
      setSetWidth(firstSetRef.current.scrollWidth);
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (firstSetRef.current) ro.observe(firstSetRef.current);
    if (containerRef.current) ro.observe(containerRef.current);

    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (!setWidth) return;

    const moveBy = (SPEED * delta) / 1000;
    const current = x.get();
    let next = current - moveBy;

    /**
     * Loop لا نهائي بدون jump واضح
     */
    if (Math.abs(next) >= setWidth) {
      next += setWidth;
    }

    x.set(next);
  });

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative w-full overflow-x-hidden bg-[#F4F4F4]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${SECTION_BG}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
          backgroundSize: "cover",
          opacity: 1,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 pt-14 sm:px-6 sm:pt-16 lg:pt-18">
        <div className="text-center">
          <div
            className="text-[11px] font-semibold tracking-[0.22em] sm:text-[12px]"
            style={{ color: BRAND_NAVY, opacity: 0.72 }}
          >
            ( WHY WORK WITH US )
          </div>

          <h2
            id="testimonials-heading"
            className="mt-3 text-[30px] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-[42px] lg:text-[56px]"
            style={{ color: BRAND_NAVY }}
          >
            Why Work With Creators Hub
          </h2>

          <div className="mt-5 flex items-center justify-center gap-6 sm:gap-8">
            <span
              className="text-[11px] font-extrabold tracking-[0.28em] sm:text-[12px]"
              style={{ color: RED }}
            >
              •
            </span>
            <span
              className="text-[11px] font-extrabold tracking-[0.18em] sm:text-[12px]"
              style={{ color: RED }}
            >
              Built for reliable creative delivery
            </span>
            <span
              className="text-[11px] font-extrabold tracking-[0.28em] sm:text-[12px]"
              style={{ color: RED }}
            >
              •
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 pb-20 sm:mt-14 sm:pb-24 lg:mt-16 lg:pb-28">
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden min-h-[320px] sm:min-h-[390px] lg:min-h-[520px]"
        >
          <motion.div
            className="flex w-max will-change-transform"
            style={{
              x,
              willChange: "transform",
            }}
          >
            <div
              ref={firstSetRef}
              className="flex items-start gap-4 px-3 pt-6 pb-16 sm:gap-5 sm:px-4 sm:pt-8 sm:pb-20 lg:gap-7 lg:px-5 lg:pt-10 lg:pb-24"
            >
              {items.map((card, idx) => (
                <WhyCardItem key={`${card.id}-set1`} card={card} idx={idx} />
              ))}
            </div>

            <div className="flex items-start gap-4 px-3 pt-6 pb-16 sm:gap-5 sm:px-4 sm:pt-8 sm:pb-20 lg:gap-7 lg:px-5 lg:pt-10 lg:pb-24">
              {items.map((card, idx) => (
                <WhyCardItem
                  key={`${card.id}-set2`}
                  card={card}
                  idx={idx + items.length}
                />
              ))}
            </div>

            <div className="flex items-start gap-4 px-3 pt-6 pb-16 sm:gap-5 sm:px-4 sm:pt-8 sm:pb-20 lg:gap-7 lg:px-5 lg:pt-10 lg:pb-24">
              {items.map((card, idx) => (
                <WhyCardItem
                  key={`${card.id}-set3`}
                  card={card}
                  idx={idx + items.length * 2}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhyCardItem({ card, idx }: { card: WhyCard; idx: number }) {
  const floatSpec = cardFloatSpec(idx);
  const Icon = card.Icon;

  return (
    <motion.article
      className="
        relative shrink-0 overflow-hidden rounded-[22px]
        w-[280px] sm:w-[300px] lg:w-[330px]
        min-h-[340px] lg:min-h-[400px]
      "
      style={{
        background: `linear-gradient(135deg, ${CARD_BLUE} 0%, ${CARD_BLUE} 76%, rgba(159,242,232,0.95) 100%)`,
        boxShadow: "0 18px 42px rgba(0,0,0,0.08)",
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
      initial={false}
      animate={{
        y: [
          floatSpec.baseY,
          floatSpec.baseY - 12,
          floatSpec.baseY,
          floatSpec.baseY + 8,
          floatSpec.baseY,
        ],
      }}
      transition={{
        duration: floatSpec.duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: floatSpec.delay,
      }}
    >
      <div
        className="
          flex h-full w-full flex-col
          p-[26px] sm:p-[30px] lg:p-[34px]
        "
      >
        <div
          className="
            flex items-center justify-center
            h-[52px] w-[52px] rounded-full
            bg-white/15
          "
        >
          <Icon className="h-[26px] w-[26px] text-white" strokeWidth={2} />
        </div>

        <h3
          className="mt-[26px] text-[20px] font-bold leading-[1.2] text-white lg:text-[22px]"
          style={{ fontFamily: "Kollektif, sans-serif" }}
        >
          {card.title}
        </h3>

        <div
          aria-hidden="true"
          className="mt-[16px] h-px w-full bg-white/30 lg:mt-[20px]"
        />

        <p
          className="mt-[16px] text-[15px] leading-[1.65] text-white/90 lg:mt-[20px] lg:text-[16px]"
          style={{ fontFamily: "Kollektif, sans-serif" }}
        >
          {card.desc}
        </p>
      </div>
    </motion.article>
  );
}
