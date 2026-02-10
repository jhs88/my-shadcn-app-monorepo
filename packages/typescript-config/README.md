# <img src="https://www.typescriptlang.org/favicon.ico" width="40" height="40" align="center" /> `@repo/typescript-config`

Shared TypeScript configurations ensuring consistent compiler options and project setup across the monorepo.

## Configurations

- **base.json**: Base TypeScript configuration
- **nextjs.json**: Next.js specific TypeScript settings
- **react-library.json**: Configuration for React component libraries

## Compiler Options

- **Strict Mode**: All strict type checking enabled
- **Module Resolution**: Consistent module resolution strategies
- **Path Mapping**: Standardized import aliases
- **Target Settings**: Modern JavaScript targets with appropriate polyfills

## Usage Examples

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
```

## Shared Path Mappings

- `@/*`: Application source files
- `@repo/ui/*`: UI component library
- `@repo/types/*`: Type definitions
- `~/*`: Public/static files

## Configuration Inheritance

```json
// Application tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/ui/*": ["../../packages/ui/src/*"],
      "@repo/types/*": ["../../packages/types/src/*"]
    }
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```