"use client";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { FilePlus2, Scissors, Shrink } from "lucide-react";

const tools = [
  {
    href: "/merge",
    icon: FilePlus2,
    name: "Merge PDFs",
    desc: "Combine multiple PDFs into one document. Drag to reorder pages.",
    iconColor: "text-brand-400 bg-brand-500/10",
    tag: "Most popular",
  },
  {
    href: "/split",
    icon: Scissors,
    name: "Split PDF",
    desc: "Extract pages or split a PDF into multiple files by page ranges.",
    iconColor: "text-brand-400 bg-brand-500/10",
    tag: null,
  },
  {
    href: "/compress",
    icon: Shrink,
    name: "Compress PDF",
    desc: "Reduce PDF file size while maintaining the best possible quality.",
    iconColor: "text-brand-400 bg-brand-500/10",
    tag: null,
  },
];

function ToolCard({ tool, i }: { tool: typeof tools[0], i: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
      className="h-full"
    >
      <Link href={tool.href} className="block h-full">
        <div
          className="group relative h-full rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:border-white/10 overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight Effect */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  450px circle at ${mouseX}px ${mouseY}px,
                  rgba(255,255,255,0.06),
                  transparent 80%
                )
              `,
            }}
          />

          {tool.tag && (
            <span className="absolute top-4 right-4 text-[10px] uppercase font-mono tracking-wider font-semibold bg-brand-500/20 text-brand-400 px-2.5 py-1 rounded-full border border-brand-500/30">
              {tool.tag}
            </span>
          )}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${tool.iconColor} border border-brand-500/20 shadow-[0_0_15px_rgba(126,255,0,0.1)] group-hover:shadow-[0_0_20px_rgba(126,255,0,0.2)] transition-shadow`}>
            <tool.icon className="w-5 h-5" />
          </div>
          <h2 className="font-display tracking-tight text-2xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
            {tool.name}
          </h2>
          <p className="text-slate text-sm leading-relaxed">{tool.desc}</p>
          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-slate group-hover:text-brand-400 transition-colors">
            <span>Launch tool</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/40 via-brand-300/20 to-brand-500/40 blur-3xl rounded-full mix-blend-screen" />
      </div>

      {/* Hero */}
      <section className="pt-32 pb-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/80 text-xs font-mono mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(126,255,0,0.8)] animate-pulse" />
            100% Client-Side Processing
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            The premium toolkit
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-white">
              for your PDFs.
            </span>
          </h1>
          <p className="text-slate text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Merge, split, and compress PDFs with blazing speed.
            <br className="hidden md:block" /> No servers, no subscriptions, zero data collection.
          </p>
        </motion.div>
      </section>

      {/* Tool cards */}
      <section className="grid md:grid-cols-3 gap-6 pb-24 relative z-10">
        {tools.map((tool, i) => (
          <ToolCard key={tool.href} tool={tool} i={i} />
        ))}
      </section>

      {/* Privacy banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-10 md:p-16 text-center mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
        <div className="relative z-10">
          <h3 className="font-display tracking-tight text-3xl font-bold text-white mb-4">
            Private by design.
          </h3>
          <p className="text-slate max-w-xl mx-auto text-lg leading-relaxed">
            Your files never leave your device. All processing is powered by WebAssembly securely within your browser instance.
          </p>
        </div>
      </section>
    </div>
  );
}
