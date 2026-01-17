export type UtmPayload = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
};

const STORAGE_KEY = "gg_utm";

export function readUtmFromStorage(): UtmPayload | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UtmPayload;
  } catch {
    return null;
  }
}

export function captureUtmFromUrl() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const payload: UtmPayload = {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_term: params.get("utm_term") || undefined,
    utm_content: params.get("utm_content") || undefined,
    fbclid: params.get("fbclid") || undefined,
    gclid: params.get("gclid") || undefined,
    referrer: document.referrer || undefined
  };

  const hasValue = Object.values(payload).some(Boolean);
  if (hasValue) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
}
