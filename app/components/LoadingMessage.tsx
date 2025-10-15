export default function LoadingMessage({
  loadingMessage,
  errorMessage,
}: {
  loadingMessage: string;
  errorMessage: string | null;
}) {
  return (
    <div className={`p-4 rounded-lg mb-6 ${errorMessage ? "hidden" : ""}`}>
      <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
        {loadingMessage}
      </p>
    </div>
  );
}
