import { PDFDocument } from "pdf-lib";

/** Merge multiple PDF files into one */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  return merged.save();
}

/** Split PDF into separate files by page ranges */
export async function splitPDF(
  file: File,
  ranges: { from: number; to: number }[]
): Promise<{ name: string; bytes: Uint8Array }[]> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const results: { name: string; bytes: Uint8Array }[] = [];

  for (let i = 0; i < ranges.length; i++) {
    const { from, to } = ranges[i];
    const doc = await PDFDocument.create();
    const indices = Array.from(
      { length: to - from + 1 },
      (_, k) => from - 1 + k
    ).filter((idx) => idx >= 0 && idx < src.getPageCount());
    const pages = await doc.copyPages(src, indices);
    pages.forEach((p) => doc.addPage(p));
    results.push({
      name: `split_part_${i + 1}.pdf`,
      bytes: await doc.save(),
    });
  }

  return results;
}

/** Compress PDF by re-saving with pdf-lib (removes redundancy) */
export async function compressPDF(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  // Re-save with object streams for size reduction
  return pdf.save({ useObjectStreams: true, addDefaultPage: false });
}

/** Get page count from a PDF file */
export async function getPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  return pdf.getPageCount();
}

/** Format file size */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Trigger browser download of bytes */
export function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
