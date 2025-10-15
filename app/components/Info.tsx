export default function Info() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        How it works
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            1. Upload Video
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select your video file from your device
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            2. Extract Audio
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We process your video in your browser
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            3. Download
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get your audio file in MP3 format
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          All processing happens in your browser and your files never leave your device
        </p>
      </div>
    </div>
  );
}
