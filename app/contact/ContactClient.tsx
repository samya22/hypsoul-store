"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = "idle" | "loading" | "success" | "error";

const SUBJECTS = [
  "Order Inquiry",
  "Product Question",
  "Return / Exchange",
  "Collaboration",
  "Press / Media",
  "Other",
];

export default function ContactClient() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof typeof form]) {
      setErrors((e) => ({ ...e, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setFormState("success");
        setMessage(data.message);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormState("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setFormState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="pt-28 md:pt-36 pb-16 px-5 md:px-10 bg-bg-secondary border-b border-border relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, rgba(255,60,0,0.4) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <span className="text-accent text-xs font-bold uppercase tracking-[4px]">
            Get In Touch
          </span>
          <h1 className="font-heading font-black text-5xl md:text-7xl mt-2 mb-4 line-accent">
            Contact Us
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mt-6">
            Questions, collabs, press enquiries — or just want to talk sneakers?
            We&apos;re always listening.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20">
        {/* Form */}
        <div>
          {formState === "success" ? (
            <SuccessState message={message} onReset={() => setFormState("idle")} />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
                    Your Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Alex Chen"
                    className={`w-full bg-bg-card border rounded-xl px-4 py-3.5 text-white placeholder-text-muted text-sm focus:outline-none transition-all duration-200 ${
                      errors.name
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-border focus:border-accent focus:bg-white/5"
                    }`}
                  />
                  {errors.name && <FieldError message={errors.name} />}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
                    Email Address <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full bg-bg-card border rounded-xl px-4 py-3.5 text-white placeholder-text-muted text-sm focus:outline-none transition-all duration-200 ${
                      errors.email
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-border focus:border-accent focus:bg-white/5"
                    }`}
                  />
                  {errors.email && <FieldError message={errors.email} />}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-bg-card border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer text-white"
                >
                  <option value="">Select a topic...</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  className={`w-full bg-bg-card border rounded-xl px-4 py-3.5 text-white placeholder-text-muted text-sm focus:outline-none transition-all duration-200 resize-none ${
                    errors.message
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-border focus:border-accent focus:bg-white/5"
                  }`}
                />
                <div className="flex items-start justify-between mt-1">
                  {errors.message ? (
                    <FieldError message={errors.message} />
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-xs ${
                      form.message.length > 500
                        ? "text-red-400"
                        : "text-text-muted"
                    }`}
                  >
                    {form.message.length}/500
                  </span>
                </div>
              </div>

              {/* Global error */}
              {formState === "error" && message && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <svg
                    className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                  <span className="text-red-400 text-sm">{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={formState === "loading"}
                className="btn-primary-full w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {formState === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6 lg:pt-2">
          {/* Contact cards */}
          {[
            {
              icon: "✉️",
              title: "Email Us",
              lines: ["hello@hypsoul.in", "support@hypsoul.in"],
              sub: "We reply within 24 hours",
            },
            {
              icon: "📍",
              title: "Visit Us",
              lines: ["Hypsoul Store", "Pune, Maharashtra, India"],
              sub: "Open Mon–Sat, 10am–8pm",
            },
            {
              icon: "📞",
              title: "Call / WhatsApp",
              lines: ["+91 7709138858"],
              sub: "Mon–Fri, 10am–7pm IST",
            },
          ].map(({ icon, title, lines, sub }) => (
            <div
              key={title}
              className="flex gap-4 p-5 bg-bg-card border border-border rounded-2xl group hover:border-accent/30 transition-all duration-300"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-accent/10 flex items-center justify-center text-xl group-hover:bg-accent/20 transition-colors">
                {icon}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base mb-1">{title}</h3>
                {lines.map((l) => (
                  <p key={l} className="text-white text-sm">
                    {l}
                  </p>
                ))}
                <p className="text-text-muted text-xs mt-1">{sub}</p>
              </div>
            </div>
          ))}

          {/* Social */}
          <div className="p-5 bg-bg-card border border-border rounded-2xl">
            <h3 className="font-heading font-semibold text-base mb-4">
              Follow The Culture
            </h3>
            <div className="flex gap-3">
              {[
                {
                  label: "Instagram",
                  color: "hover:text-pink-400",
                  href: "https://www.instagram.com/samya.22_/",
                },
                {
                  label: "Twitter",
                  color: "hover:text-sky-400",
                  href: "https://x.com/samyakkharat22",
                },
                { label: "YouTube", color: "hover:text-red-400", href: "#" },
              ].map(({ label, color, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`px-4 py-2.5 bg-bg-elevated border border-border rounded-xl text-text-secondary text-sm font-medium transition-all hover:border-white/30 ${color}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* FAQ link */}
          <div className="p-5 bg-accent/5 border border-accent/20 rounded-2xl">
            <p className="text-sm text-text-secondary leading-relaxed">
              Looking for quick answers? Check our{" "}
              <Link href="/" className="text-accent underline hover:no-underline">
                FAQ page
              </Link>{" "}
              for shipping, returns, sizing, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
      <svg
        className="w-3.5 h-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01"
        />
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
      </svg>
      {message}
    </p>
  );
}

function SuccessState({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-12 gap-6">
      <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <h2 className="font-heading font-bold text-2xl mb-2">
          Message Sent!
        </h2>
        <p className="text-text-secondary max-w-sm">{message}</p>
      </div>
      <button
        onClick={onReset}
        className="btn-secondary-full mt-2"
      >
        Send Another Message
      </button>
    </div>
  );
}
