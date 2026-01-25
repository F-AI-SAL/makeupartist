"use client";

import { useEffect, useState } from "react";

import { siteConfigClient } from "../site-client";

export function useSiteConfig() {
  const [site, setSite] = useState(siteConfigClient);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await fetch("/api/site");
      if (!response.ok) return;
      const json = await response.json();
      if (json?.data) {
        setSite(json.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { site, isLoading, refresh };
}
