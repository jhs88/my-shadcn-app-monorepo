---
name: react-hook-forms
description: Patterns and rules for using react-hook-forms library.
---

This skill covers the patterns and best practices for implementing forms using React Hook Form in the applications.

## Overview

Our forms use React Hook Form with Zod validation and TanStack Query for mutations, following a consistent pattern across all applications. Forms can support both "create" and "update" modes within the same component.

## Core Dependencies

```typescript
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
```

## Basic Form Structure

### 1. Define Schema with Zod

```typescript
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  role: z.string().min(1, "Role is required"),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;
```

### 2. Initialize Form Instance

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
    role: "",
    phone: "",
    isActive: false,
  },
});
```

### 3. Handle Form Modes

For forms that support both create and update modes:

```typescript
const [formMode, setFormMode] = useState<"create" | "update">("create");
const [formModalState, setFormModalState] = useState(false);

function toggleFormModal(mode: "create" | "update", data?: any) {
  if (mode === "create") {
    setFormMode("create");
    form.reset({
      // Default values for new form
      name: "",
      email: "",
      role: "",
      phone: "",
      isActive: false,
    });
  } else {
    setFormMode("update");
    // Pre-fill form with existing data
    if (data) {
      form.reset({
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || "",
        isActive: data.isActive,
      });
    }
  }
  setFormModalState(!formModalState);
}
```

### 4. Form Fields with Controller

Use Controller components for form fields, especially with our UI components:

```tsx
<Controller
  name="name"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field orientation="responsive">
      <FieldLabel>Name</FieldLabel>
      <FieldContent>
        <Input placeholder="Name" type="text" {...field} />
      </FieldContent>
      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  )}
/>

<Controller
  name="role"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field orientation="responsive">
      <FieldLabel>Role</FieldLabel>
      <FieldContent>
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldContent>
      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  )}
/>

<Controller
  name="isActive"
  control={form.control}
  render={({ field }) => (
    <Field orientation="responsive">
      <FieldLabel>Active?</FieldLabel>
      <FieldContent>
        <Select
          onValueChange={(value) => field.onChange(value === "true")}
          value={field.value ? "true" : "false"}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  )}
/>
```

### 5. Mutations with TanStack Query

**Create and Update Mutations:**

```typescript
const { mutate: createEntityMutate, isPending: isCreating } = useMutation({
  mutationFn: (data: FormValues) => createEntity(data),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["entities"] });
    form.reset();
    setFormModalState(false);
    toast.success("Successfully created!");
    router.push("/entities");
  },
  onError: (error) => {
    toast.error(error instanceof Error ? error.message : "Failed to create");
    router.refresh();
  },
});

const { mutate: updateEntityMutate, isPending: isUpdating } = useMutation({
  mutationFn: ({ data, entityId }: { data: FormValues; entityId: string }) =>
    updateEntity(entityId, data),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["entities"] });
    setFormModalState(false);
    toast.success("Successfully updated!");
    router.push("/entities");
  },
  onError: (error) => {
    toast.error(error instanceof Error ? error.message : "Failed to update");
    router.refresh();
  },
});
```

**Delete Mutations:**

```typescript
const { mutate: deleteEntityMutate, isPending: isDeleting } = useMutation({
  mutationFn: async (entityId: string) => {
    await deleteEntity(entityId);
    return entityId;
  },
  onSuccess: async (entityId: string) => {
    toast.success("Successfully deleted!");
    setDeleteModalState(false);
    await queryClient.invalidateQueries({ queryKey: ["entities"] });
    // Update local state if needed
    setEntities((prev) => prev.filter((entity) => entity.id !== entityId));
  },
  onError: (error) => {
    toast.error(error instanceof Error ? error.message : "Failed to delete");
    router.refresh();
  },
});
```

### 6. Form Submission with Mutations

```typescript
function onSubmit(data: FormValues) {
  if (formMode === "create") {
    createEntityMutate(data);
  } else {
    updateEntityMutate({ data, contactId: editingEntity!.id });
  }
}

function deleteEntity(id: string) {
  deleteEntityMutate(id);
}

