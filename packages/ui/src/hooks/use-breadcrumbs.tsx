"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface UseBreadcrumbOptions {
  routeMapping?: Record<string, string>;
  includeHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
  formatLabel?: (segment: string) => string;
}

/** A hook that generates breadcrumbs based on the current path */
export function useBreadcrumb({
  routeMapping = {},
  includeHome = true,
  homeLabel = "Home",
  homeHref = "/",
  formatLabel,
}: UseBreadcrumbOptions = {}) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const items: BreadcrumbItem[] = [];

    // Add home item if requested
    if (includeHome) {
      items.push({ label: homeLabel, href: homeHref });
    }

    // Skip further processing for home page
    if (!pathname || pathname === "/") {
      return items;
    }

    // Split the pathname into segments and remove empty strings
    const segments = pathname.split("/").filter(Boolean);

    // Generate breadcrumbs from path segments
    segments.forEach((segment, index) => {
      // Build the href for this breadcrumb
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      // Use the mapping if available, otherwise format the segment
      const label =
        routeMapping[segment] ||
        (formatLabel
          ? formatLabel(segment)
          : segment.charAt(0).toUpperCase() + segment.slice(1));

      items.push({ label, href });
    });

    return items;
  }, [pathname, routeMapping, includeHome, homeLabel, homeHref, formatLabel]);

  return breadcrumbs;
}
