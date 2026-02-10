<!-- eslint-disable-next-line MD033/no-inline-html -->
# <img src="https://raw.githubusercontent.com/eslint/eslint/46eea6d1cbed41d020cb76841ebba30710b0afd0/docs/src/static/favicon.png" width="50" height="50" align="center" /> `@repo/eslint-config`

Shared eslint configuration for the workspace.

Standardized ESLint configurations ensuring consistent code quality and style across all applications and packages.

## Configurations

- **base.js**: Base ESLint rules for all projects
- **next.js**: Next.js specific rules and configurations
- **react-internal.js**: Internal React component rules

## Features

- **TypeScript Integration**: Full type checking support
- **React Rules**: React best practices and common patterns
- **Import/Export**: Organized import and export conventions
- **Code Quality**: Best practices for maintainability
- **Performance**: Performance-related rules and optimizations

## Usage in Projects

```json
// package.json
{
  "eslintConfig": "@repo/eslint-config/next.js"
}
```

```javascript
// eslint.config.js
import baseConfig from "@repo/eslint-config/base";
import reactConfig from "@repo/eslint-config/react-internal";

export default [baseConfig, reactConfig];
```