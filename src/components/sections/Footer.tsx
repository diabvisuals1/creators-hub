"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* ===================== HERO (IMAGE) ===================== */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full h-[533.33px] max-[1023px]:h-[420px] max-[767px]:h-[360px]">
          <img
            src="/footer/footer-hero.jpeg"
            alt=""
            draggable={false}
            className="h-full w-full object-cover object-[50%_35%] select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-black/5" />

          {/* rings bottom-left (hide on mobile) */}
          <div className="pointer-events-none absolute left-[-140px] bottom-[-140px] h-[340px] w-[340px] rounded-full border-[10px] border-white/18 max-[767px]:hidden" />
          <div className="pointer-events-none absolute left-[-85px] bottom-[-85px] h-[280px] w-[280px] rounded-full border-[10px] border-white/14 max-[767px]:hidden" />

          {/* WHITE CARD (ALWAYS OVERLAY) */}
          <div
            className="
              absolute z-[10]
              rounded-[12px] bg-white
              shadow-[0_14px_40px_rgba(0,0,0,0.22)]
              overflow-hidden

              /* Desktop exact */
              right-[56px] top-[44px]
              w-[342.33px] h-[329.36px]
              px-[22px] pt-[18px] pb-[18px]

              /* Tablet */
              max-[1023px]:right-[28px] max-[1023px]:top-[26px]
              max-[1023px]:w-[320px] max-[1023px]:h-[305px]
              max-[1023px]:px-[20px] max-[1023px]:pt-[16px] max-[1023px]:pb-[16px]

              /* Mobile: centered overlay فوق الصورة */
              max-[767px]:left-1/2
              max-[767px]:right-auto
              max-[767px]:top-auto
              max-[767px]:bottom-[18px]
              max-[767px]:-translate-x-1/2
              max-[767px]:w-[min(92vw,342.33px)]
              max-[767px]:h-auto
              max-[767px]:px-[18px] max-[767px]:pt-[16px] max-[767px]:pb-[16px]
            "
          >
            <div className="mt-[15px] flex items-center justify-center">
              <img
                src="/footer/logo.svg"
                alt="Creators Hub"
                draggable={false}
                className="h-[32px] w-auto select-none pointer-events-none max-[767px]:h-[28px]"
              />
            </div>

            <div className="mt-[35px] flex flex-col gap-[8px] max-[767px]:mt-[14px]">
              <ActionButton
                href="mailto:creators.hub.agencyy@gmail.com"
                bg="#E63A3A"
                label="Email Us"
                value="creators.hub.agencyy@gmail.com"
              />
              <ActionButton
                href="https://wa.me/201105494439"
                bg="#1DB954"
                label="WhatsApp"
                value="+201105494439"
                target="_blank"
                rel="noreferrer"
              />
              <ActionButton
                href="#contact"
                bg="#141B4D"
                label="Start a Project"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===================== RED SECTION ===================== */}
      <div className="w-full overflow-hidden bg-[#BC1E3C] max-[1023px]:h-auto">
        {/* TOP PART */}
        <div className="mx-auto h-[185px] w-full max-w-[1180px] px-4 max-[1023px]:h-auto">
          <div
            className="pt-[44px] max-[1023px]:py-[40px] max-[767px]:py-[34px]"
            style={{ fontFamily: "var(--font-kollektif)" }}
          >
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between max-[767px]:items-center max-[767px]:text-center">
              <p className="max-w-[520px] text-[24px] leading-[1.18] text-white max-[767px]:text-[20px]">
                We craft content that helps creators, <br className="hidden sm:block max-[767px]:hidden" />
                brands, and events stand out.
              </p>

              <div className="flex items-start gap-10 lg:gap-14 max-[767px]:flex-col max-[767px]:items-center max-[767px]:gap-8">
                <div className="hidden h-[116px] w-[1px] bg-white/12 lg:block" />

                <div className="flex gap-10 lg:gap-14 max-[767px]:flex-col max-[767px]:items-center max-[767px]:gap-8 max-[767px]:text-center">
                  <div>
                    <div className="text-[10px] tracking-[0.16em] text-white/70">NAVIGATE</div>
                    <ul className="mt-4 space-y-2 text-[12px]">
                      <li>
                        <a
                          href="#our-work"
                          className="text-white transition-opacity duration-200 hover:opacity-75 focus:opacity-75 focus:outline-none"
                        >
                          Our Work
                        </a>
                      </li>
                      <li>
                        <a
                          href="#services"
                          className="text-white transition-opacity duration-200 hover:opacity-75 focus:opacity-75 focus:outline-none"
                        >
                          Services
                        </a>
                      </li>
                      <li>
                        <a
                          href="#about-us"
                          className="text-white transition-opacity duration-200 hover:opacity-75 focus:opacity-75 focus:outline-none"
                        >
                          About Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="#testimonials"
                          className="text-white transition-opacity duration-200 hover:opacity-75 focus:opacity-75 focus:outline-none"
                        >
                          Why Us
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="text-[10px] tracking-[0.16em] text-white/70">CONNECT</div>
                    <ul className="mt-4 space-y-2 text-[12px]">
                      <li>
                        <a
                          href="mailto:creators.hub.agencyy@gmail.com"
                          className="text-white transition-opacity duration-200 hover:opacity-75 focus:opacity-75 focus:outline-none"
                        >
                          Email
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://wa.me/201105494439"
                          target="_blank"
                          rel="noreferrer"
                          className="text-white transition-opacity duration-200 hover:opacity-75 focus:opacity-75 focus:outline-none"
                        >
                          WhatsApp
                        </a>
                      </li>
                      <li>
                        <a
                          href="tel:+201105494439"
                          className="text-white transition-opacity duration-200 hover:opacity-75 focus:opacity-75 focus:outline-none"
                        >
                          Phone Number
                        </a>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="ml-2 flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-white/10 text-white transition-colors duration-200 hover:bg-white/15 max-[767px]:ml-0"
                    aria-label="Back to top"
                  >
                    <UpIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PART */}
        <div className="relative h-[255px] w-full max-[1023px]:h-auto">
          {/* divider line */}
          <div className="absolute left-0 top-0 z-[1] h-[35px] w-full bg-[#C62245] max-[1023px]:h-[28px] max-[767px]:h-[18px]" />

          <div className="relative z-[2] mx-auto flex h-full w-full max-w-[1180px] flex-col px-4 pt-[56px] pb-[18px] max-[1023px]:pt-[52px] max-[1023px]:pb-[28px] max-[767px]:items-center max-[767px]:pt-[34px] max-[767px]:pb-[20px] max-[767px]:text-center">
            <div
              className="
                select-none
                text-white font-normal tracking-[0]
                text-[182px] leading-[0.88]
                max-[1180px]:text-[15vw]
                max-[1023px]:text-[118px]
                max-[1023px]:leading-[0.9]
                max-[767px]:text-[64px]
                max-[767px]:leading-[0.92]
              "
              style={{ fontFamily: "var(--font-godber), Godber, serif" }}
            >
              Creators Hub
            </div>

            <div
              className="mt-auto text-[10px] text-white/75"
              style={{ fontFamily: "var(--font-kollektif)" }}
            >
              © 2026 CREATORS HUB. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ActionButton({
  bg,
  label,
  value,
  href,
  target,
  rel,
}: {
  bg: string;
  label: string;
  value?: string;
  href: string;
  target?: string;
  rel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={value ? `${label}: ${value}` : label}
      target={target}
      rel={rel}
      className="flex h-[60px] w-full flex-col items-center justify-center gap-[2px] rounded-[8px] px-3 text-center leading-none text-white transition-opacity duration-200 hover:opacity-90"
      style={{ backgroundColor: bg }}
    >
      {value ? (
        <>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">
            {label}
          </span>
          <span className="max-w-full truncate text-[13px] font-semibold">
            {value}
          </span>
        </>
      ) : (
        <span className="text-[14px] font-semibold">{label}</span>
      )}
    </a>
  );
}

function UpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5l-7 7M12 5l7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}