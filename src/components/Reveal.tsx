"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveals its children with a soft fade + rise the first time they scroll
 * into view. Used to make each section appear as you reach it instead of
 * everything showing at once.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -120px 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
