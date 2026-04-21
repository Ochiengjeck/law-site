import Image from "next/image";
import Link from "next/link";

interface Props {
  imageUrl: string;
  badge: string;
  line1: string;
  subtitle: string;
  cta1: string;
  cta2: string;
}

export default function HeroSection({
  imageUrl,
  badge,
  line1,
  subtitle,
  cta1,
  cta2,
}: Props) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src={imageUrl}
        alt={line1}
        fill
        className="object-cover"
        priority
      />


      <div className="absolute inset-0 bg-gradient-to-br from-[#0CB8CC] via-[#0CB8CC]/75 to-[#0CB8CC]/50" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24 text-white">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-gray-900 italic">
          {badge}
        </p>

        <h1 className="mb-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl drop-shadow-sm">
          {line1}
        </h1>

        {/* Gold underline */}
        <div className="w-40 h-0.5 bg-gold mb-6 animate-draw-line" />

        <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
          {subtitle}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="group relative bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-900 transition-all duration-300 hover:bg-gold-dark hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            {cta1}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-900/30 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/services"
            className="group relative border border-white/50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white/15 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0"
          >
            {cta2}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white/50 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}
