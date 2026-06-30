"use client";

import React from "react";
import { Award, Clapperboard, Globe, Users } from "lucide-react";

const STATS = [
  { value: "6+", label: "Years of Experience", Icon: Award, accent: "#31388C" },
  { value: "Video + Design", label: "Creative Production", Icon: Clapperboard, accent: "#FF1E1E" },
  { value: "Worldwide", label: "Remote Delivery", Icon: Globe, accent: "#1BA774" },
  { value: "Creators / Brands / Events", label: "Who We Support", Icon: Users, accent: "#4186FF" },
];

export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#F4F4F7]"
      style={{ fontFamily: "var(--font-kollektif)" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/about/background.png')" }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-0">
        <div className="min-h-[694px] pt-[28px] pb-[40px] lg:min-h-[694px] lg:pt-[34px] lg:pb-0">
          {/* Title */}
          <h2
            className="
              mb-[20px]
              text-[34px] font-extrabold leading-none tracking-[-0.03em]
              text-[#31388C]
              sm:text-[42px]
              lg:mb-[24px] lg:text-[39px]
            "
          >
            ABOUT US
          </h2>

          {/* Content */}
          <div
            className="
              grid w-full grid-cols-1 gap-[18px]
              lg:min-h-[507px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.28fr)] lg:gap-[26px]
            "
          >
            {/* Left side */}
            <div className="flex w-full flex-col gap-[18px]">
              {/* Blue card */}
              <div
                className="
                  relative w-full overflow-hidden rounded-[10px]
                  border border-[#31388C] bg-[#31388C]
                  min-h-[239px]
                  px-[24px] pt-[18px] pb-[20px]
                  transition-all duration-300 ease-out
                  hover:-translate-y-[4px]
                "
              >
                <div className="flex items-start justify-between">
                  <img
                    src="/about/logo.svg"
                    alt="Creators Hub"
                    draggable={false}
                    className="pointer-events-none h-[34px] w-auto select-none object-contain sm:h-[38px]"
                  />

                  <img
                    src="/about/target.svg"
                    alt="Target"
                    draggable={false}
                    className="pointer-events-none h-[28px] w-[28px] select-none object-contain transition-transform duration-300 hover:rotate-6"
                  />
                </div>

                <p
                  className="
                    absolute left-[24px] right-[24px] bottom-[20px]
                    text-left text-[16px] font-normal leading-[1.4] text-white
                    sm:text-[15px]
                  "
                >
                  Creators Hub is a creative content agency, We specialize in
                  content creation for creators and brands, including video
                  editing, short form videos, social media content, and designs.
                  Our focus is helping creators grow.
                </p>
              </div>

              {/* White stats card */}
              <div
                className="
                  relative w-full overflow-hidden rounded-[14px]
                  border border-[#AEB4CC]/60 bg-white
                  flex items-center
                  min-h-[239px]
                  p-[12px]
                  transition-all duration-300 ease-out
                  hover:-translate-y-[4px]
                "
              >
                <div className="grid w-full grid-cols-2 gap-[10px]">
                  {STATS.map((s) => {
                    const Icon = s.Icon;
                    return (
                      <div
                        key={s.label}
                        className="group/stat flex flex-col items-center justify-center rounded-[12px] border border-[#31388C]/10 bg-[#F6F7FC] px-2.5 py-[14px] text-center transition-all duration-300 ease-out hover:-translate-y-[3px] hover:border-[#31388C]/25 hover:bg-white hover:shadow-[0_14px_26px_rgba(49,56,140,0.14)]"
                      >
                        <span
                          className="mb-[9px] grid h-[34px] w-[34px] place-items-center rounded-full transition-transform duration-300 group-hover/stat:scale-110"
                          style={{ backgroundColor: `${s.accent}18`, color: s.accent }}
                        >
                          <Icon size={17} strokeWidth={2.4} />
                        </span>
                        <h3 className="text-balance text-[15px] font-extrabold leading-[1.12] text-[#31388C] sm:text-[17px]">
                          {s.value}
                        </h3>
                        <p className="mt-[5px] text-[11px] font-semibold leading-[1.2] text-[#31388C]/65 sm:text-[12px]">
                          {s.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right big card */}
            <div className="relative w-full lg:h-full">
              <div
                className="
                  relative h-[420px] w-full overflow-hidden rounded-[10px]
                  border border-[#AEB4CC] bg-white
                  transition-all duration-300 ease-out
                  hover:-translate-y-[4px]
                  sm:h-[470px]
                  lg:h-full
                "
              >
                {/* Header */}
                <div className="absolute left-0 right-0 top-0 z-[3] px-[20px] pt-[24px] text-center lg:pt-[22px]">
                  <h3 className="text-[20px] font-medium leading-[1.2] text-[#31388C] sm:text-[22px] lg:text-[18px]">
                    Based in Cairo, Egypt
                  </h3>

                  <div className="mt-[10px] flex items-center justify-center gap-[8px]">
                    <span className="h-[8px] w-[8px] rounded-full bg-[#19E6A7]" />
                    <span className="text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-[#31388C] sm:text-[12px]">
                      AVAILABLE WORLDWIDE
                    </span>
                  </div>
                </div>

                {/* Globe */}
                <img
                  src="/about/globe.png"
                  alt="Globe"
                  draggable={false}
                  className="
                    pointer-events-none absolute left-1/2 bottom-[-6px] z-[1]
                    w-[500px] max-w-none -translate-x-1/2 select-none
                    transition-transform duration-500 ease-out
                    sm:w-[620px]
                    md:w-[716px]
                    lg:bottom-[-2px] lg:w-[643px]
                    xl:w-[643px]
                  "
                />

                {/* Bottom fade */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[90px] bg-gradient-to-t from-white via-white/70 to-transparent" />
              </div>

              {/* Rocket */}
              <img
                src="/about/rocket-green.svg"
                alt="Rocket"
                draggable={false}
                className="
                  pointer-events-none absolute z-[5] select-none
                  right-[-25px] bottom-[-30px]
                  h-[66px] w-[66px]
                  transition-transform duration-300 ease-out
                  sm:h-[76px] sm:w-[76px]
                  lg:right-[-35px] lg:bottom-[-40px] lg:h-[88px] lg:w-[88px]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}