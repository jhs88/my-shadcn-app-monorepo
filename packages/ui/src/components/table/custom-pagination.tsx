"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { cn } from "@repo/ui/lib/utils";
import { type Table } from "@tanstack/react-table";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface CustomPaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  totalItems: number;
  pageSizeOptions?: number[];
}

export function CustomPagination<TData>({
  table,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: CustomPaginationProps<TData>) {
  const pageCount = table.getPageCount();

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
        className,
      )}
      {...props}
    >
      {/* Left status */}
      <div className="text-muted-foreground flex-1 whitespace-nowrap text-sm">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of {totalItems}{" "}
            row(s) selected.
          </>
        ) : (
          <>{totalItems} row(s) total.</>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              const newSize = Number(val);
              onPageSizeChange(newSize);
              onPageChange(0);
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          {totalItems > 0 ? (
            <>
              Page {page + 1} of {pageCount}
            </>
          ) : (
            <>Page 0 of 0</>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => onPageChange(0)}
            disabled={page === 0}
          >
            <ChevronsLeft />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount - 1}
          >
            <ChevronRight />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => onPageChange(pageCount - 1)}
            disabled={page >= pageCount - 1}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
