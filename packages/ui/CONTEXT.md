# @repo/ui

The shared shadcn/ui component library consumed by both web apps (`apps/web`, `apps/react-router-web`). It exposes stock components, a set of house components, and a six-theme token system.

## Language

**Stock component**:
A component in `packages/ui/src/components/` that is generated or maintained from the shadcn registry and can be re-pulled wholesale.
_Avoid_: base component, shadcn file, stock base component

**House component**:
A component in `packages/ui/src/components/` authored in this repo rather than generated from the registry (e.g. `footer`, `navbar`, `typography`, `submit-button`, `form-card-skeleton`, `table/`). Never re-pulled from the registry.
_Avoid_: custom component, local component

**Base flavor**:
One of the primitive-library variants the shadcn registry ships per component: `radix` (Radix UI), `base` (Base UI), or `aria` (React Aria). This repo is migrating its stock components to the `base` flavor.
_Avoid_: variant, base library (when the registry variant is meant)

**Stock sync**:
The act of re-pulling every stock component from the registry on one chosen base flavor and reconciling the dependency and token changes that come with it.
_Avoid_: update, refresh, upgrade

**Component gallery**:
A dev-only route (kept post-merge) that mounts every stock component in one place, used for theme-rotation smoke checks and as the future visual-regression target.
