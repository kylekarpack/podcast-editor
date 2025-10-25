# Video to Audio Converter

A modern web application that extracts audio from video files directly in your browser. No server uploads required and all processing happens locally using FFmpeg WASM.

## Features

- **Multiple Format Support**: Works with MP4, MOV, AVI, MKV, and more
- **Privacy First**: All processing happens in your browser and files never leave your device
- **Fast & Efficient**: Powered by FFmpeg WebAssembly for high-quality audio extraction
- **Modern UI**: Beautiful, responsive design with dark mode support
- **Real-time Progress**: Visual feedback during audio extraction
- **Built-in Preview**: Listen to your extracted audio before downloading
- **High-Quality Output**: Extracts audio in MP3 format

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm (preferred)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd podcast-editor
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload a Video**: Click on the upload area or drag and drop a video file
2. **Extract Audio**: Click the "Extract Audio" button to start the conversion process
3. **Preview**: Listen to the extracted audio using the built-in player
4. **Download**: Save your audio file in MP3 format

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Audio Processing**: [@ffmpeg/ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm)
- **Package Manager**: npm

## Browser Support

This app requires a modern browser with WebAssembly support:

- Chrome/Edge 87+
- Firefox 89+
- Safari 15.2+

Note: Due to browser security requirements, the app must be served over HTTPS in production (or localhost for development).

## Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

See the [LICENSE](LICENSE) file for details.

## Tips

- **File Size**: For best performance, try to keep video files under 500MB
- **First Load**: The first conversion may take longer as FFmpeg needs to be loaded
- **Audio Quality**: The app uses high-quality MP3 encoding (VBR quality 2)
- **Browser Performance**: Processing large files requires significant memory

## Troubleshooting

**Issue**: FFmpeg fails to load

- **Solution**: Ensure you're using a supported browser and have a stable internet connection for the initial FFmpeg download

**Issue**: Video file won't upload

- **Solution**: Check that your video file is in a supported format (MP4, MOV, AVI, MKV)

**Issue**: Slow processing

- **Solution**: This is normal for large files. Processing happens entirely in your browser, so performance depends on your device's capabilities

## Future Enhancements

- [ ] Support for additional audio formats (WAV, AAC, FLAC)
- [ ] Batch processing multiple files
- [ ] Audio editing capabilities (trim, fade in/out)
- [ ] Audio quality settings
- [ ] Video preview before extraction
- [ ] Drag and drop file upload

---
