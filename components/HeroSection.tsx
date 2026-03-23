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

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24 text-white">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">
          {badge}
        </p>

        <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          {line1}
        </h1>

        <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
          {subtitle}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-navy transition-colors hover:bg-gold-dark"
          >
            {cta1}
          </Link>
          <Link
            href="/services"
            className="border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-navy"
          >
            {cta2}
          </Link>
        </div>
      </div>
    </section>
  );
}
