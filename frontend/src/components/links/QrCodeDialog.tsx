"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "react-hot-toast";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

const SIZE_OPTIONS = [256, 512, 1024] as const;
const COLOR_OPTIONS = [
  { label: "Classic", dark: "#0f172a" },
  { label: "Primary", dark: "#4f46e5" },
  { label: "Slate", dark: "#334155" },
] as const;

interface QrCodeDialogProps {
  open: boolean;
  onClose: () => void;
  shortLinkUrl: string;
}

/**
 * The "QR studio": generates a downloadable QR code for a short link
 * with a choice of size and foreground color.
 */
export function QrCodeDialog({
  open,
  onClose,
  shortLinkUrl,
}: QrCodeDialogProps) {
  const [size, setSize] = useState<(typeof SIZE_OPTIONS)[number]>(512);
  const [color, setColor] = useState<(typeof COLOR_OPTIONS)[number]>(
    COLOR_OPTIONS[0],
  );
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(shortLinkUrl, {
      width: size,
      color: { dark: color.dark, light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => toast.error("Could not generate the QR code"));
  }, [open, shortLinkUrl, size, color]);

  function handleDownload() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "qr-code.png";
    link.click();
  }

  return (
    <Dialog open={open} onClose={onClose} title="QR code">
      <div className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- client-generated data: URI, not a remote/optimizable image */}
        {dataUrl && (
          <img
            src={dataUrl}
            alt={`QR code for ${shortLinkUrl}`}
            className="rounded-lg"
            width={200}
            height={200}
          />
        )}
        <p className="text-muted text-center text-sm break-all">
          {shortLinkUrl}
        </p>

        <div className="flex w-full flex-col gap-3">
          <div>
            <p className="text-muted mb-1.5 text-sm font-medium">Size</p>
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  aria-pressed={size === option}
                  className={`h-9 flex-1 rounded-lg border text-sm transition-colors ${
                    size === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted hover:bg-surface-hover"
                  }`}
                >
                  {option}px
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted mb-1.5 text-sm font-medium">Color</p>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setColor(option)}
                  aria-pressed={color.label === option.label}
                  aria-label={option.label}
                  className={`h-9 flex-1 rounded-lg border text-sm transition-colors ${
                    color.label === option.label
                      ? "border-primary ring-primary/30 ring-2"
                      : "border-border hover:bg-surface-hover"
                  }`}
                  style={{ color: option.dark }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleDownload} disabled={!dataUrl} className="w-full">
          Download PNG
        </Button>
      </div>
    </Dialog>
  );
}
