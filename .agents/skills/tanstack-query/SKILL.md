---
name: tanstack-query
---

The skill is for consistently using useSuspenseQuery from TanStack Query (React
Query) in a standardized way across all frontend applications. Here's the
pattern observed:

## Basic Usage Pattern

```javascript
const { data } = useSuspenseQuery({
  queryKey: ["query-key", parameter1, parameter2],
  queryFn: () => fetchFunction(parameter1, parameter2),
});
```

## Common Examples from the Codebase

1. Simple data fetching:

```javascript
const { data: bids } = useSuspenseQuery({
  queryKey: ["bids", filters, type],
  queryFn: () => fetchBids(filters, type),
});
```

2. Specific data:

```javascript
const { data } = useSuspenseQuery({
  queryKey: ["key", id],
  queryFn: () => fetchData(id),
});
```

## Key Characteristics Observed

1. Consistent naming: The hook result is destructured with data as the variable
   name (e.g., const { data: w9Data } = useSuspenseQuery(...))
2. Query key patterns:
   - Simple strings for static queries: ["vendors"]
   - Parameterized keys for dynamic queries: ["vendor", vendorId]
   - Complex keys with multiple parameters: ["bids", filters, type]
3. Integration with React Query utilities:
   - Often used alongside getQueryClient for cache invalidation on both server
     and client-side
   - Combined with useMutation for CRUD operations
   - Used in conjunction with error handling and loading states
4. Error handling:
   - Some components check for errors explicitly (like in
     flh-traffic-module-frontend)
   - Often combined with toast notifications for user feedback
5. Testing patterns:
   - Mocked in test files using vi.fn() to simulate data fetching
   - Tests typically mock the query key and return expected data structures

## Common Use Cases

1. Loading data on page load: Used in component initialization to fetch required
   data
2. Content-specific information: Fetching data for specific records.
3. Table/list data: Loading data for dynamic grids and tables

## Best Practices Observed

Looking at the existing codebase, you should also ensure that:

1. Query keys are consistently structured with a predictable pattern that
   includes the resource type and identifiers
2. Error handling is implemented where appropriate, particularly in traffic/FLH
   modules
3. Integration with mutations is common - query invalidation happens after
   mutations to keep data fresh
4. The query is properly prefetched on the server-side in the page component (as
   shown in `page.tsx` files):

```javascript
void queryClient.prefetchQuery({
  queryKey: ["resource", id],
  queryFn: () => fetchResource(id),
});
```

5. Use the same query key pattern that's already established in the codebase:
   - ["resource", id] for resource data
   - This maintains consistency with how other queries are handled

## Key Points to Remember

1. Always use proper import: Import getQueryClient() from
   "~/app/get-query-client" over useSuspenseQuery from "@tanstack/react-query".
2. Use consistent query keys: Follow the pattern ["resource", id]
3. Error handling: The suspense query will automatically handle loading states
   and errors
4. Type safety: Make sure your action function returns proper data types that
   match your expectations
5. Integration with existing code: The modules already have a pattern of using
   this approach, so maintain consistency

# useMutation Pattern

This project uses a standardized pattern for data mutations (create, update,
delete operations) with TanStack Query. The pattern ensures consistent error
handling, loading states, and cache management.

## Basic Mutation Structure

```javascript
const { mutate: actionMutate, isPending: isActionPending } = useMutation({
  mutationFn: (params) => actionFunction(params),
  onSuccess: async () => {
    // Success handling
    toast.success("Success message");

    // Refresh related queries
    await queryClient.invalidateQueries({
      queryKey: ["query-key", parameter],
    });

    // Update UI state and navigate
    setLocalState(updatedValue);
    closeModal();
    router.push(`/path/${parameter}`);
  },
  onError: (error) => {
    // Error handling
    console.error("Error:", error);
    toast.error(
      error instanceof Error ? error.message : "Generic error message",
    );
    router.refresh();
  },
  onSettled: () => {
    // Cleanup
    form.reset();
  },
});
```

## Key Principles

1. **Consistent Naming**:

   - Mutation functions follow `actionMutate` pattern
   - Loading states use descriptive names like `isCreating`, `isUpdating`
   - Destructure from useMutation for clarity

2. **Error Handling**:

   - Always check `error instanceof Error` before accessing properties
   - Provide generic fallback messages
   - Log errors and show user-friendly notifications

3. **Success Flow**:

   - Toast notifications for immediate feedback
   - Query invalidation to refresh data
   - Local state updates as needed
   - Navigation or modal management

4. **Loading States**:
   - Individual states per mutation
   - Combine states for complex operations
   - Disable UI elements during mutations

## Common Patterns

### Form Integration

```javascript
<form
  onSubmit={(e) => {
    e.preventDefault();
    mutationMutate({ param1: value1, param2: value2 });
  }}
>
  {/* Form fields */}
  <SubmitButton disabled={isPending}>Submit</SubmitButton>
</form>
```

### Query Invalidation

```javascript
// Single query
await queryClient.invalidateQueries({
  queryKey: ["resource", id],
});

// Multiple related queries
await queryClient.invalidateQueries({ queryKey: ["resource", id] });
await queryClient.invalidateQueries({ queryKey: ["related-data", id] });
```

### Combined Loading States

```javascript
const isProcessing = isCreating || isUpdating || isDeleting;
```

## Best Practices

