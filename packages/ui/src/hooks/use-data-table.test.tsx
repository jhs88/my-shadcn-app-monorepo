import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, expect, it, vi } from "vitest";
import type { DataTableFeatures } from "@repo/ui/lib/data-table";
import { useDataTable } from "./use-data-table";

afterEach(cleanup);

type Item = { id: string; name: string };
const data: Item[] = [
  { id: "one", name: "First" },
  { id: "two", name: "Second" },
];
const columns: ColumnDef<DataTableFeatures, Item>[] = [
  {
    id: "name",
    accessorKey: "name",
    enableColumnFilter: true,
    meta: { label: "Name", variant: "text" },
  },
];

it("keeps URL pagination and sorting controlled while selection and visibility update", async () => {
  const onUrlUpdate = vi.fn();
  const { result } = renderHook(
    () =>
      useDataTable({
        data,
        columns,
        pageCount: 3,
        getRowId: (row) => row.id,
      }),
    { wrapper: withNuqsTestingAdapter({ hasMemory: true, onUrlUpdate }) },
  );

  expect(
    result.current.table.getRowModel().rows.map((row) => row.original),
  ).toEqual(data);
  act(() => result.current.table.nextPage());
  await waitFor(() =>
    expect(result.current.table.state.pagination.pageIndex).toBe(1),
  );
  await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
  expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get("page")).toBe("2");

  act(() => result.current.table.getColumn("name")?.toggleSorting(true));
  await waitFor(() =>
    expect(result.current.table.state.sorting).toEqual([
      { id: "name", desc: true },
    ]),
  );
  // Sorting is server-controlled: the hook retains the supplied order.
  expect(result.current.table.getRowModel().rows[0]?.original.id).toBe("one");

  act(() => result.current.table.getRow("one").toggleSelected(true));
  expect(
    result.current.table.getSelectedRowModel().rows.map((row) => row.id),
  ).toEqual(["one"]);
  act(() => result.current.table.getColumn("name")?.toggleVisibility(false));
  expect(result.current.table.getVisibleLeafColumns()).toHaveLength(0);
});

it("reads existing URL state and resets pagination when a filter changes", async () => {
  const onUrlUpdate = vi.fn();
  const { result } = renderHook(
    () =>
      useDataTable({
        data,
        columns,
        pageCount: 3,
        debounceMs: 1,
      }),
    {
      wrapper: withNuqsTestingAdapter({
        hasMemory: true,
        searchParams: "?page=2&perPage=20",
        onUrlUpdate,
      }),
    },
  );
  expect(result.current.table.state.pagination).toEqual({
    pageIndex: 1,
    pageSize: 20,
  });
  act(() => result.current.table.getColumn("name")?.setFilterValue("First"));
  await waitFor(() =>
    expect(result.current.table.state.pagination.pageIndex).toBe(0),
  );
  await waitFor(() =>
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get("name")).toBe(
      "First",
    ),
  );
  expect(result.current.table.state.columnFilters).toEqual([
    { id: "name", value: "First" },
  ]);
});
