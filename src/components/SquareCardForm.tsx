"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// Square Web Payments SDK types
interface SquarePayments {
  card: (options?: Record<string, unknown>) => Promise<SquareCard>;
}
interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
  destroy: () => void;
}
interface SquareGlobal {
  payments: (appId: string, locationId: string) => Promise<SquarePayments>;
}

declare global {
  interface Window {
    Square?: SquareGlobal;
  }
}

export interface SquareCardFormHandle {
  tokenize: () => Promise<string>;
}

interface Props {
  squareAppId: string;
  squareLocationId: string;
}

const SquareCardForm = forwardRef<SquareCardFormHandle, Props>(
  function SquareCardForm({ squareAppId, squareLocationId }, ref) {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState("");
    const cardRef = useRef<SquareCard | null>(null);

    useImperativeHandle(ref, () => ({
      async tokenize() {
        if (!cardRef.current) {
          throw new Error("Card form not ready. Please wait.");
        }
        const result = await cardRef.current.tokenize();
        if (result.status !== "OK" || !result.token) {
          const msg =
            result.errors?.map((e) => e.message).join(", ") ||
            "Card tokenization failed";
          throw new Error(msg);
        }
        return result.token;
      },
    }));

    useEffect(() => {
      let cancelled = false;

      const init = async () => {
        // Load script if not present
        if (!window.Square) {
          await new Promise<void>((resolve, reject) => {
            const existing = document.querySelector(
              'script[src*="squarecdn.com/v1/square.js"]'
            );
            if (existing) {
              if (window.Square) {
                resolve();
                return;
              }
              existing.addEventListener("load", () => resolve());
              return;
            }
            const script = document.createElement("script");
            const isSandbox = squareAppId.startsWith("sandbox-");
            script.src = isSandbox
              ? "https://sandbox.web.squarecdn.com/v1/square.js"
              : "https://web.squarecdn.com/v1/square.js";
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("Failed to load Square SDK"));
            document.head.appendChild(script);
          });
        }

        if (cancelled) return;

        const payments = await window.Square!.payments(
          squareAppId,
          squareLocationId
        );
        const card = await payments.card({ includeInputLabels: true });
        if (cancelled) {
          card.destroy();
          return;
        }
        await card.attach("#square-card-container");
        cardRef.current = card;
        setReady(true);
      };

      init().catch((err) => {
        if (!cancelled)
          setError(err.message || "Failed to initialize card form");
      });

      return () => {
        cancelled = true;
        if (cardRef.current) {
          cardRef.current.destroy();
          cardRef.current = null;
        }
        setReady(false);
      };
    }, [squareAppId, squareLocationId]);

    return (
      <>
        <div
          id="square-card-container"
          className="min-h-[50px] border border-gray-300 rounded-lg p-3"
        />
        {!ready && !error && (
          <p className="text-sm text-gray-500">Loading secure card form...</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </>
    );
  }
);

export default SquareCardForm;
