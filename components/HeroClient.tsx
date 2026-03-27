"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroClient() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const parallaxEl = heroRef.current.querySelector(".hero-bg") as HTMLElement;
      if (parallaxEl) {
        parallaxEl.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="hero-bg absolute inset-0 -top-20 -bottom-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 60% 50%, rgba(255,60,0,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(255,60,0,0.05) 0%, transparent 60%), #0a0a0a",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Accent orb — smaller on mobile */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,60,0,0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-10 w-full pt-24 pb-12 md:pb-16">
        <div className="max-w-3xl">

          {/* Label */}
          <div
            className="inline-flex items-center gap-3 mb-5 md:mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <div className="w-6 md:w-8 h-[2px] bg-accent" />
            <span className="text-accent text-[10px] md:text-xs font-bold uppercase tracking-[4px]">
              New Collection 2026
            </span>
          </div>

          {/* Heading — significantly smaller on mobile */}
          <h1
            className="font-heading font-black text-[13vw] sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tight animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <span className="block text-white">Hypsoul</span>
            <span className="block text-white/20">Sneaker</span>
            <span className="block gradient-text-accent">Culture</span>
          </h1>

          {/* Sub */}
          <p
            className="mt-5 md:mt-8 text-text-secondary text-sm md:text-xl max-w-xl leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            Premium sneaker drops for those who define their own path.
            Limited editions. Bold silhouettes. Uncompromising quality.
          </p>

          {/* CTAs — full width on mobile */}
          <div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-10 animate-fade-up"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            <Link href="/shop" className="btn-primary-full w-full sm:w-auto justify-center touch-manipulation">
              Shop Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="#featured" className="btn-secondary-full w-full sm:w-auto justify-center touch-manipulation">
              Explore Collection
            </Link>
          </div>

          {/* Scroll cue — hidden on small screens */}
          <div
            className="hidden md:flex items-center gap-3 mt-16 text-text-muted text-xs uppercase tracking-widest animate-fade-in"
            style={{ animationDelay: "1s", animationFillMode: "both" }}
          >
            <div className="w-[1px] h-8 bg-border animate-pulse" />
            Scroll to Explore
          </div>
        </div>
      </div>

      {/* Large Background Text — hidden on mobile to prevent overflow */}
      <div
        className="hidden md:block absolute right-0 bottom-0 font-heading font-black text-[20vw] leading-none text-white/[0.015] select-none pointer-events-none tracking-tighter whitespace-nowrap"
        aria-hidden
      >
        HYPE
      </div>
    </section>
  );
}