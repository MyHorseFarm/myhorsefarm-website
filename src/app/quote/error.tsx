"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function QuoteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <h2 className="mb-4 text-2xl font-bold text-stone-800">
          Something went wrong
        </h2>
        <p className="mb-6 text-stone-600">
          We encountered an unexpected error. Please try again or return to the
          homepage.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-green-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
