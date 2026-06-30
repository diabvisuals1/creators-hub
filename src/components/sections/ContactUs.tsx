"use client";

import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const YELLOW = "#F3FF00";
const NAVY = "#151A43";
const RED = "#FF1E1E";

type FormState = {
  name: string;
  email: string;
  service: string;
  message: string;
};

type StatusState = {
  type: "idle" | "success" | "error";
  message: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const maybeText = "text" in error ? error.text : undefined;
    const maybeMessage = "message" in error ? error.message : undefined;
    const maybeStatusText = "statusText" in error ? error.statusText : undefined;

    if (typeof maybeText === "string" && maybeText.trim()) {
      return maybeText;
    }

    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }

    if (typeof maybeStatusText === "string" && maybeStatusText.trim()) {
      return maybeStatusText;
    }
  }

  return "Failed to send your message. Please try again.";
}

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    type: "idle",
    message: "",
  });

  function onChange<K extends keyof FormState>(key: K, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      service: form.service.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.service || !payload.message) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim() || "";

    if (!endpoint) {
      setStatus({
        type: "error",
        message:
          "The contact form isn't connected yet. Add NEXT_PUBLIC_FORM_ENDPOINT (your Google Apps Script Web App URL).",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: "idle", message: "" });

      // Google Apps Script web app. Sent as a "simple" request (URL-encoded,
      // no custom headers) so the browser skips the CORS preflight Apps Script
      // can't answer. Response is opaque (no-cors) — reaching here without a
      // network error means the row was logged + the email was sent.
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({
          name: payload.name,
          email: payload.email,
          service: payload.service,
          message: payload.message,
        }),
      });

      setStatus({
        type: "success",
        message:
          "Your message has been sent successfully. We'll get back to you soon.",
      });

      setForm({
        name: "",
        email: "",
        service: "",
        message: "",
      });
    } catch (error: unknown) {
      console.error("Contact form error:", error);

      setStatus({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: YELLOW }}
    >
      <div className="w-full px-4 sm:px-6">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid w-full lg:min-h-[680px] lg:grid-cols-2">
            <div className="relative h-[420px] sm:h-[520px] lg:h-full">
              <img
                src="/contact/contact-photo.png"
                alt="Contact"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />

              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end px-6 pb-10 sm:px-10 sm:pb-14">
                <h3 className="text-[30px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[40px]">
                  NEED HELP GROWING
                  <br />
                  YOUR CONTENT?
                </h3>

                <p className="mt-5 max-w-[520px] text-[13px] leading-[1.7] text-white/90 sm:text-[14px]">
                  Have a question or need support? Get in touch and let us handle
                  your content, design, and growth.
                </p>
              </div>
            </div>

            <div className="relative h-full">
              <div className="relative z-10 h-full">
                <div
                  className="w-full px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-0"
                  style={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    paddingTop: "clamp(48px, 7.5vh, 86px)",
                    paddingBottom: "clamp(32px, 5vh, 64px)",
                    paddingLeft: "clamp(24px, 2.2vw, 44px)",
                  }}
                >
                  <h3
                    className="text-[34px] font-extrabold tracking-tight sm:text-[44px]"
                    style={{ color: NAVY }}
                  >
                    CONTACT US
                  </h3>

                  <form onSubmit={onSubmit} className="mt-7 max-w-[560px] space-y-6">
                    <Field
                      label="Name*"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(v) => onChange("name", v)}
                    />

                    <Field
                      label="Email*"
                      placeholder="Johndoe@gmail.com"
                      value={form.email}
                      onChange={(v) => onChange("email", v)}
                      type="email"
                    />

                    <Field
                      label="Service Needed*"
                      placeholder="Video Editing, Design, Social Media...."
                      value={form.service}
                      onChange={(v) => onChange("service", v)}
                    />

                    <Field
                      label="Message*"
                      placeholder="I was asking about...."
                      value={form.message}
                      onChange={(v) => onChange("message", v)}
                      textarea
                    />

                    {status.type !== "idle" && (
                      <div
                        className={[
                          "rounded-[10px] border px-4 py-3 text-[13px] font-medium break-words",
                          status.type === "success"
                            ? "border-green-700/20 bg-green-700/10 text-green-900"
                            : "border-red-700/20 bg-red-700/10 text-red-900",
                        ].join(" ")}
                      >
                        {status.message}
                      </div>
                    )}

                    <div className="group flex items-stretch gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-[52px] flex-1 cursor-pointer rounded-[10px] font-semibold text-white shadow-[0_18px_50px_rgba(255,30,30,0.26)] transition-all duration-300 group-hover:-translate-y-[2px] group-hover:shadow-[0_22px_55px_rgba(255,30,30,0.34)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:group-hover:translate-y-0 disabled:group-hover:shadow-[0_18px_50px_rgba(255,30,30,0.26)]"
                        style={{ backgroundColor: RED }}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>

                      <button
                        type="submit"
                        aria-label="Send"
                        disabled={isSubmitting}
                        className="grid h-[52px] w-[58px] cursor-pointer place-items-center rounded-[10px] text-white shadow-[0_18px_50px_rgba(255,30,30,0.26)] transition-all duration-300 group-hover:-translate-y-[2px] group-hover:shadow-[0_22px_55px_rgba(255,30,30,0.34)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:group-hover:translate-y-0 disabled:group-hover:shadow-[0_18px_50px_rgba(255,30,30,0.26)]"
                        style={{ backgroundColor: RED }}
                      >
                        <FiArrowRight className="text-[20px] text-white" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  textarea = false,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <div className="group">
      <label className="mb-2 block text-[12px] font-semibold text-[#151A43]/70 transition-colors duration-200 group-focus-within:text-[#151A43]">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full resize-none rounded-[10px] border border-[#151A43]/25 bg-white/30 px-4 py-3 text-[13px] text-[#151A43] outline-none transition-all duration-200 placeholder:text-[#151A43]/35 focus:border-[#151A43] focus:bg-white/70 focus:ring-4 focus:ring-[#151A43]/12"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[10px] border border-[#151A43]/25 bg-white/30 px-4 py-3 text-[13px] text-[#151A43] outline-none transition-all duration-200 placeholder:text-[#151A43]/35 focus:border-[#151A43] focus:bg-white/70 focus:ring-4 focus:ring-[#151A43]/12"
        />
      )}
    </div>
  );
}