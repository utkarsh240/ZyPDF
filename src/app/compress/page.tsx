"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DropZone } from "@/components/ui/DropZone";
import { compressPDF, formatBytes, downloadBytes } from "@/lib/pdfUtils";
import toast from "react-hot-toast";
import { Shrink, File, ArrowRight, Download, RotateCcw, Loader2 } from "lucide-react";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ originalSize: number; newSize: number; bytes: Uint8Array } | null>(null);

  const onFiles = useCallback((newFiles: File[]) => {
    setFile(newFiles[0] ?? null);
    setResult(null);
  }, []);

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 150);

    try {
      const bytes = await compressPDF(file);
      clearInterval(interval);
      setProgress(100);
      setResult({ originalSize: file.size, newSize: bytes.length, bytes });
    } catch {
      clearInterval(interval);
      toast.error("Compression failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBytes(result.bytes, `compressed_${file?.name ?? "output.pdf"}`);
    toast.success("Downloaded!");
  };

  const reset = () => { setFile(null); setResult(null); setProgress(0); };

  const saving = result
    ? Math.max(0, Math.round((1 - result.newSize / result.originalSize) * 100))
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 to-brand-300/20 blur-3xl rounded-full mix-blend-screen" />
      </div>

      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-400 border border-brand-500/20 text-sm font-mono px-3 py-1.5 rounded-full mb-4 shadow-[0_0_10px_rgba(126,255,0,0.1)]">
          <Shrink className="w-4 h-4" /> Compress PDF
        </div>
        <h1 className="font-display tracking-tight text-4xl font-bold text-white mb-3">
          Reduce your PDF file size
        </h1>
        <p className="text-slate text-lg">Optimise PDFs by removing redundant data while maintaining quality.</p>
      </div>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
            <DropZone onFiles={onFiles} multiple={false} label="Select a PDF to compress" />
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 relative z-10"
          >
            {/* Result card */}
            <div className="bg-white/[0.02] border border-brand-500/30 shadow-[0_0_30px_rgba(126,255,0,0.05)] rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />

              <div className="text-center mb-10 relative z-10">
                <div className="mx-auto w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mb-4 border border-brand-500/30 shadow-[0_0_15px_rgba(126,255,0,0.2)]">
                  <Shrink className="w-8 h-8 text-brand-400" />
                </div>
                <h2 className="font-display tracking-tight text-4xl font-bold text-white">
                  {saving > 0 ? `Reduced by ${saving}%` : "Optimised!"}
                </h2>
              </div>

              <div className="flex items-center justify-center gap-6 text-center relative z-10">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 w-40">
                  <p className="text-xs text-slate-light font-mono mb-2 uppercase tracking-wider">Original</p>
                  <p className="font-mono font-bold text-white/90 text-xl">{formatBytes(result.originalSize)}</p>
                </div>

                <div className="flex bg-white/5 p-2 rounded-full border border-white/5">
                  <ArrowRight className="text-slate w-5 h-5" />
                </div>

                <div className="bg-brand-500/10 border border-brand-500/30 shadow-[0_0_15px_rgba(126,255,0,0.1)] rounded-2xl p-5 w-40">
                  <p className="text-xs text-brand-400 font-mono mb-2 uppercase tracking-wider">Compressed</p>
                  <p className="font-mono font-bold text-brand-300 text-xl">{formatBytes(result.newSize)}</p>
                </div>
              </div>

              {/* Size bar comparison */}
              <div className="mt-10 space-y-3 relative z-10">
                <div className="flex justify-between text-xs font-mono text-slate-light px-1">
                  <span>Compression ratio</span>
                  <span className="text-brand-400">{saving}% saved space</span>
                </div>
                <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-brand-500 rounded-full shadow-[0_0_10px_rgba(126,255,0,0.5)]"
                    initial={{ width: "100%" }}
                    animate={{ width: `${100 - saving}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <button
                onClick={handleDownload}
                className="flex-1 py-4 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-cream font-display font-bold text-lg rounded-xl transition-all shadow-lg shadow-brand-500/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <Download className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Download compressed PDF</span>
              </button>
              <button
                onClick={reset}
                className="px-6 py-4 flex items-center gap-2 bg-white/5 border border-white/5 text-slate-light rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                title="Start over"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 relative z-10">
            {/* File preview */}
            <div className="flex items-center gap-4 bg-black/20 border border-white/5 shadow-sm rounded-xl px-5 py-4 backdrop-blur-sm">
              <File className="w-8 h-8 text-slate-light" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{file.name}</p>
                <p className="text-xs font-mono text-slate mt-0.5 bg-white/5 inline-block px-2 py-0.5 rounded border border-white/5">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button onClick={reset} className="text-sm px-3 py-1.5 rounded-md bg-white/5 text-slate-light hover:text-white hover:bg-white/10 border border-white/5 transition-colors">
                Change
              </button>
            </div>

            {/* Processing state */}
            {processing && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-500/10 border border-brand-500/20 rounded-xl px-6 py-5 space-y-3 backdrop-blur-sm">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-brand-300 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Compressing data...
                  </span>
                  <span className="font-mono text-brand-400">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-brand-500 rounded-full shadow-[0_0_8px_rgba(126,255,0,0.6)]"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
              </motion.div>
            )}

            <div className="pt-2">
              <button
                onClick={handleCompress}
                disabled={processing}
                className="w-full py-4 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:hover:bg-brand-500 text-cream font-display font-bold text-lg rounded-xl transition-all shadow-lg shadow-brand-500/20 disabled:shadow-none relative overflow-hidden group"
              >
                {!processing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                )}
                {processing ? (
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Optimising…
                  </span>
                ) : "Compress PDF →"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
