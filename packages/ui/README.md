# <img src="https://ui.shadcn.com/favicon.ico" width="40" height="40" align="center" /> @repo/ui

A `shadcn-ui` based UI library for React. It includes components like buttons, inputs, and more.
Universal components should be created here and then imported into application directories.

## TODO

- compile ts to js for compatibility with common.js environments

## Key Features

- **shadcn/ui Foundation**: Modern, accessible components
- **Tailwind CSS Styling**: Consistent design system
- **TypeScript Support**: Full type safety
- **Theme System**: Dark/light mode support
- **Form Integration**: React Hook Form ready
- **Data Tables**: Advanced table components with filtering and pagination
- **Charts**: Recharts integration for data visualization

## Core Components

- **Forms**: Input, Select, Textarea, Checkbox, Radio
- **Layout**: Card, Dialog, Collapsible, Sidebar
- **Navigation**: Menubar, Dropdown Menu, Breadcrumb
- **Feedback**: Toast, Badge, Alert, Spinner
- **Data Display**: Table, Skeleton, Avatar
- **Advanced**: Data Table with faceted filtering, Date Filter, Pagination

## Hooks and Utilities

```typescript
// Data table hook
const table = useDataTable({
  data,
  columns,
  filters,
  pagination,
});

// Multistep form hook
const { step, next, previous, goTo } = useMultistepForm(totalSteps);

// Debounce hook
const debouncedValue = useDebounce(value, 300);
```

## Usage Examples

```typescript
// Import components
import { Button, Input, DataTable } from "@repo/ui";

// Use in components
export default function MyComponent() {
  return (
    <div>
      <Input placeholder="Enter text" />
      <Button variant="default">Submit</Button>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
```

## Export Structure

```
@repo/ui/
├── components/*     # React components
├── hooks/*         # Custom React hooks
├── lib/*          # Utility functions
├── types/*        # TypeScript definitions
├── config/*       # Configuration files
└── styles/*       # Global CSS and themes
```

## Best Practices

- **Composition**: Favor composition over inheritance
- **Accessibility**: Ensure WCAG compliance
- **Responsive**: Mobile-first responsive design
- **Customization**: Allow theme and style customization

## Integration Patterns

```typescript
// Use with proper theming
export default function MyPage() {
  return (
    <ThemeProvider>
      <DataTable data={data} columns={columns} />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Item</Button>
        </DialogTrigger>
        <DialogContent>
          {/* Form content */}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
```
