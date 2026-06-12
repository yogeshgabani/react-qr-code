import { useCallback, useEffect, useState } from 'react';

export interface QRScanEvent {
  id: string;
  value: string;
  timestamp: number;
  device: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser: string;
  os: string;
  language: string;
  referrer: string;
}

export interface QRAnalyticsSummary {
  totalScans: number;
  uniqueScans: number;
  byDevice: Record<string, number>;
  byBrowser: Record<string, number>;
  byOS: Record<string, number>;
  byDate: Record<string, number>;
  byHour: Record<string, number>;
  recent: QRScanEvent[];
}

const STORAGE_KEY = 'qrm-analytics-events';

function detectDevice(ua: string): QRScanEvent['device'] {
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile';
  if (/Macintosh|Windows|Linux/i.test(ua)) return 'desktop';
  return 'unknown';
}

function detectBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\//i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua)) return 'Safari';
  return 'Other';
}

function detectOS(ua: string): string {
  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}

function readEvents(): QRScanEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as QRScanEvent[]) : [];
  } catch {
    return [];
  }
}

function summarise(events: QRScanEvent[]): QRAnalyticsSummary {
  const byDevice: Record<string, number> = {};
  const byBrowser: Record<string, number> = {};
  const byOS: Record<string, number> = {};
  const byDate: Record<string, number> = {};
  const byHour: Record<string, number> = {};
  const uniqueIds = new Set<string>();
  for (const e of events) {
    uniqueIds.add(e.id);
    byDevice[e.device] = (byDevice[e.device] ?? 0) + 1;
    byBrowser[e.browser] = (byBrowser[e.browser] ?? 0) + 1;
    byOS[e.os] = (byOS[e.os] ?? 0) + 1;
    const d = new Date(e.timestamp);
    const date = d.toISOString().slice(0, 10);
    byDate[date] = (byDate[date] ?? 0) + 1;
    const hour = String(d.getHours()).padStart(2, '0');
    byHour[hour] = (byHour[hour] ?? 0) + 1;
  }
  return {
    totalScans: events.length,
    uniqueScans: uniqueIds.size,
    byDevice,
    byBrowser,
    byOS,
    byDate,
    byHour,
    recent: events.slice(-10).reverse(),
  };
}

export interface UseQRAnalyticsResult {
  summary: QRAnalyticsSummary;
  track: (id: string, value: string) => void;
  clear: () => void;
}

/**
 * Client-side scan analytics persisted to localStorage. Production deployments
 * typically need a server: pair this hook with your own ingest endpoint for
 * accurate cross-device numbers. The local data is useful for demos & QA.
 */
export function useQRAnalytics(): UseQRAnalyticsResult {
  const [events, setEvents] = useState<QRScanEvent[]>(() => readEvents());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setEvents(readEvents());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((next: QRScanEvent[]) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  }, []);

  const track = useCallback(
    (id: string, value: string) => {
      if (typeof window === 'undefined') return;
      const ua = window.navigator.userAgent;
      const event: QRScanEvent = {
        id,
        value,
        timestamp: Date.now(),
        device: detectDevice(ua),
        browser: detectBrowser(ua),
        os: detectOS(ua),
        language: window.navigator.language,
        referrer: window.document.referrer || 'direct',
      };
      setEvents((prev) => {
        const next = [...prev, event].slice(-500); // cap history
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clear = useCallback(() => {
    setEvents([]);
    persist([]);
  }, [persist]);

  return { summary: summarise(events), track, clear };
}