1. **Type Safety**: Use TypeScript interfaces for mutation parameters
2. **Server Actions**: Use "use server" directive for mutation functions
3. **Consistent Messaging**: Follow predictable error message patterns
4. **Loading Feedback**: Disable buttons and show indicators during mutations
5. **Form Cleanup**: Use `onSettled` for form resets and cleanup
6. **Navigation**: Handle redirects appropriately after mutations

## Custom Hooks (Optional)

For reusable mutations, extract to custom hooks:

```javascript
export const useCreateResource = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: createResource,
    onSuccess: (data) => {
      toast.success("Successfully created resource.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create resource");
    },
  });
```

## Key Characteristics

1. **Consistent Naming**:

   - Mutation function: `actionMutate` (e.g., `createContactMutate`,
     `updateContactMutate`)
   - Loading state: `isActionPending` (e.g., `isCreating`, `isUpdating`)
   - Destructured from useMutation for clarity

2. **Error Handling**:

   - Always check `error instanceof Error` before accessing `error.message`
   - Provide generic fallback messages
   - Log errors to console for debugging
   - Show user-friendly toast notifications

3. **Success Flow**:

   - Toast notifications for immediate feedback
   - Query invalidation to refresh related data
   - Local state updates when needed
   - Navigation or modal closing

4. **Loading States**:
   - Individual loading states per mutation
   - Combined loading states for complex operations:
     `const isPending = isCreating || isUpdating || isRemoving;`
   - UI elements disabled during mutations

## Common Examples from Codebase

### Create Mutation (VendorContacts.tsx)

```javascript
const { mutate: createContactMutate, isPending: isCreating } = useMutation({
  mutationFn: (data: ContactFormValues) =>
    addVendorContact(vendorId, {
      name: data.name,
      role: data.role,
      phone: data.phone || "",
      cellNumber: data.cellNumber || "",
      email: data.email,
      isPrimary: data.isPrimary ?? false,
    }),
  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["vendor-contacts", vendorId],
    });
    const primaryContactCount = await countPrimaryContacts(vendorId);
    setHasPrimaryVendorContact(primaryContactCount === 1);
    setFormModalState(false);
    toast.success("Successfully added vendor contact!");
    router.push(`/vendors/${vendorId}`);
  },
  onError: (error) => {
    console.error("Error updating contact:", error);
    toast.error(
      error instanceof Error ? error.message : "Error saving contact!",
    );
    router.refresh();
  },
  onSettled: () => form.reset(),
});
```

### Delete Mutation Pattern

```javascript
const { mutate: removeContactMutate, isPending: isRemoving } = useMutation({
  mutationFn: async (contactId: string) => {
    await removeVendorContact(contactId);
    return contactId;
  },
  onSuccess: async (contactId: string) => {
    toast.success("Successfully removed vendor contact!");

    await queryClient.invalidateQueries({
      queryKey: ["vendor-contacts", vendorId],
    });

    const primaryContactCount = await countPrimaryContacts(vendorId);
    setHasPrimaryVendorContact(primaryContactCount === 1);
    router.push(`/vendors/${vendorId}`);
  },
  onError: (error) => {
    console.error("Error removing contact:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to remove contact",
    );
    router.refresh();
  },
  onSettled: () => setRemoveModalState(false),
});
```

### Form Integration Pattern

```javascript
<form
  onSubmit={(e) => {
    e.preventDefault();
    mutationMutate({ param1: value1, param2: value2 });
  }}
>
  <Field>
    <FieldContent>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        required
        placeholder="Enter notes..."
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
        <SubmitButton variant="destructive" disabled={isPending}>
          Submit Action
        </SubmitButton>
      </DialogFooter>
    </FieldContent>
  </Field>
</form>
```

## Query Invalidation Patterns

1. **Targeted Invalidation**: Always use specific query keys

   ```javascript
   await queryClient.invalidateQueries({
     queryKey: ["vendor-documents", vendorId],
   });
   ```

2. **Multiple Related Queries**: When mutations affect multiple data types

   ```javascript
   await queryClient.invalidateQueries({
     queryKey: ["vendor-documents", vendorId],
   });
   await queryClient.invalidateQueries({ queryKey: ["audit-logs", vendorId] });
   await queryClient.invalidateQueries({
     queryKey: ["vendor-document-counts", vendorId],
   });
   ```

3. **Sequential Operations**: Perform invalidations in order, sometimes with
   additional async operations

## Best Practices

1. **Type Safety**: Define proper TypeScript interfaces for mutation parameters
2. **Server Actions**: All mutation functions should be server actions with "use
   server" directive
3. **Consistent Error Messages**: Use predictable error message patterns
4. **Loading State Management**: Disable buttons and show loading indicators
   during mutations
5. **Form Reset**: Use `onSettled` callback to clean up form state
6. **Navigation**: Use `router.push()` or `router.refresh()` appropriately after
   mutations

## Custom Hook Pattern (Advanced)

For reusable mutations, create custom hooks:

```javascript
export const useCreateBid = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: createBid,
    onSuccess: (data) => {
      toast.success("Successfully created bid.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create bid", {
        duration: Infinity,
        action: {
          label: "Dismiss",
          onClick: () => console.log("Error was dismissed"),
        },
      });
    },
  });
```

## Summary

The implementation in the modules follows a consistent pattern where:

- Server-side prefetching is used to pre-load queries
- Client-side getQueryClient or useSuspenseQuery is used for components that
  need to fetch data
- useMutation follows standardized patterns for all CRUD operations
- Query keys follow a predictable naming convention
- The same fetch action function is used consistently

This approach ensures proper hydration, loading states, consistent caching
behavior, and maintainable mutation logic across the application.
