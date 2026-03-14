import Image from "next/image";

interface Props {
  imageUrl: string;
  category: string;
  title: string;
  subtitle: string;
}

export default function PageHero({ imageUrl, category, title, subtitle }: Props) {
  return (
    <section className="relative pt-28 pb-16 px-6 overflow-hidden">
      <Image src={imageUrl} alt={title} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/92 via-navy/75 to-navy/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-transparent to-transparent" />

      {/* Decorative ring */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-gold/8 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-px bg-gold" />
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
            {category}
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight mb-5 max-w-2xl">
          {title}
        </h1>

        {/* Draw-in gold line */}
        <div className="animate-draw-line h-px bg-gold w-48 mb-5" />

        {/* Subtitle */}
        <p className="text-white/75 text-base leading-relaxed max-w-xl">{subtitle}</p>
      </div>
    </section>
  );
}
