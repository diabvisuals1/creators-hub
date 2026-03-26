"use client";

import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const YELLOW = "#F3FF00";
const NAVY = "#151A43";
const RED = "#FF1E1E";

type FormState = {
  name: string;
  email: string;
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

  return "Failed to send message. Please check your EmailJS settings.";
}

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    type: "idle",
    message: "",
  });

  const emailJsConfig = useMemo(
    () => ({
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() || "",
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() || "",
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() || "",
    }),
    []
  );

  function onChange<K extends keyof FormState>(key: K, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
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

    if (
      !emailJsConfig.serviceId ||
      !emailJsConfig.templateId ||
      !emailJsConfig.publicKey
    ) {
      setStatus({
        type: "error",
        message:
          "EmailJS is not configured yet. Add NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: "idle", message: "" });

      const response = await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        {
          name: payload.name,
          email: payload.email,
          message: payload.message,
        },
        emailJsConfig.publicKey
      );

      if (response.status !== 200) {
        throw new Error("EmailJS did not accept the request.");
      }

      setStatus({
        type: "success",
        message: "Your message has been sent successfully.",
      });

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error: unknown) {
      console.error("EmailJS send error:", error);

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
          <div className="grid w-full lg:h-[680px] lg:grid-cols-2">
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

            <div className="relative h-full overflow-hidden">
              <div className="relative z-10 h-full">
                <div
                  className="w-full px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-0"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    paddingTop: "clamp(48px, 7.5vh, 86px)",
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

                    <div className="flex items-stretch gap-3 pt-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{
                          y: isSubmitting ? 0 : -2,
                          scale: isSubmitting ? 1 : 1.01,
                        }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 18,
                        }}
                        className="h-[52px] flex-1 cursor-pointer rounded-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        style={{
                          backgroundColor: RED,
                          boxShadow: "0 18px 50px rgba(255,30,30,0.26)",
                        }}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </motion.button>

                      <motion.button
                        type="submit"
                        aria-label="Send"
                        disabled={isSubmitting}
                        whileHover={{
                          y: isSubmitting ? 0 : -2,
                          scale: isSubmitting ? 1 : 1.03,
                        }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 18,
                        }}
                        className="grid h-[52px] w-[58px] cursor-pointer place-items-center rounded-[10px] disabled:cursor-not-allowed disabled:opacity-70"
                        style={{
                          backgroundColor: RED,
                          boxShadow: "0 18px 50px rgba(255,30,30,0.26)",
                        }}
                      >
                        <FiArrowRight className="text-[20px] text-white" />
                      </motion.button>
                    </div>
                  </form>

                  <div className="h-[42px]" />
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
    <div>
      <label className="mb-2 block text-[12px] font-semibold text-[#151A43]">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full resize-none rounded-[10px] border border-black/25 bg-transparent px-4 py-3 text-[13px] outline-none placeholder:text-black/35 focus:border-black/40"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[10px] border border-black/25 bg-transparent px-4 py-3 text-[13px] outline-none placeholder:text-black/35 focus:border-black/40"
        />
      )}
    </div>
  );
}