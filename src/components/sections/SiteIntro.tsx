"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const NAVY = "#151A43";
const GREEN = "#00FFB6";
const CREAM = "#EDE7DF";

export default function SiteIntro({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const previousOverflowRef = useRef<string | null>(null);

  useEffect(() => {
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, reduceMotion ? 620 : 2240);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflowRef.current ?? "";
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!contentReady) return;

    document.body.style.overflow = previousOverflowRef.current ?? "";

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    };

    const frame = window.requestAnimationFrame(scrollToHash);
    const retryTimers = [120, 360, 760].map((delay) =>
      window.setTimeout(scrollToHash, delay)
    );

    return () => {
      window.cancelAnimationFrame(frame);
      retryTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [contentReady]);

  return (
    <>
      {contentReady && (
        <motion.div
          initial={{ opacity: 0, scale: 0.985, filter: "blur(7px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: reduceMotion ? 0.01 : 0.58,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      )}

      <AnimatePresence onExitComplete={() => setContentReady(true)}>
        {visible && (
          <motion.div
            role="presentation"
            className="fixed inset-0 z-[2147483647] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: reduceMotion ? 0.08 : 0.16 },
            }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1/2"
              style={{ backgroundColor: NAVY }}
              initial={{ x: "0%" }}
              animate={{ x: reduceMotion ? "-100%" : ["0%", "0%", "-104%"] }}
              transition={{
                duration: reduceMotion ? 0.22 : 2.18,
                times: [0, 0.74, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-1/2"
              style={{ backgroundColor: NAVY }}
              initial={{ x: "0%" }}
              animate={{ x: reduceMotion ? "100%" : ["0%", "0%", "104%"] }}
              transition={{
                duration: reduceMotion ? 0.22 : 2.18,
                times: [0, 0.74, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.42, 0] }}
              transition={{
                duration: reduceMotion ? 0.25 : 1.85,
                times: [0, 0.2, 0.72, 1],
              }}
              style={{
                backgroundImage:
                  "linear-gradient(115deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 82px), linear-gradient(0deg, rgba(0,255,182,0.07) 0 1px, transparent 1px 96px)",
                backgroundSize: "82px 82px, 96px 96px",
                maskImage:
                  "radial-gradient(circle at 50% 48%, black 0%, black 38%, transparent 72%)",
              }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
              style={{
                background: `linear-gradient(180deg, transparent, ${GREEN}, ${CREAM}, ${GREEN}, transparent)`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{
                scaleY: reduceMotion ? 1 : [0, 0, 1, 0.28],
                opacity: reduceMotion ? 0 : [0, 0, 1, 0],
              }}
              transition={{
                duration: reduceMotion ? 0.1 : 2.05,
                times: [0, 0.58, 0.78, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            <div className="absolute inset-0 grid place-items-center">
              <motion.div
                aria-hidden="true"
                className="absolute h-[250px] w-[250px] rounded-full sm:h-[310px] sm:w-[310px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,255,182,0.18) 0%, rgba(0,255,182,0.08) 34%, transparent 68%)",
                  filter: "blur(4px)",
                }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: reduceMotion ? 0.85 : [0.6, 1, 1.16, 0.2],
                  opacity: reduceMotion ? 0 : [0, 0.95, 0.55, 0],
                }}
                transition={{
                  duration: reduceMotion ? 0.12 : 1.95,
                  times: [0, 0.26, 0.72, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              <motion.div
                className="relative h-[152px] w-[152px] sm:h-[184px] sm:w-[184px]"
                initial={{ opacity: 0, y: 20, scale: 0.78, rotate: -18 }}
                animate={{
                  opacity: reduceMotion ? 0 : [0, 1, 1, 0],
                  x: reduceMotion ? 0 : [0, 0, 18, 54],
                  y: reduceMotion ? -70 : [20, 0, -52, -168],
                  scale: reduceMotion ? 0.92 : [0.78, 1, 1.12, 1.42],
                  rotate: reduceMotion ? -18 : [-18, -11, -17, -30],
                }}
                transition={{
                  duration: reduceMotion ? 0.34 : 2.05,
                  times: [0, 0.25, 0.72, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute left-1/2 top-[64%] h-[120px] w-[42px] -translate-x-1/2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,255,182,0.72), rgba(237,231,223,0.30), transparent)",
                    filter: "blur(12px)",
                  }}
                  initial={{ opacity: 0, scaleY: 0.5 }}
                  animate={{
                    opacity: reduceMotion ? 0 : [0, 0.85, 0.45, 0],
                    scaleY: reduceMotion ? 0.5 : [0.5, 1, 1.24, 0.2],
                  }}
                  transition={{
                    duration: reduceMotion ? 0.2 : 1.55,
                    delay: reduceMotion ? 0 : 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />

                <Image
                  src="/hero/svg/rocket.svg"
                  alt=""
                  fill
                  priority
                  className="object-contain drop-shadow-[0_22px_42px_rgba(0,0,0,0.28)]"
                  sizes="184px"
                />
              </motion.div>

              <motion.div
                className="absolute top-[calc(50%+112px)] h-[30px] w-[168px] sm:top-[calc(50%+132px)] sm:w-[206px]"
                initial={{ opacity: 0, y: 8, clipPath: "inset(0 50% 0 50%)" }}
                animate={{
                  opacity: reduceMotion ? 0 : [0, 0.82, 0.82, 0],
                  y: reduceMotion ? 8 : [8, 0, 0, -10],
                  clipPath: reduceMotion
                    ? "inset(0 0% 0 0%)"
                    : [
                        "inset(0 50% 0 50%)",
                        "inset(0 0% 0 0%)",
                        "inset(0 0% 0 0%)",
                        "inset(0 18% 0 18%)",
                      ],
                }}
                transition={{
                  duration: reduceMotion ? 0.12 : 1.32,
                  delay: reduceMotion ? 0 : 0.34,
                  times: [0, 0.36, 0.72, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Image
                  src="/brand/logo.svg"
                  alt="Creators Hub"
                  fill
                  priority
                  className="object-contain"
                  sizes="206px"
                />
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[3px] w-[min(78vw,620px)] -translate-x-1/2 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${GREEN}, ${CREAM}, ${GREEN}, transparent)`,
                  boxShadow: "0 0 34px rgba(0,255,182,0.34)",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: reduceMotion ? 0 : [0, 0, 1, 0],
                  opacity: reduceMotion ? 0 : [0, 0, 1, 0],
                }}
                transition={{
                  duration: reduceMotion ? 0.1 : 2.02,
                  times: [0, 0.58, 0.79, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
