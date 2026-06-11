import { useRef, useState } from "react";
import before from "@/assets/before.jpg";
import after from "@/assets/after.jpg";

export function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, next)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-[2rem] shadow-glow"
      onMouseDown={(e) => { dragging.current = true; update(e.clientX); }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => { dragging.current = true; update(e.touches[0].clientX); }}
      onTouchMove={(e) => dragging.current && update(e.touches[0].clientX)}
      onTouchEnd={() => (dragging.current = false)}
    >
      <img src={after} alt="After" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before}
          alt="Before"
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }}
        />
      </div>
      <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs uppercase tracking-widest">Before</span>
      <span className="glass absolute right-4 top-4 rounded-full px-3 py-1 text-xs uppercase tracking-widest">After 14d</span>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-background shadow-glow"
        style={{ left: `${pos}%` }}
      >
        <div className="bg-gold absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-charcoal shadow-glow">
          <span className="text-lg leading-none">⇆</span>
        </div>
      </div>
    </div>
  );
}
