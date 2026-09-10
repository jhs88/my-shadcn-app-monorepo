---
"@repo/ui": major
---

Migrate all stock components to the shadcn Base UI flavor (base-nova): Radix primitives replaced by @base-ui/react, `asChild` replaced by the `render` prop, `TooltipProvider delayDuration` renamed to `delay`, drawer rebuilt on `@base-ui/react/drawer` (vaul removed), progress restructured into multi-part composition, recharts upgraded to v3, react-day-picker to v10. `form` remains Radix-based (no base variant exists), so `@radix-ui/react-label` and `@radix-ui/react-slot` remain dependencies.
