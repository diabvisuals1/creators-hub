"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

type TestimonialCard = {
  id: string;
  rating: string;
  quote: string;
  brand: string;
};

const BRAND_NAVY = "#151A43";
const RED = "#FF1E1E";
const CARD_BLUE = "#4186FF";
const SECTION_BG = "/testimonials/background.png";
const STAR_ASSET = "/testimonials/star.svg";
const MR_BEAST_LOGO = "/testimonials/mr-beast-logo.svg";

function cardFloatSpec(idx: number) {
  return {
    baseY: [18, 58, 28, 70, 20, 56, 30, 66][idx % 8],
    duration: [4.8, 5.2, 4.6, 5.4][idx % 4],
    delay: [0, 0.3, 0.6, 0.9][idx % 4],
  };
}

export default function Testimonials() {
  const items: TestimonialCard[] = useMemo(
    () => [
      {
        id: "card-01",
        rating: "5.0",
        brand: "Mr Beast",
        quote:
          "I've worked with agencies before, but no one understands the 'Launch' phase like these guys. We spent weeks building the roadmap together, and their attention to detail on the visuals was incredible—it finally felt like my brand looked as professional as the content I was producing.",
      },
      {
        id: "card-02",
        rating: "5.0",
        brand: "Mr Beast",
        quote:
          "Before working with the team, I was drowning in the day-to-day. I had the ideas, but no clear roadmap to execute them. They didn't just give me advice; they took over the entire lifecycle of my brand. From the moment they redesigned my visual identity to the day we managed the launch of my latest series, the quality shift was night and day.",
      },
      {
        id: "card-03",
        rating: "5.0",
        brand: "Mr Beast",
        quote:
          "Most people in this industry handle one piece of the puzzle, but what sets this team apart is that they owned the entire lifecycle.",
      },
      {
        id: "card-04",
        rating: "5.0",
        brand: "Mr Beast",
        quote:
          "What really impressed me was how they were able to handle every moving part without losing quality or momentum throughout the process.",
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
            ( TESTIMONIALS )
          </div>

          <h2
            id="testimonials-heading"
            className="mt-3 text-[30px] font-extrabold leading-[0.95] tracking-tight sm:text-[42px] lg:text-[56px]"
            style={{ color: BRAND_NAVY }}
          >
            DON&apos;T TAKE OUR WORD FOR IT
          </h2>

          <div className="mt-5 flex items-center justify-center gap-8 sm:gap-10">
            <span
              className="text-[11px] font-extrabold tracking-[0.28em] sm:text-[12px]"
              style={{ color: RED }}
            >
              •
            </span>
            <span
              className="text-[11px] font-extrabold tracking-[0.34em] sm:text-[12px]"
              style={{ color: RED }}
            >
              TAKE THEIRS
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
                <TestimonialCardItem
                  key={`${card.id}-set1`}
                  card={card}
                  idx={idx}
                />
              ))}
            </div>

            <div className="flex items-start gap-4 px-3 pt-6 pb-16 sm:gap-5 sm:px-4 sm:pt-8 sm:pb-20 lg:gap-7 lg:px-5 lg:pt-10 lg:pb-24">
              {items.map((card, idx) => (
                <TestimonialCardItem
                  key={`${card.id}-set2`}
                  card={card}
                  idx={idx + items.length}
                />
              ))}
            </div>

            <div className="flex items-start gap-4 px-3 pt-6 pb-16 sm:gap-5 sm:px-4 sm:pt-8 sm:pb-20 lg:gap-7 lg:px-5 lg:pt-10 lg:pb-24">
              {items.map((card, idx) => (
                <TestimonialCardItem
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

function TestimonialCardItem({
  card,
  idx,
}: {
  card: TestimonialCard;
  idx: number;
}) {
  const floatSpec = cardFloatSpec(idx);

  return (
    <motion.article
      itemScope
      itemType="https://schema.org/Review"
      className="
        relative shrink-0 overflow-hidden rounded-[14px]
        w-[290px] sm:w-[350px] lg:w-[425px]
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
          p-[24px] sm:p-[30px] lg:p-[38px]
        "
      >
        <div className="flex items-center gap-[10px]">
          <span
            className="leading-none text-white text-[18px] sm:text-[24px] lg:text-[32px]"
            style={{
              fontFamily: "Kollektif, sans-serif",
              fontWeight: 400,
            }}
            aria-label={`${card.rating} out of 5`}
          >
            {card.rating}
          </span>

          <div
            className="flex items-center gap-[6px]"
            aria-label="5 out of 5 stars"
            itemProp="reviewRating"
            itemScope
            itemType="https://schema.org/Rating"
          >
            <meta itemProp="ratingValue" content="5" />
            <meta itemProp="bestRating" content="5" />

            {Array.from({ length: 5 }).map((_, starIdx) => (
              <img
                key={starIdx}
                src={STAR_ASSET}
                alt=""
                aria-hidden="true"
                draggable={false}
                loading="lazy"
                className="h-[12px] w-[12px] object-contain sm:h-[14px] sm:w-[14px] lg:h-[17px] lg:w-[17px]"
              />
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-[22px] h-px w-full bg-white/35 lg:mt-[28px]"
        />

        <blockquote
          className="mt-[22px] text-white lg:mt-[28px]"
          style={{
            fontFamily: "Kollektif, sans-serif",
            fontWeight: 400,
            fontSize: "20px",
            lineHeight: "1.68",
          }}
        >
          <p
            itemProp="reviewBody"
            className="text-[15px] leading-[1.7] sm:text-[17px] lg:text-[20px]"
          >
            &ldquo;{card.quote}&rdquo;
          </p>
        </blockquote>

        <div className="mt-auto pt-[22px] lg:pt-[26px]">
          <img
            src={MR_BEAST_LOGO}
            alt={`${card.brand} logo`}
            draggable={false}
            loading="lazy"
            className="h-[26px] w-auto object-contain sm:h-[32px] lg:h-[38px]"
          />
        </div>

        <meta itemProp="author" content={card.brand} />
        <meta itemProp="itemReviewed" content={card.brand} />
      </div>
    </motion.article>
  );
}
