# Conversor - Local File Converter

A powerful, privacy-focused file converter that runs entirely in your browser. Convert images, videos, and documents locally without ever uploading your files to a server.

## Features

- **100% Client-Side**: All processing happens on your device. Zero data upload.
- **AI Background Removal (Experimental)**: High-quality background removal using the `briaai/RMBG-1.4` model, running entirely in the browser.
- **Multi-Format Support**:
  - **Images**: Convert between JPG, PNG, and WebP.
  - **Videos**: Convert to MP4, WebM, and GIF.
  - **Documents**: Convert images/text to PDF.
- **Granular Control**:
  - Adjust quality (for images).
  - Custom resolution (Width/Height) with aspect ratio maintenance.
  - **Target Size**: Set a maximum file size (MB/KB) and let the app auto-optimize quality.
  - **Frame Rate (FPS)**: Control smoothness for video conversions.
- **Batch Processing**: Queue multiple files and convert them all at once or individually.
- **Drag & Drop**: Intuitive interface for easy file selection.

## Tech Stack

- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS** (Styling & Animations)
- **Framer Motion** (Smooth UI transitions)
- **Zustand** (State Management)
- **FFmpeg.wasm** (Video processing in browser)
- **@huggingface/transformers** (AI-powered background removal)
- **Canvas API** (Image processing & compositing)
- **jsPDF** (Document generation)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/conversor.git
    cd conversor
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Usage

1.  **Drop files** into the main area.
2.  **Select format** for each file or globally.
3.  Click the **Settings (Gear)** icon on a file to adjust:
    - Target Resolution (Width/Height).
    - Limit Max Size (MB).
    - Quality/FPS.
4.  Hit **Convert** or **Start All**.
5.  **Download** your processed files.

## License

MIT
