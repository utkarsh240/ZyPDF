"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DropZone } from "@/components/ui/DropZone";
import { mergePDFs, formatBytes, downloadBytes } from "@/lib/pdfUtils";
import toast from "react-hot-toast";
import { FilePlus2, CheckCircle2, ArrowUp, ArrowDown, X, Loader2 } from "lucide-react";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState(0);

  const onFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...newFiles.filter((f) => !existing.has(f.name))];
    });
    setDone(false);
  }, []);

  const remove = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const moveUp = (i: number) => {
    if (i === 0) return;
    setFiles((prev) => {
      const arr = [...prev];
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      return arr;
    });
  };

  const moveDown = (i: number) => {
    setFiles((prev) => {
      if (i === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      return arr;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) { toast.error("Add at least 2 PDFs"); return; }
    setProcessing(true);
    try {
      const bytes = await mergePDFs(files);
      setResultSize(bytes.length);
      downloadBytes(bytes, "merged.pdf");
      setDone(true);
      toast.success("Merged successfully!");
    } catch (e) {
      toast.error("Failed to merge PDFs");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFiles([]); setDone(false); setResultSize(0); };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 to-brand-400/20 blur-3xl rounded-full mix-blend-screen" />
      </div>

      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-400 text-sm font-mono px-3 py-1.5 rounded-full mb-4 border border-brand-500/20 shadow-[0_0_10px_rgba(126,255,0,0.1)]">
          <FilePlus2 className="w-4 h-4" /> Merge PDFs
        </div>
        <h1 className="font-display tracking-tight text-4xl font-bold text-white mb-3">
          Combine PDFs into one
        </h1>
        <p className="text-slate text-lg">Upload files, reorder them, then merge.</p>
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center py-16 bg-white/[0.02] rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-brand-400 mb-6 drop-shadow-[0_0_10px_rgba(126,255,0,0.5)]" />
              <h2 className="font-display tracking-tight text-3xl font-bold text-white mb-2">Merged successfully!</h2>
              <p className="text-slate mb-1">Your file was downloaded automatically.</p>
              <p className="font-mono text-sm text-slate-light mb-8 border border-white/10 bg-black/20 px-3 py-1 rounded-full">
                Final Size: <span className="text-white font-medium">{formatBytes(resultSize)}</span>
              </p>
              <button onClick={reset} className="px-8 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all border border-white/5 hover:border-white/10 shadow-sm">
                Merge more PDFs
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" className="space-y-6 relative z-10">
            <DropZone onFiles={onFiles} multiple label="Drop your PDFs here" sublabel="You can add multiple files" />

            {files.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <p className="text-sm font-medium text-slate-light">{files.length} file{files.length > 1 ? "s" : ""} added</p>
                  <p className="text-xs text-slate-light">Drag or use arrows to reorder</p>
                </div>

                <div className="space-y-2">
                  {files.map((file, i) => (
                    <motion.div
                      key={file.name}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center gap-4 bg-black/20 overflow-hidden border border-white/5 rounded-xl pr-2 transition-all hover:bg-white/[0.02] hover:border-white/10"
                    >
                      <div className="bg-white/5 w-10 self-stretch flex items-center justify-center border-r border-white/5">
                        <span className="font-mono text-xs text-slate-light font-medium">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0 py-3">
                        <p className="font-medium text-white/90 text-sm truncate">{file.name}</p>
                        <p className="text-xs text-slate-light font-mono mt-0.5">{formatBytes(file.size)}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveUp(i)}
                          disabled={i === 0}
                          className="w-8 h-8 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-colors text-slate-light flex items-center justify-center border border-white/5"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(i)}
                          disabled={i === files.length - 1}
                          className="w-8 h-8 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-colors text-slate-light flex items-center justify-center border border-white/5"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(i)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors text-slate-light flex items-center justify-center border border-white/5 ml-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleMerge}
                    disabled={processing || files.length < 2}
                    className="w-full py-4 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:hover:bg-brand-500 text-cream font-display font-bold text-lg rounded-xl transition-all shadow-lg shadow-brand-500/20 disabled:shadow-none relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    {processing ? (
                      <span className="flex items-center justify-center gap-3 relative z-10">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Merging…
                      </span>
                    ) : `Merge ${files.length} PDFs →`}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
