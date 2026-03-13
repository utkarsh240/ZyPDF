import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ZyPDF — Free PDF Tools Online",
  description: "Merge, split, and compress PDFs instantly in your browser. No uploads, no servers, 100% private.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#2A323C",
              color: "#ffffff",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "14px",
              borderRadius: "10px",
              padding: "12px 18px",
              border: "1px solid #333D47"
            },
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
