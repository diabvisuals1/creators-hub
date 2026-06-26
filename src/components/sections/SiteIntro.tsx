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
    }, reduceMotion ? 650 : 2450);

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
          initial={{ opacity: 0, scale: 0.982, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: reduceMotion ? 0.01 : 0.72,
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
            className="fixed inset-0 z-[2147483647] grid place-items-center overflow-hidden"
            style={{ backgroundColor: NAVY }}
            initial={{ opacity: 1 }}
            exit={{
              y: "-100%",
              opacity: 0.98,
              transition: {
                duration: reduceMotion ? 0.28 : 0.95,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
          >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              backgroundImage:
                "linear-gradient(115deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 72px), linear-gradient(0deg, rgba(0,255,182,0.08) 0 1px, transparent 1px 92px)",
              backgroundSize: "72px 72px, 92px 92px",
              maskImage:
                "linear-gradient(90deg, transparent 0%, black 16%, black 84%, transparent 100%)",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 0.22], opacity: [0, 1, 0.24] }}
            transition={{ duration: reduceMotion ? 0.3 : 1.25, ease: "easeInOut" }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[220vmax] w-[34vmax] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,255,182,0.20), rgba(255,255,255,0.18), rgba(0,255,182,0.20), transparent)",
              filter: "blur(18px)",
            }}
            initial={{ rotate: -58, x: "-72vw", opacity: 0 }}
            animate={{ rotate: -58, x: ["-72vw", "72vw"], opacity: [0, 1, 0] }}
            transition={{ duration: reduceMotion ? 0.4 : 1.45, delay: 0.48, ease: [0.76, 0, 0.24, 1] }}
          />

          <div className="relative flex h-[min(420px,80vw)] w-[min(420px,80vw)] items-center justify-center">
            <motion.div
              aria-hidden="true"
              className="absolute inset-[12%] rounded-full border border-[#00FFB6]/35"
              initial={{ scale: 0.74, opacity: 0, rotate: -16 }}
              animate={{
                scale: [0.74, 1.04, 1],
                opacity: [0, 1, 0.42],
                rotate: [-16, 10, 0],
              }}
              transition={{ duration: reduceMotion ? 0.35 : 1.2, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute inset-[22%] rounded-full border border-white/20"
              initial={{ scale: 1.18, opacity: 0, rotate: 22 }}
              animate={{
                scale: [1.18, 0.9, 1],
                opacity: [0, 0.9, 0.28],
                rotate: [22, -12, 0],
              }}
              transition={{ duration: reduceMotion ? 0.35 : 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute h-[56%] w-[56%] rounded-full"
              style={{
                background:
                  "conic-gradient(from 220deg, transparent, rgba(0,255,182,0.52), transparent 34%, rgba(237,231,223,0.38), transparent 68%)",
                filter: "blur(0.5px)",
              }}
              initial={{ scale: 0.82, rotate: -70, opacity: 0 }}
              animate={{
                scale: [0.82, 1.08, 1],
                rotate: [-70, 160],
                opacity: [0, 0.62, 0.32],
              }}
              transition={{ duration: reduceMotion ? 0.4 : 1.55, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="relative flex h-[118px] w-[min(300px,72vw)] items-center justify-center rounded-[22px] border border-white/14 bg-white/[0.045] px-9 backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 28px 90px rgba(0,0,0,0.26), inset 0 0 38px rgba(0,255,182,0.08)",
              }}
              initial={{ opacity: 0, y: 24, scale: 0.82, rotateX: 18 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [0.82, 1.05, 1],
                rotateX: 0,
              }}
              exit={{
                y: -26,
                scale: 0.92,
                opacity: 0,
                transition: { duration: 0.28 },
              }}
              transition={{ duration: reduceMotion ? 0.35 : 0.95, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute -left-8 top-1/2 h-px w-12"
                style={{ background: `linear-gradient(90deg, transparent, ${CREAM})` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.58 }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute -right-8 top-1/2 h-px w-12"
                style={{ background: `linear-gradient(90deg, ${CREAM}, transparent)` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.58 }}
              />

              <motion.div
                className="relative h-[44px] w-full"
                initial={{ opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
                animate={{
                  opacity: 1,
                  clipPath: "inset(0 0% 0 0%)",
                }}
                transition={{ duration: reduceMotion ? 0.3 : 0.74, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/brand/logo.svg"
                  alt="Creators Hub"
                  fill
                  priority
                  className="object-contain"
                  sizes="300px"
                />
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="absolute inset-x-5 bottom-4 h-[3px] overflow-hidden rounded-full bg-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.72 }}
              >
                <motion.span
                  className="block h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${GREEN}, ${CREAM})` }}
                  initial={{ x: "-104%" }}
                  animate={{ x: ["-104%", "0%", "104%"] }}
                  transition={{ duration: reduceMotion ? 0.45 : 1.35, delay: 0.74, ease: [0.76, 0, 0.24, 1] }}
                />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-[18vh]"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(0,255,182,0.08) 42%, rgba(0,0,0,0.20))",
            }}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: reduceMotion ? 0.25 : 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
