import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import jsQR from 'jsqr';

export interface QRScanResult {
  data: string;
  timestamp: number;
}

export interface QRScannerHandle {
  pause: () => void;
  resume: () => void;
  toggleTorch: () => Promise<boolean>;
  isTorchOn: () => boolean;
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
  className?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
}

export const QRScanner = forwardRef<QRScannerHandle, QRScannerProps>(function QRScanner(
  {
    onScan,
    onError,
    facingMode = 'environment',
    deduplicate = true,
    pauseOnScan = false,
    showOverlay = true,
    overlayColor = '#22d3ee',
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
  }));

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;

    async function start() {
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
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
          tick();
        }
      } catch (e) {
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
      if (!video || !canvas) return;
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
    </div>
  );
});
