"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "#our-work", label: "OUR WORK" },
  { href: "#services", label: "SERVICES" },
  { href: "#about-us", label: "ABOUT US" },
  { href: "#testimonials", label: "TESTIMONIALS" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWhatsappPopup, setShowWhatsappPopup] = useState(false);

  const navWrapRef = useRef<HTMLDivElement>(null);

  // حط رقم الواتساب هنا بصيغة دولية من غير + ولا مسافات
  const whatsappNumber = "201012345678";
  const whatsappMessage = "Hello, I want to contact you";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const closeAll = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!navWrapRef.current) return;
      const target = e.target as Node;
      if (!navWrapRef.current.contains(target)) closeAll();
    };

    const onScroll = () => {
      if (menuOpen) closeAll();
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!mounted) return;

    const showTimer = window.setTimeout(() => {
      setShowWhatsappPopup(true);
    }, 5000);

    const hideTimer = window.setTimeout(() => {
      setShowWhatsappPopup(false);
    }, 12000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [mounted]);

  return (
    <>
      <header className="sticky top-0 z-[9999] w-full pt-[env(safe-area-inset-top)]">
        <div className="mx-auto w-full max-w-[1240px] px-3 sm:px-6">
          <motion.div
            ref={navWrapRef}
            initial={{ opacity: 0, y: -36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.08,
              type: "spring",
              stiffness: 180,
              damping: 18,
              mass: 0.9,
            }}
            className="relative w-full"
          >
            {/* NAV BAR */}
            <nav
              className="
                relative
                h-[72px]
                w-full
                rounded-[16px]
                px-4 sm:px-6
                flex
                items-center
                justify-between
                will-change-transform
                backdrop-blur-xl
                border border-white/10
                shadow-[0_8px_32px_rgba(0,255,182,0.08)]
              "
              style={{
                background:
                  "linear-gradient(135deg, rgba(21,26,67,0.85) 0%, rgba(21,26,67,0.75) 100%)",
              }}
            >
              {/* LEFT: Logo */}
              <div className="flex min-w-0 items-center">
                <Link
                  href="/"
                  aria-label="Creators Hub Home"
                  className="inline-flex items-center"
                >
                  <div
                    className="
                      relative
                      h-[26px]
                      w-[112px]
                      xs:h-[28px] xs:w-[128px]
                      sm:h-[28px] sm:w-[140px]
                    "
                  >
                    <Image
                      src="/brand/logo.svg"
                      alt="Creators Hub"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
              </div>

              {/* CENTER: Links (Desktop only) */}
              <div className="hidden lg:flex items-center gap-12">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="
                      group relative
                      text-[12px] font-semibold tracking-[0.12em]
                      text-white/85
                      transition-all duration-300
                      hover:text-white
                    "
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute left-0 -bottom-[8px]
                        h-[2.5px] w-full
                        origin-left
                        scale-x-0
                        rounded-full
                        bg-gradient-to-r from-[#00FFB6] to-[#00D4A6]
                        transition-transform duration-300 ease-out
                        group-hover:scale-x-100
                      "
                    />
                  </Link>
                ))}
              </div>

              {/* RIGHT: Actions */}
              <div className="flex shrink-0 items-center gap-2 xs:gap-3">
                {/* Contact (Desktop + Tablet) */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.18 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="#contact"
                    className="
                      hidden sm:flex
                      h-[44px]
                      rounded-[10px]
                      px-5
                      items-center
                      gap-3
                      text-[13px]
                      font-semibold
                      text-white
                      border border-[#00FFB6]/40
                      transition-all duration-300
                      hover:border-[#00FFB6]/80
                      hover:bg-[#00FFB6]/10
                      hover:shadow-[0_0_20px_rgba(0,255,182,0.25)]
                    "
                    aria-label="Start a project"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="uppercase tracking-[0.08em]">
                      START A PROJECT
                    </span>
                    <FiArrowRight className="text-[18px]" />
                  </Link>
                </motion.div>

                {/* Contact (Mobile XS) */}
                <motion.div
                  className="sm:hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.18 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="#contact"
                    className="
                      h-[44px]
                      w-[44px]
                      rounded-[10px]
                      flex
                      items-center
                      justify-center
                      text-white
                      border border-[#00FFB6]/40
                      transition-all duration-300
                      hover:border-[#00FFB6]/80
                      hover:bg-[#00FFB6]/10
                      hover:shadow-[0_0_20px_rgba(0,255,182,0.25)]
                    "
                    aria-label="Start a project"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiArrowRight className="text-[18px]" />
                  </Link>
                </motion.div>

                {/* Burger (Mobile/Tablet only) */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="
                    lg:hidden
                    h-[44px]
                    w-[44px]
                    rounded-[10px]
                    border border-white/15
                    flex
                    items-center
                    justify-center
                    text-white/85
                    cursor-pointer
                    transition-all duration-300
                    hover:border-white/30
                    hover:bg-white/5
                    hover:text-white
                  "
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-nav"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {menuOpen ? (
                    <FiX className="text-[20px]" />
                  ) : (
                    <FiMenu className="text-[20px]" />
                  )}
                </motion.button>
              </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence initial={false}>
              {menuOpen && (
                <motion.div
                  id="mobile-nav"
                  className="lg:hidden mt-3 w-full overflow-hidden rounded-[14px] border border-white/10 px-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,255,182,0.08)]"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(21,26,67,0.85) 0%, rgba(21,26,67,0.75) 100%)",
                  }}
                >
                  <div className="flex flex-col gap-3 py-4">
                    {navLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="
                          relative
                          py-2
                          text-[12px] font-semibold tracking-[0.12em] text-white/85
                          transition-colors duration-200
                          hover:text-white
                        "
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </header>

      {mounted &&
        createPortal(
          <>
            {/* WhatsApp popup */}
            <AnimatePresence>
              {showWhatsappPopup && (
                <motion.div
                  initial={{ opacity: 0, x: 24, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 18, y: 8, scale: 0.94 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="
                    fixed
                    bottom-[78px] right-5
                    sm:bottom-[88px] sm:right-6
                  "
                  style={{ zIndex: 2147483646 }}
                >
                  <div
                    className="
                      relative
                      min-w-[220px]
                      max-w-[260px]
                      rounded-[18px]
                      border border-white/20
                      bg-white
                      px-4 py-3
                      shadow-[0_18px_45px_rgba(21,26,67,0.18)]
                    "
                  >
                    <button
                      type="button"
                      aria-label="Close WhatsApp popup"
                      onClick={() => setShowWhatsappPopup(false)}
                      className="
                        absolute right-2 top-2
                        flex h-[24px] w-[24px] items-center justify-center
                        rounded-full
                        text-[#151A43]/55
                        transition-colors duration-200
                        hover:bg-[#151A43]/6
                        hover:text-[#151A43]
                      "
                    >
                      <FiX className="text-[14px]" />
                    </button>

                    <div className="pr-6">
                      <span
                        className="
                          mb-1 inline-flex items-center
                          rounded-full
                          bg-[#25D366]/10
                          px-2.5 py-1
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.12em]
                          text-[#25D366]
                        "
                      >
                        WhatsApp
                      </span>

                      <p className="text-[14px] font-semibold leading-[1.4] text-[#151A43]">
                        Contact with us now
                      </p>

                      <p className="mt-1 text-[12px] leading-[1.5] text-[#151A43]/65">
                        We’re here to help. Start a quick chat with our team.
                      </p>
                    </div>

                    {/* arrow */}
                    <span
                      className="
                        absolute
                        bottom-[-7px] right-[22px]
                        h-[14px] w-[14px]
                        rotate-45
                        border-b border-r border-white/20
                        bg-white
                      "
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* WhatsApp button */}
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowWhatsappPopup(false)}
              className="
                fixed
                bottom-5 right-5
                flex items-center justify-center
                h-[56px] w-[56px]
                rounded-full
                bg-[#25D366]
                text-white
                shadow-[0_10px_30px_rgba(37,211,102,0.35)]
                transition-all duration-300
                hover:shadow-[0_14px_38px_rgba(37,211,102,0.45)]
                sm:bottom-6 sm:right-6
              "
              style={{ zIndex: 2147483647 }}
            >
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(37,211,102,0.35)",
                    "0 0 0 10px rgba(37,211,102,0)",
                    "0 0 0 0 rgba(37,211,102,0)",
                  ],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="
                  absolute inset-0 rounded-full
                "
              />
              <FaWhatsapp className="relative z-10 text-[30px]" />
            </motion.a>
          </>,
          document.body
        )}
    </>
  );
}
