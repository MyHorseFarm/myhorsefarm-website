"use client";

import { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from "react";

export interface SignaturePadHandle {
  toDataURL: () => string;
}

interface Props {
  onSignatureChange: (dataUrl: string | null) => void;
  height?: number;
}

const SignaturePad = forwardRef<SignaturePadHandle, Props>(
  function SignaturePad({ onSignatureChange, height = 192 }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawing = useRef(false);
    const [hasSigned, setHasSigned] = useState(false);

    useImperativeHandle(ref, () => ({
      toDataURL() {
        return canvasRef.current?.toDataURL("image/png") || "";
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
    }, []);

    const getPos = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        if ("touches" in e) {
          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      },
      []
    );

    const startDraw = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        isDrawing.current = true;
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setHasSigned(true);
      },
      [getPos]
    );

    const draw = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current) return;
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      },
      [getPos]
    );

    const endDraw = useCallback(() => {
      if (isDrawing.current) {
        isDrawing.current = false;
        const dataUrl = canvasRef.current?.toDataURL("image/png") || "";
        onSignatureChange(dataUrl);
      }
    }, [onSignatureChange]);

    const clear = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      setHasSigned(false);
      onSignatureChange(null);
    }, [onSignatureChange]);

    return (
      <>
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair"
            style={{ touchAction: "none", height: `${height}px` }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {hasSigned ? "Signature captured" : "Draw your signature above"}
          </p>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      </>
    );
  }
);

export default SignaturePad;
