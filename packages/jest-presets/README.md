<!-- eslint-disable-next-line MD033/no-inline-html -->
# <img src="https://jestjs.io/img/favicon/favicon.ico" width="50" height="50" align="center" /> `@repo/jest-presets`

Jest preset for use in projects. This preset provides a simple way to configure Jest for your project, making it easier to write and run tests.

Jest testing presets providing consistent testing setup across all applications and packages.

## Presets

- **node/jest-preset.mjs**: Node.js environment testing
- **browser/jest-preset.mjs**: Browser environment testing

## Features

- **TypeScript Support**: Full TypeScript compilation in tests
- **Test Environment**: Proper setup for different environments
- **Coverage Configuration**: Standardized coverage reporting
- **Mock Setup**: Common mocking patterns and utilities

## Usage in Projects

```javascript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import { presetNode } from "@repo/jest-presets/node";

export default defineConfig({
  test: {
    globals: presetNode.globals,
    environment: presetNode.environment,
  },
});
```

## Test Patterns

```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test --coverage
```

## Testing Requirements

- Unit tests for all utilities
- Component tests for UI components
- Type checking in CI/CD
- Coverage reporting (90%+ target)