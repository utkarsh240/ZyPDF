"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const tools = [
  { label: "Merge", href: "/merge" },
  { label: "Split", href: "/split" },
  { label: "Compress", href: "/compress" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#1E2328]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(126,255,0,0.4)] transition-all">
              {/* Document Outline (White) */}
              <path d="M18 32V18L32 18" stroke="white" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
              <path d="M26 18V8H52L22 48H44" stroke="white" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
              <path d="M52 30V48L38 48" stroke="white" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
              {/* Green Z Overlay */}
              <path d="M16 26H46L20 52H56" stroke="#7EFF00" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
          </div>
          <span className="font-display tracking-tight text-2xl font-semibold text-white">ZyPDF</span>
        </Link>

        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                pathname === t.href
                  ? "bg-brand-500/20 text-brand-400 shadow-sm border border-brand-500/30"
                  : "text-slate hover:text-white hover:bg-white/5"
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
