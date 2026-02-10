# @repo/ui - Agent Guide

Comprehensive shadcn/ui component library with 60+ reusable components for the MMG platform.

## Tech Stack

- **Base**: shadcn/ui components
- **Primitives**: Radix UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Component Categories

- **Form Components**: Input, Select, Checkbox, Radio, Textarea (React Hook Form integration)
- **Data Display**: Table (TanStack Table), Card, Badge, Avatar, Progress, Charts (Recharts)
- **Navigation**: Sidebar, Header, Breadcrumb, Tabs, Pagination, Menu
- **Feedback**: Toast, Alert, Dialog, Drawer, Loading states, Error boundaries
- **Layout**: Grid, Flex, Container, Section, Responsive utilities

## Important Patterns

### Component Structure

```typescript
export { Component } from "./component";
export { ComponentProps } from "./component.types";
export { useComponent } from "./component.hook";
```

### Styling Conventions

- Tailwind CSS classes exclusively
- shadcn/ui design tokens
- Mobile-first responsive design
- Consistent spacing (4px base unit)

### Props Interface

- Extend HTML element props
- Use discriminated unions for variants
- Include proper TypeScript generics
- Forward refs properly

## Development Guidelines

### Adding New Components

1. Check if component exists in shadcn/ui
2. Follow naming conventions
3. Include TypeScript definitions
4. Add prop documentation
5. Create examples if needed

### Customization

- CSS variables for theming
- Variant system with class names
- Size and color prop patterns
- Maintain backward compatibility

### Performance

- Lazy load heavy components
- React.memo for expensive renders
- Proper key props for lists
- Optimize re-renders with useCallback

## File Structure

- `src/components/`: Component implementations
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions
- `src/styles/`: Global styles and themes

## Usage Examples

```typescript
import { Button, Input, Card } from '@repo/ui'

<Button variant="primary" size="md">Submit</Button>
<Input {...field} error={error} />
```

## Important Notes

- Fully typed components
- Dark/light theme support
- ARIA compliant accessibility
- Mobile-responsive design
- Cross-browser compatible