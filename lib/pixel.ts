type PixelEvent = "PageView" | "ViewContent" | "Lead" | "CompleteRegistration";

type PixelFn = (event: string, nameOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) => void;

export function trackPixel(event: PixelEvent, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const fbq = (window as { fbq?: PixelFn }).fbq;
  if (!fbq) return;
  fbq("track", event, params);
}
