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
      <div className="absolute inset-0 bg-[#0CB8CC]/55" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-gray-900 italic">
          {category}
        </p>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight mb-4 max-w-2xl drop-shadow-sm">
          {title}
        </h1>

        {/* Draw-in gold line */}
        <div className="animate-draw-line h-0.5 bg-gold w-40 mb-5" />

        {/* Subtitle */}
        <p className="text-white/80 text-base leading-relaxed max-w-xl">{subtitle}</p>
      </div>
    </section>
  );
}
