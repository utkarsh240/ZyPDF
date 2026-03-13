"use client";
import { useDropzone } from "react-dropzone";
import { clsx } from "clsx";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
}

export function DropZone({ onFiles, multiple = true, label, sublabel }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFiles,
    accept: { "application/pdf": [".pdf"] },
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
        isDragActive
          ? "drop-zone-active"
          : "border-paper-dark hover:border-slate-light hover:bg-paper/50"
      )}
    >
      <input {...getInputProps()} />
      <div className="text-5xl mb-5">📄</div>
      <p className="font-display text-2xl font-bold text-ink mb-2">
        {label ?? (isDragActive ? "Drop your PDFs here" : "Select PDF files")}
      </p>
      <p className="text-slate text-sm mb-5">
        {sublabel ?? "or drag and drop them here"}
      </p>
      <button
        type="button"
        className="px-7 py-3 bg-rust hover:bg-rust-light text-white font-medium rounded-xl transition-colors"
      >
        Browse files
      </button>
      <p className="text-xs text-slate-light mt-4 font-mono">PDF files only</p>
    </div>
  );
}
