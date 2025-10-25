"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useRef, useState } from "react";
import Download from "./components/Download";
import ErrorMessage from "./components/ErrorMessage";
import Headline from "./components/Headline";
import Info from "./components/Info";
import LoadingMessage from "./components/LoadingMessage";

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
    if (ffmpegRef.current?.loaded) {
      return;
    }

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
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
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
        const blob = new Blob([data as any], { type: "audio/mp3" });
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
        <Headline />

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
              `}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {videoFile ? (
                  <>
                    <svg
                      className="w-16 h-16 mb-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
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
                      viewBox="0 0 24 24">
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
              type="button"
              className={`
                flex-1 py-4 px-6 rounded-xl font-semibold text-white
                transition-all duration-200 transform cursor-pointer
                ${
                  !videoFile || isLoading
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                }
              `}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24">
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
                className="px-6 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200">
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
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {loadingMessage && (
            <LoadingMessage
              loadingMessage={loadingMessage}
              errorMessage={error}
            />
          )}

          {error && <ErrorMessage errorMessage={error} />}

          <Download audioUrl={audioUrl} videoFile={videoFile} />
          <Info />
        </div>
      </div>
    </div>
  );
}
