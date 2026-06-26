"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/sections/Navbar";
import { FiSearch, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const popIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.55, y: 14 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: {
    delay,
    type: "spring" as const,
    stiffness: 180,
    damping: 16,
  },
});

function useTypeLoop(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const current = useMemo(() => words[wordIndex] ?? "", [words, wordIndex]);

  useEffect(() => {
    const TYPE_SPEED = 90;
    const DELETE_SPEED = 55;
    const HOLD_AFTER_TYPE = 900;
    const HOLD_AFTER_DELETE = 220;

    let t: number;

    if (!deleting && text === current) {
      t = window.setTimeout(() => setDeleting(true), HOLD_AFTER_TYPE);
      return () => window.clearTimeout(t);
    }

    if (deleting && text === "") {
      t = window.setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, HOLD_AFTER_DELETE);
      return () => window.clearTimeout(t);
    }

    t = window.setTimeout(() => {
      const next = deleting
        ? current.slice(0, Math.max(0, text.length - 1))
        : current.slice(0, text.length + 1);

      setText(next);
    }, deleting ? DELETE_SPEED : TYPE_SPEED);

    return () => window.clearTimeout(t);
  }, [text, deleting, current, words.length]);

  return text;
}

const companyLogos = [
  {
    name: "Mr Beast",
    src: "/hero/logos/mrbeast.svg",
    width: 170,
    height: 42,
    mobileWidth: 130,
  },
  {
    name: "Bumble",
    src: "/hero/logos/bumble.svg",
    width: 130,
    height: 32,
    mobileWidth: 102,
  },
  {
    name: "Schibsted",
    src: "/hero/logos/schibsted.svg",
    width: 138,
    height: 32,
    mobileWidth: 108,
  },
  {
    name: "Opera",
    src: "/hero/logos/opera.svg",
    width: 118,
    height: 36,
    mobileWidth: 92,
  },
  {
    name: "Bonterra",
    src: "/hero/logos/bonterra.svg",
    width: 142,
    height: 34,
    mobileWidth: 110,
  },
  {
    name: "Zoom",
    src: "/hero/logos/zoom.svg",
    width: 118,
    height: 30,
    mobileWidth: 92,
  },
];

function HeroLogosBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.34, duration: 0.6, ease: "easeOut" }}
      className="relative z-30 border-t border-[#151A43]/12 bg-white"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div
          className="
            flex flex-wrap items-center justify-center
            gap-x-8 gap-y-5
            py-5
            sm:justify-between sm:gap-x-6 sm:py-6
            md:py-7
          "
        >
          {companyLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.42 + index * 0.05,
                duration: 0.4,
                ease: "easeOut",
              }}
              whileHover={{
                y: -3,
                scale: 1.045,
              }}
              className="
                group
                flex cursor-default items-center justify-center
                opacity-100
                transition-transform duration-300
              "
              aria-label={logo.name}
            >
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: `clamp(${logo.mobileWidth}px, 10vw, ${logo.width}px)`,
                  height: "42px",
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="
                    h-auto w-full object-contain
                    transition-transform duration-300
                    group-hover:scale-[1.04]
                  "
                  draggable={false}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const typed = useTypeLoop(["WELCOME"]);

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      style={{
        backgroundImage: "url('/hero/waves.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 w-full px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="mx-auto w-full max-w-[1240px]">
          <Navbar />
        </div>

        <div className="relative mt-6 w-full sm:mt-10">
          {/* plus lines */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="relative mx-auto h-full w-full max-w-[1240px]">
              <span
                aria-hidden="true"
                className="absolute bottom-[20px] left-0 top-[20px] w-[20px]"
                style={{
                  backgroundImage: "url('/hero/svg/plus.svg')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
              <span
                aria-hidden="true"
                className="absolute bottom-[20px] right-0 top-[20px] w-[20px]"
                style={{
                  backgroundImage: "url('/hero/svg/plus.svg')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </div>

          {/* floating icons */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="relative mx-auto h-full w-full max-w-[1240px]">
              {/* top left target */}
              <motion.div
                className="absolute left-[14px] top-[120px] will-change-transform sm:left-[70px] sm:top-[120px]"
                style={{
                  width: "clamp(34px, 9vw, 60px)",
                  height: "clamp(34px, 9vw, 60px)",
                }}
                initial={popIn(0.12).initial}
                animate={popIn(0.12).animate}
                transition={popIn(0.12).transition}
              >
                <motion.img
                  src="/hero/svg/target.svg"
                  alt=""
                  draggable={false}
                  className="h-full w-full select-none"
                  animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* bottom left rocket */}
              <motion.div
                className="absolute bottom-[118px] left-[6px] will-change-transform sm:bottom-[138px] sm:left-[34px]"
                style={{
                  width: "clamp(110px, 22vw, 185px)",
                  height: "clamp(110px, 22vw, 185px)",
                }}
                initial={popIn(0.28).initial}
                animate={popIn(0.28).animate}
                transition={popIn(0.28).transition}
              >
                <motion.img
                  src="/hero/svg/rocket.svg"
                  alt=""
                  draggable={false}
                  className="h-full w-full select-none"
                  animate={{ y: [0, -10, 0], rotate: [0, -1.2, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* bottom right bulb */}
              <motion.div
                className="absolute bottom-[122px] right-[10px] will-change-transform sm:bottom-[145px] sm:right-[62px]"
                style={{
                  width: "clamp(74px, 12vw, 120px)",
                  height: "clamp(74px, 12vw, 120px)",
                }}
                initial={popIn(0.34).initial}
                animate={popIn(0.34).animate}
                transition={popIn(0.34).transition}
              >
                <motion.img
                  src="/hero/svg/bulb.svg"
                  alt=""
                  draggable={false}
                  className="h-full w-full select-none"
                  animate={{ scale: [1, 1.03, 1], y: [0, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>

          {/* center content */}
          <div className="relative z-30 mx-auto w-full max-w-[1240px] px-2 sm:px-6">
            <div
              className="
                flex min-h-[540px] items-center justify-center
                px-6 pt-10 text-center
                sm:min-h-[620px] sm:px-14
                md:min-h-[640px]
              "
              style={{
                paddingTop: "clamp(70px, 11vw, 120px)",
                paddingBottom: "clamp(92px, 12vw, 120px)",
              }}
            >
              <div className="flex flex-col items-center">
                {/* welcome pill */}
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.08,
                    type: "spring",
                    stiffness: 160,
                    damping: 18,
                  }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-[10px] font-semibold tracking-[0.14em] text-[#151A43] backdrop-blur sm:mb-6 sm:text-[11px]"
                >
                  <span>(</span>

                  <span className="inline-flex items-center">
                    <span className="min-w-[62px] text-left">{typed}</span>
                    <motion.span
                      aria-hidden="true"
                      className="ml-[2px] inline-block h-[12px] w-[1.5px] bg-[#151A43]"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </span>

                  <span>)</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.14,
                    type: "spring",
                    stiffness: 140,
                    damping: 18,
                  }}
                  className="max-w-[980px] text-[#151A43]"
                >
                  <span className="block text-[34px] leading-[1.02] tracking-[-0.01em] sm:text-[52px] md:text-[66px]">
                    <span className="font-head">CREATORS HUB </span>
                    <span className="font-bold">- YOUR</span>
                  </span>

                  <span className="block text-[34px] font-bold leading-[1.02] tracking-[-0.01em] sm:text-[52px] md:text-[66px]">
                    CONTENT, FULLY MANAGED
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 140,
                    damping: 18,
                  }}
                  className="mt-5 max-w-[620px] px-2 text-[14px] font-medium leading-[1.6] text-[#151A43]/85 sm:mt-6 sm:text-[18px]"
                >
                  From roadmap design to global scaling, we handle your entire content lifecycle.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.26,
                    type: "spring",
                    stiffness: 160,
                    damping: 18,
                  }}
                  className="mt-7 flex items-center gap-3 sm:mt-9"
                >
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/contact"
                      className="flex h-[48px] items-center justify-center rounded-[8px] bg-[#FF1E1E] px-6 text-[13px] font-semibold text-white transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(255,30,30,0.22)] sm:h-[54px] sm:px-8 sm:text-[14px]"
                    >
                      Scale My Content
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/search"
                      aria-label="Search"
                      className="flex h-[48px] w-[48px] items-center justify-center rounded-[8px] bg-[#FF1E1E] text-white transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(255,30,30,0.22)] sm:h-[54px] sm:w-[54px]"
                    >
                      <FiChevronRight className="text-[18px] sm:text-[20px]" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* fade before logos bar */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-[110px] bg-gradient-to-b from-white/0 via-white/70 to-white" />
        </div>
      </div>

      <HeroLogosBar />
    </section>
  );
}