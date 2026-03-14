"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Stat {
  value: string;
  label: string;
}

interface Props {
  imageUrl: string;
  badge: string;
  line1: string;
  typingWords: string[];
  subtitle: string;
  cta1: string;
  cta2: string;
  stats: Stat[];
}

function useTypewriter(
  words: string[],
  typingSpeed = 72,
  deleteSpeed = 38,
  pause = 2400
) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    if (words.length === 0) return;
    const word = words[wordIdx % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < word.length) {
        timeout = setTimeout(
          () => setText(word.slice(0, text.length + 1)),
          typingSpeed
        );
      } else {
        timeout = setTimeout(() => setPhase("deleting"), pause);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, wordIdx, words, typingSpeed, deleteSpeed, pause]);

  return text;
}

export default function HeroSection({
  imageUrl,
  badge,
  line1,
  typingWords,
  subtitle,
  cta1,
  cta2,
  stats,
}: Props) {
  const typed = useTypewriter(typingWords);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <Image
        src={imageUrl}
        alt="Hero background"
        fill
        className="object-cover object-center scale-105"
        priority
      />

      {/* Layered overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/92 via-navy/75 to-navy/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />

      {/* Decorative rotating rings */}
      <div
        className="absolute -top-40 -right-40 w-[680px] h-[680px] rounded-full border border-gold/10 animate-spin-slow pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-16 -right-16 w-[480px] h-[480px] rounded-full border border-gold/6 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 w-full pt-20 pb-6">

        {/* Badge */}
        <div className="animate-fade-up flex items-center gap-4 mb-6" style={{ animationDelay: "0ms" }}>
          <div className="w-10 h-px bg-gold" />
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
            {badge}
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-0 leading-none tracking-tighter">
          {/* Line 1 — ghost outline text */}
          <span
            className="animate-fade-up block text-outline text-[clamp(2.5rem,7vw,5.5rem)] font-black"
            style={{ animationDelay: "180ms" }}
          >
            {line1}
          </span>

          {/* Line 2 — typewriter in gold */}
          <span
            className="animate-fade-up block text-[clamp(1.5rem,4vw,3rem)] font-black mt-2 min-h-[1.2em]"
            style={{ animationDelay: "500ms" }}
          >
            <span className="text-white/50 font-light mr-3">—</span>
            <span className="text-gold">{typed}</span>
            <span className="cursor-blink text-gold ml-0.5">|</span>
          </span>
        </h1>

        {/* Animated draw-in gold line */}
        <div className="mt-5 mb-5">
          <div className="animate-draw-line h-px bg-gold w-64" />
        </div>

        {/* Subtitle */}
        <p
          className="animate-fade-up text-white/75 text-lg max-w-sm leading-relaxed mb-8"
          style={{ animationDelay: "700ms" }}
        >
          {subtitle}
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-wrap gap-5 items-center"
          style={{ animationDelay: "850ms" }}
        >
          <Link
            href="/contact"
            className="bg-gold text-navy font-bold px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-gold-dark transition-colors"
          >
            {cta1}
          </Link>
          <Link
            href="/services"
            className="relative group inline-flex items-center gap-2 text-white/80 font-medium text-sm hover:text-white transition-colors"
          >
            {cta2}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>

      {/* Stats bar — fused to hero bottom */}
      <div className="relative z-10 border-t border-white/10 bg-navy-dark/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-around gap-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="text-center px-6">
                <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                <p className="text-gold/60 text-[10px] mt-1.5 uppercase tracking-[0.22em]">{stat.label}</p>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-8 bg-gold/20 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 right-8 hidden md:flex flex-col items-center gap-3">
        <span
          className="text-white/30 text-[10px] tracking-[0.3em] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <div className="animate-scroll-drop relative w-px h-9 bg-white/10" />
      </div>
    </section>
  );
}
