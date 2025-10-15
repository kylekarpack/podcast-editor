"use client";

import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import Info from "./components/Info";
import Download from "./components/Download";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current?.loaded) return;

    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });

    ffmpeg.on("progress", ({ progress: prog }) => {
      setProgress(Math.round(prog * 100));
    });

    setLoadingMessage("Loading FFmpeg...");

    try {
      const baseURL =
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      setLoadingMessage("FFmpeg loaded successfully!");
    } catch (err) {
      console.error("Error loading FFmpeg:", err);
      throw new Error("Failed to load FFmpeg");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setAudioUrl(null);
      setError(null);
      setProgress(0);
    }
  };

  const extractAudio = async () => {
    if (!videoFile) return;

    setIsLoading(true);
    setError(null);
    setProgress(0);
    setAudioUrl(null);

    try {
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current!;

      setLoadingMessage("Reading video file...");
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      setLoadingMessage("Extracting audio...");
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-vn",
        "-acodec",
        "libmp3lame",
        "-q:a",
        "2",
        "output.mp3",
      ]);

      setLoadingMessage("Preparing download...");
      try {
        const data = await ffmpeg.readFile("output.mp3");
        const blob = new Blob([data], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);

        setAudioUrl(url);
        setLoadingMessage("Audio extraction complete!");
      } catch (err) {
        console.error("Error reading output file:", err);
        setError("File contained no audio");
      }

      // Clean up
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp3");
    } catch (err) {
      console.error("Error extracting audio:", err);
      console.log("test1");
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while extracting audio"
      );
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const resetUpload = () => {
    setVideoFile(null);
    setAudioUrl(null);
    setError(null);
    setProgress(0);
    setLoadingMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Video to Audio Converter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Extract audio from your video files instantly in your browser
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6">
          {/* Upload Area */}
          <div className="mb-8">
            <label
              htmlFor="video-upload"
              className={`
                flex flex-col items-center justify-center w-full h-64 
                border-2 border-dashed rounded-xl cursor-pointer
                transition-all duration-200
                ${
                  videoFile
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {videoFile ? (
                  <>
                    <svg
                      className="w-16 h-16 mb-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {videoFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-16 h-16 mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      MP4, MOV, AVI, MKV (MAX. 500MB)
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="video-upload"
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={extractAudio}
              disabled={!videoFile || isLoading}
              className={`
                flex-1 py-4 px-6 rounded-xl font-semibold text-white
                transition-all duration-200 transform
                ${
                  !videoFile || isLoading
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Extract Audio"
              )}
            </button>

            {videoFile && (
              <button
                onClick={resetUpload}
                disabled={isLoading}
                className="px-6 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Reset
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {isLoading && progress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Loading Message */}
          {loadingMessage && (
            <div className={`p-4 rounded-lg mb-6 ${error ? "hidden" : ""}`}>
              <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                {loadingMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <Download audioUrl={audioUrl} videoFile={videoFile} />
          <Info />
        </div>
      </div>
    </div>
  );
}
