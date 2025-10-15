import Waveform from "./Waveform";

export default function Download({ audioUrl, videoFile }: { audioUrl: string | null, videoFile: File | null }) {
  const handleDownload = () => {
    if (!audioUrl || !videoFile) return;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = videoFile.name.replace(/\.[^/.]+$/, ".mp3");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return audioUrl ? (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="w-12 h-12 text-green-500 mr-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
              Audio Ready!
            </h3>
            <p className="text-sm text-green-600 dark:text-green-500">
              Your audio file has been extracted successfully
            </p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Download MP3
        </button>
      </div>

      {/* Audio Player */}
      <div className="mt-4">
        <Waveform audioUrl={audioUrl} />
      </div>
    </div>
  ) : null;
}
