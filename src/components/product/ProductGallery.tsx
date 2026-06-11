import { useState } from "react";
import { ZoomIn } from "lucide-react";

export function ProductGallery({ images, name, swatch }: { images: string[]; name: string; swatch: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="lg:sticky lg:top-28 grid gap-4 lg:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
        {images.map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition ${
              active === i ? "border-champagne shadow-glow" : "border-border opacity-70 hover:opacity-100"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className={`relative order-1 overflow-hidden rounded-[2rem] bg-gradient-to-br ${swatch} aspect-[4/5] shadow-soft lg:order-2`}>
        <div className="bg-gold absolute inset-12 rounded-full blur-3xl opacity-50 animate-glow-pulse" />
        <img
          key={active}
          src={images[active]}
          alt={name}
          width={1024}
          height={1280}
          className="animate-fade-up relative h-full w-full object-cover"
        />
        <button className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full">
          <ZoomIn className="h-4 w-4" />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
