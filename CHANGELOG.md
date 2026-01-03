# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Settings Panel**: Added a slide-in panel showing global preferences (FPS, Quality) and a list of all supported conversion formats.
- **Format Selection**: Users can now select output formats (WebP/PNG/JPG for images, GIF/WebM/MP4 for videos).
- **UI Enhancements**: Implemented a "Premium" dark mode with glassmorphism, radial gradients, and polished components.
- **Refined Controls**: Unified number inputs with custom `NumberControl` component featuring integrated spinners and units.
- **Enhanced Settings**: Improved Target Size selection with nested MB/KB toggle for cleaner UI.
- **Copyright Footer**: Added "© 2026 Federico Rojas" to the footer.
- **Branding**: Added custom logo (transparent PNG) and favicon.
- Created main UI layout (`App.tsx`) with premium styling (Glassmorphism, gradients).
- Implemented core conversion logic:
  - Video: `ffmpeg.wasm` via Web Worker.
  - Image: Native Canvas API.
  - Document: `jspdf`.

### Planning
- Created initial project roadmap and task list.
- Drafted technical proposal including stack, UI design, and worker architecture.
