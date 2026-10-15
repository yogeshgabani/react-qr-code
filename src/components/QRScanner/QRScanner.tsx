import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { loadJsQR, type JsQR } from '../../utils/load-jsqr';
import { scanQRFromImage, type QRImageSource } from '../../utils/scan-image';

export interface QRScanResult {
  data: string;
  timestamp: number;
}

export interface QRScannerHandle {
  pause: () => void;
  resume: () => void;
  toggleTorch: () => Promise<boolean>;
  isTorchOn: () => boolean;
  /**
   * Read a QR from an image (File, Blob, URL, <img>, <canvas>) and report it
   * through `onScan`, as the upload button does. Resolves the decoded text, or
   * `null` when the image has no readable QR.
   */
  scanImage: (source: QRImageSource) => Promise<string | null>;
}

export interface QRScannerProps {
  onScan: (result: QRScanResult) => void;
  onError?: (error: Error) => void;
  /** Defaults to 'environment' (rear camera on mobile). */
  facingMode?: 'user' | 'environment';
  /** Drop duplicate scans of the same value (helps with continuous scanning). Defaults true. */
  deduplicate?: boolean;
  /** Stop scanning after the first successful read. Defaults false. */
  pauseOnScan?: boolean;
  /** Show framing reticle + scan line. Defaults true. */
  showOverlay?: boolean;
  /** Reticle / overlay colour. */
  overlayColor?: string;
  /**
   * Show a "Scan an image" button that reads a QR from a photo or screenshot.
   * It stays available when the camera is blocked or missing. Defaults false.
   */
  allowImageUpload?: boolean;
  className?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
}

export const QRScanner = /* @__PURE__ */ forwardRef<QRScannerHandle, QRScannerProps>(function QRScanner(
  {
    onScan,
    onError,
    facingMode = 'environment',
    deduplicate = true,
    pauseOnScan = false,
    showOverlay = true,
    overlayColor = '#22d3ee',
    allowImageUpload = false,
    className,
    style,
    width = '100%',
    height = 320,
  },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const lastScannedRef = useRef<string>('');
  const pausedRef = useRef(false);
  const torchRef = useRef(false);

  // Keep latest callbacks in refs so the scan loop doesn't restart on every render.
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  onScanRef.current = onScan;
  onErrorRef.current = onError;

  const [error, setError] = useState<Error | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hide the "no QR found" notice after a few seconds.
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(id);
  }, [notice]);

  // An image is an explicit user choice, so it's always reported, even when
  // it repeats the last value or the camera is paused.
  const scanImage = async (source: QRImageSource): Promise<string | null> => {
    let data: string | null;
    try {
      data = await scanQRFromImage(source);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : String(e));
      return null;
    }
    if (data === null) {
      setNotice('No QR code found in that image');
      return null;
    }
    setNotice(null);
    lastScannedRef.current = data;
    onScanRef.current({ data, timestamp: Date.now() });
    if (pauseOnScan) pausedRef.current = true;
    return data;
  };

  useImperativeHandle(ref, () => ({
    pause: () => {
      pausedRef.current = true;
    },
    resume: () => {
      pausedRef.current = false;
    },
    toggleTorch: async () => {
      const track = trackRef.current;
      if (!track) return false;
      // Torch is non-standard but supported by Chrome Android & some others.
      const caps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & {
        torch?: boolean;
      };
      if (!caps.torch) return false;
      torchRef.current = !torchRef.current;
      try {
        await track.applyConstraints({
          advanced: [{ torch: torchRef.current } as MediaTrackConstraintSet & { torch: boolean }],
        });
        return torchRef.current;
      } catch {
        torchRef.current = !torchRef.current;
        return torchRef.current;
      }
    },
    isTorchOn: () => torchRef.current,
    scanImage,
  }));

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let jsQR: JsQR | null = null;

    async function start() {
      // Fetch the decoder while the camera permission prompt is open.
      const decoder = loadJsQR();
      decoder.catch(() => {});
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        trackRef.current = stream.getVideoTracks()[0] ?? null;
        jsQR = await decoder;
        if (cancelled) return;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
          tick();
        }
      } catch (e) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        onErrorRef.current?.(err);
      }
    }

    function tick() {
      if (cancelled) return;
      rafId = requestAnimationFrame(tick);
      if (pausedRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !jsQR) return;
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const code = jsQR(imageData.data, w, h, { inversionAttempts: 'dontInvert' });
      if (code && code.data) {
        if (!deduplicate || code.data !== lastScannedRef.current) {
          lastScannedRef.current = code.data;
          onScanRef.current({ data: code.data, timestamp: Date.now() });
          if (pauseOnScan) pausedRef.current = true;
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      trackRef.current = null;
    };
  }, [facingMode, deduplicate, pauseOnScan]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        borderRadius: 12,
        background: '#000',
        ...style,
      }}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {showOverlay && !error ? (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              left: '15%',
              top: '15%',
              width: '70%',
              height: '70%',
              border: `2px solid ${overlayColor}`,
              borderRadius: 16,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 2,
                background: overlayColor,
                animation: 'qrm-scanline 2.5s linear infinite',
                top: 0,
              }}
            />
          </div>
          <style>{`@keyframes qrm-scanline { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
        </div>
      ) : null}
      {error ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(0,0,0,0.78)',
            color: '#fff',
            padding: 20,
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          Camera unavailable: {error.message}
        </div>
      ) : null}
      {allowImageUpload ? (
        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {notice ? (
            <div
              role="status"
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.78)',
                color: '#fff',
                fontSize: 13,
                textAlign: 'center',
              }}
            >
              {notice}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: 999,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 15V3M12 3L7 8M12 3L17 8M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Scan an image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              // Clear it so picking the same file again still fires onChange.
              e.target.value = '';
              if (file) void scanImage(file);
            }}
          />
        </div>
      ) : null}
    </div>
  );
});
