import {
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  sortFns,
  stockFeatures,
  tableFeatures,
  type Column as TableColumn,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table";
import type { CSSProperties } from "react";
import type { DataTableColumnMeta } from "@repo/ui/types/data-table";

export const dataTableFeatures = tableFeatures({
  ...stockFeatures,
  filterFns,
  sortFns,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;
export type Table<TData extends RowData> = ReactTable<DataTableFeatures, TData>;
export type Column<TData extends RowData, TValue = unknown> = TableColumn<
  DataTableFeatures,
  TData,
  TValue
>;
export type { RowData };

export function getCommonPinningStyles<TData extends RowData, TValue>({
  column,
}: {
  column: Column<TData, TValue>;
}): CSSProperties {
  const pinned = column.getIsPinned();
  return {
    insetInlineStart:
      pinned === "start" ? `${column.getStart("start")}px` : undefined,
    insetInlineEnd:
      pinned === "end" ? `${column.getAfter("end")}px` : undefined,
    position: pinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: pinned ? 1 : 0,
    background: pinned ? "var(--background)" : undefined,
  };
}
