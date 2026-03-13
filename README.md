# ZyPDF

ZyPDF is a modern, client-side PDF utility application built with Next.js and React. It provides a suite of essential PDF manipulation tools—including merging, splitting, and compressing—directly within the browser. 

By leveraging WebAssembly and client-side processing, ZyPDF ensures that sensitive documents never leave the user's device, providing a secure, high-performance alternative to traditional server-based PDF tools.

## Architecture & Technology Stack

The application is built on a modern frontend stack emphasizing performance, user experience, and aesthetic design:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Directory)
- **UI Library**: [React 18](https://react.dev/)
- **PDF Processing**: [pdf-lib](https://pdf-lib.js.org/) (Core manipulation) & [pdf.js](https://mozilla.github.io/pdf.js/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [react-dropzone](https://react-dropzone.js.org/)

## Features

### 1. Merge PDFs
Allows users to combine multiple PDF documents into a single file.
- **Interactive Interface**: Users can drag and drop files to reorder them before merging.
- **Client-Side Validation**: Ensures only valid PDF files are processed.
- **Instant Download**: Merged files are generated in-memory and downloaded immediately without server roundtrips.

### 2. Split PDFs
Enables users to extract specific pages or separate a document completely.
- **Flexible Modes**: Users can extract custom, disjointed page ranges or extract every single page into its own individual PDF.
- **Batch Downloading**: Automatically processes and downloads resulting files sequentially.
- **Document Analysis**: Instantly reads and displays the total page count of the uploaded document.

### 3. Compress PDFs
Reduces the file size of PDF documents while attempting to retain quality.
- **Optimization Strategy**: Utilizes `pdf-lib` object streams and removes redundant internal data structures.
- **Visual Analytics**: Provides a clear interface showing original versus compressed file sizes, including a percentage calculation of space saved.
- **Progress Simulation**: Includes UI feedback during processing.

## Security & Privacy

Privacy is a core architectural decision of ZyPDF. The application does not include a backend database or file storage system. 

All operations utilizing `pdf-lib` are executed entirely within the browser's JavaScript engine. Files are loaded into memory (`ArrayBuffer`), processed, and then returned as a `Blob` directly to the user's local filesystem. No telemetry or file content is transmitted over the network.

## Design System

The ZyPDF UI features a premium, dark-mode aesthetic.

- **Color Palette**: A deep slate background (`#1E2328`) contrasted by vibrant, neon-green brand accents (`#7EFF00`). Let's ensure high contrast and a modern "developer-first" feel.
- **Typography**: Employs geometric and highly legible fonts, including `Inter` for primary display headings, `Outfit` for body text, and `JetBrains Mono` for data and numerical readouts.
- **Micro-interactions**: Extensive use of Framer Motion for layout transitions, "glassmorphism" (backdrop blurs), and dynamic Spotlight hover effects on interactive cards.

## Application Structure

- `src/app/`: Next.js App Router definitions. Contains the main layout, global CSS, homepage (`page.tsx`), and individual route folders for each tool (`/merge`, `/split`, `/compress`).
- `src/components/ui/`: Reusable UI components, primarily the `DropZone` component used across all tools.
- `src/components/layout/`: Global structure components (`Header.tsx` and `Footer.tsx`).
- `src/lib/`: Core logic and utility functions. `pdfUtils.ts` houses the WebAssembly/pdf-lib implementations for merging, splitting, compressing, and downloading files.

## Credits

Developed by Utkarsh Kumar gupta.
