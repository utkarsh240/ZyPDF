"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DropZone } from "@/components/ui/DropZone";
import { splitPDF, getPageCount, formatBytes, downloadBytes } from "@/lib/pdfUtils";
import toast from "react-hot-toast";
import { Scissors, File, CheckCircle2, Loader2, Plus, X } from "lucide-react";

interface Range { from: number; to: number }

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState<Range[]>([{ from: 1, to: 1 }]);
  const [mode, setMode] = useState<"range" | "every">("range");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<{ name: string; size: number }[]>([]);

  const onFiles = useCallback(async (newFiles: File[]) => {
    const f = newFiles[0];
    if (!f) return;
    setFile(f);
    setResults([]);
    try {
      const count = await getPageCount(f);
      setPageCount(count);
      setRanges([{ from: 1, to: count }]);
    } catch {
      toast.error("Could not read PDF");
    }
  }, []);

  const addRange = () => setRanges((r) => [...r, { from: 1, to: pageCount }]);
  const removeRange = (i: number) => setRanges((r) => r.filter((_, idx) => idx !== i));
  const updateRange = (i: number, field: keyof Range, val: number) => {
    setRanges((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: Math.min(Math.max(1, val), pageCount) } : r));
  };

  const handleSplit = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const activeRanges = mode === "every"
        ? Array.from({ length: pageCount }, (_, i) => ({ from: i + 1, to: i + 1 }))
        : ranges;

      const parts = await splitPDF(file, activeRanges);
      setResults(parts.map((p) => ({ name: p.name, size: p.bytes.length })));

      // Download all
      for (const part of parts) {
        downloadBytes(part.bytes, part.name);
        await new Promise((r) => setTimeout(r, 300));
      }
      toast.success(`Split into ${parts.length} files!`);
    } catch {
      toast.error("Failed to split PDF");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setRanges([{ from: 1, to: 1 }]); setResults([]); };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 to-brand-400/20 blur-3xl rounded-full mix-blend-screen" />
      </div>

      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[0_0_10px_rgba(126,255,0,0.1)] text-sm font-mono px-3 py-1.5 rounded-full mb-4">
          <Scissors className="w-4 h-4" /> Split PDF
        </div>
        <h1 className="font-display tracking-tight text-4xl font-bold text-white mb-3">Extract pages from PDF</h1>
        <p className="text-slate text-lg">Choose page ranges or split every page into its own file.</p>
      </div>

      {!file ? (
        <div className="relative z-10">
          <DropZone onFiles={onFiles} multiple={false} label="Select a PDF to split" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 relative z-10">
          {/* File info */}
          <div className="flex items-center gap-4 bg-black/20 border border-white/5 shadow-sm rounded-xl px-5 py-4 backdrop-blur-sm">
            <File className="w-8 h-8 text-slate-light" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{file.name}</p>
              <p className="text-xs font-mono text-slate mt-0.5 bg-white/5 inline-block px-2 py-0.5 rounded border border-white/5">
                {pageCount} pages · {formatBytes(file.size)}
              </p>
            </div>
            <button onClick={reset} className="text-sm px-3 py-1.5 rounded-md bg-white/5 text-slate-light hover:text-white hover:bg-white/10 border border-white/5 transition-colors">
              Change
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-xl w-fit mx-auto">
            {(["range", "every"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === m
                    ? "bg-white/10 text-white shadow-sm border border-white/5"
                    : "text-slate-light hover:text-slate border border-transparent"
                  }`}
              >
                {m === "range" ? "Custom ranges" : "Extract every page"}
              </button>
            ))}
          </div>

          {/* Range inputs */}
          <AnimatePresence mode="wait">
            {mode === "range" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                {ranges.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4">
                    <span className="text-xs font-mono text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-1 rounded w-16 text-center shadow-[0_0_8px_rgba(126,255,0,0.1)]">Part {i + 1}</span>
                    <span className="text-sm text-slate-light">Pages</span>
                    <input
                      type="number"
                      value={r.from}
                      onChange={(e) => updateRange(i, "from", parseInt(e.target.value) || 1)}
                      min={1} max={pageCount}
                      className="w-20 text-center bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-brand-500/50 text-white transition-colors"
                    />
                    <span className="text-slate text-sm">to</span>
                    <input
                      type="number"
                      value={r.to}
                      onChange={(e) => updateRange(i, "to", parseInt(e.target.value) || 1)}
                      min={1} max={pageCount}
                      className="w-20 text-center bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-brand-500/50 text-white transition-colors"
                    />
                    <span className="text-xs text-slate-light font-mono ml-auto bg-black/20 px-2 py-1 rounded-md border border-white/5">of {pageCount}</span>
                    {ranges.length > 1 && (
                      <button onClick={() => removeRange(i)} className="text-slate-light hover:text-red-400 transition-colors bg-white/5 p-1.5 rounded-md hover:bg-red-500/10">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addRange}
                  className="flex items-center justify-center w-full gap-2 text-sm text-slate-light hover:text-white bg-white/[0.02] border border-white/5 hover:border-white/10 border-dashed rounded-xl py-4 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add another range
                </button>
              </motion.div>
            )}

            {mode === "every" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-6 text-center"
              >
                <p className="text-brand-200 font-medium">
                  Will create <span className="font-mono bg-brand-500/20 px-2 py-0.5 rounded border border-brand-500/30 text-brand-100">{pageCount}</span> separate PDF files, one for each page.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results preview */}
          {results.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-5 backdrop-blur-sm">
              <p className="flex items-center gap-2 text-brand-400 font-medium mb-4">
                <CheckCircle2 className="w-5 h-5 drop-shadow-[0_0_8px_rgba(126,255,0,0.3)]" />
                {results.length} files downloaded successfully
              </p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {results.map((r, i) => (
                  <div key={i} className="flex justify-between text-sm bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                    <span className="font-mono text-white/80">{r.name}</span>
                    <span className="text-brand-400/80 font-mono">{formatBytes(r.size)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="pt-4">
            <button
              onClick={handleSplit}
              disabled={processing}
              className="w-full py-4 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-cream font-display font-bold text-lg rounded-xl transition-all shadow-[0_4px_20px_rgba(126,255,0,0.2)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {processing ? (
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Splitting…
                </span>
              ) : "Split PDF →"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