function grantAccess() {
  if (!accessId) return;
  grantAccessMutate(accessId);
}
```

### 7. Loading States and UI

**Combined Loading States:**

```typescript
const isPending = isCreating || isUpdating || isDeleting;
```

**Button with Loading States:**

```tsx
<SubmitButton 
  disabled={isCreating || isUpdating} 
  pendingText="Saving"
>
  {formMode === "create" ? "Create" : "Update"}
</SubmitButton>

<Modal
  title="Delete Entity"
  description="This entity will be deleted."
  isOpen={deleteModalState}
  onClose={toggleDeleteModal}
  onAction={() => deleteEntity(entityId)}
  onActionButtonText={isDeleting ? "Deleting..." : "Delete"}
/>
```

### 8. Complete Form Component

```tsx
<form onSubmit={form.handleSubmit(onSubmit)}>
  <FieldSet>
    {/* Form fields here */}
  </FieldSet>
  <div className="float-end mt-8">
    <Button onClick={() => setFormModalState(false)} type="button">
      Close
    </Button>
    <SubmitButton
      type="submit"
      className="ms-2"
      disabled={isCreating || isUpdating}
    >
      {isCreating || isUpdating
        ? "Saving..."
        : formMode === "create"
          ? "Create"
          : "Update"
      }
    </SubmitButton>
  </div>
</form>
```

## Modal Integration

Forms are typically wrapped in our Modal component:

```tsx
<Modal
  title={formMode === "create" ? "Add Entity" : "Edit Entity"}
  description=""
  isOpen={formModalState}
  onClose={() => setFormModalState(false)}
  onAction={() => {}}
  onActionButtonText={formMode === "create" ? "Add" : "Update"}
  hideButtons={true}
>
  {/* Form component here */}
</Modal>
```

## Trigger Buttons

Add buttons to trigger the form:

```tsx
// Add button
<Button onClick={() => toggleFormModal("create")}>
  <PlusIcon /> Add Entity
</Button>

// Edit button
<Button onClick={() => toggleFormModal("update", entityData)}>
  <Pencil className="h-4 w-4" /> Edit
</Button>
```

## Validation Patterns

### Required Fields

```typescript
z.string().min(1, "This field is required");
```

### Email Validation

```typescript
z.string().email("Invalid email address").min(1, "Email is required");
```

### Optional Fields

```typescript
z.string().optional();
```

### Boolean Fields

```typescript
z.boolean().optional().default(false);
```

## Best Practices

1. **Always use Zod schemas** for type-safe validation
2. **Use Controller components** for all form fields
3. **Handle both modes** in a single form component
4. **Reset form appropriately** when switching modes
5. **Use TanStack Query mutations** for all data operations
6. **Show loading states** with mutation `isPending` states
7. **Invalidate queries** in mutation success callbacks
8. **Handle errors in mutation `onError` callbacks**
9. **Show toast notifications** for user feedback
10. **Update local state** when needed for immediate UI updates
11. **Use combined loading states** for disabled buttons
12. **Handle async mutations properly** with proper type returns

## Example: Vendor Contacts Form

See `apps/vendor-module-frontend/src/app/(dashboard)/vendors/[vendorId]/tabs/VendorContacts.tsx` for a complete example that demonstrates:

- Single form handling both create and update modes
- TanStack Query mutations for all operations
- Complex validation with role selection
- Integration with Modal component
- Proper loading states and error handling
- User feedback with toast notifications
- Query invalidation after mutations

### Key Features Shown:

```typescript
// Mutations with proper loading states
const { mutate: createContactMutate, isPending: isCreating } = useMutation({...});
const { mutate: updateContactMutate, isPending: isUpdating } = useMutation({...});
const { mutate: removeContactMutate, isPending: isRemoving } = useMutation({...});

// Form submission with mutation
function onSubmit(data: FormValues) {
  if (formMode === "create") {
    createContactMutate(data);
  } else {
    updateContactMutate({ data, contactId: alertId! });
  }
}

// Loading-aware buttons
<SubmitButton
  disabled={isCreating || isUpdating}
>
  {isCreating || isUpdating ? "Saving..." : "Save"}
</SubmitButton>

// Query invalidation in success callbacks
onSuccess: async () => {
  await queryClient.invalidateQueries({
    queryKey: ["vendor-contacts", vendorId],
  });
  toast.success("Operation successful!");
}
```
