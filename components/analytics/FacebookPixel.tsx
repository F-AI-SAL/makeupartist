"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { trackPixel } from "../../lib/pixel";

type FacebookPixelProps = {
  pixelId?: string;
};

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pixelId) return;
    trackPixel("PageView");
    if (
      pathname.startsWith("/services") ||
      pathname.startsWith("/pricing") ||
      pathname.startsWith("/offers") ||
      pathname.startsWith("/offer") ||
      pathname.startsWith("/portfolio") ||
      pathname.startsWith("/blog")
    ) {
      trackPixel("ViewContent");
    }
  }, [pathname, pixelId]);

  if (!pixelId) return null;

  return (
    <>
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
