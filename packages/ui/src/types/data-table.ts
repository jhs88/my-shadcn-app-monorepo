import type { ComponentType } from "react";
import type { dataTableConfig } from "@repo/ui/config/data-table";

export interface Option {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
  count?: number;
}

export interface DataTableColumnMeta {
  label?: string;
  placeholder?: string;
  variant?: (typeof dataTableConfig.filterVariants)[number];
  options?: Option[];
  range?: [number, number];
  unit?: string;
}

export interface ExtendedColumnSort<TData> {
  id: Extract<keyof TData, string>;
  desc: boolean;
}
