"use client";

import { useEffect } from "react";
import { trackVisit } from "@/features/analytics/services/analytics.service";

export function VisitTracker() {
  useEffect(() => {
    void trackVisit().catch((error: unknown) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("Visit tracking failed.", error);
      }
    });
  }, []);

  return null;
}
