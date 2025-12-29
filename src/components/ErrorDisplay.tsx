'use client';

interface ErrorDisplayProps {
  message: string;
  retry?: () => void;
}

export default function ErrorDisplay({ message, retry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-400 mb-1">Error</h3>
          <p className="text-red-300">{message}</p>
          {retry && (
            <button
              onClick={retry}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorDisplay message={message} />
      </div>
    </div>
  );
}
