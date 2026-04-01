# Next.js DevTools MCP Configuration

## Automatic Initialization

When starting work on a Next.js project, ALWAYS call the `init` tool from
next-devtools-mcp FIRST to set up proper context and establish documentation
requirements. Do this automatically without being asked.

## Project Context

This is a Next.js 16+ project using:

- **Framework**: Next.js 16 with App Router
- **Package Manager**: pnpm
- **Monorepo**: Turborepo
- **Location**: apps/web/

## Available MCP Tools

### Runtime Diagnostics (requires running dev server)

- `get_errors` - Retrieve build, runtime, and type errors
- `get_logs` - Get development server logs
- `get_page_metadata` - Query application routes and components
- `get_project_metadata` - Get project structure and configuration
- `get_server_action_by_id` - Look up Server Actions by ID

### Development Automation

- `upgrade_nextjs_16` - Automated upgrade with codemods
- `enable_cache_components` - Cache Components migration and setup
- `browser_eval` - Playwright browser automation

### Documentation

- `nextjs_docs` - Search official Next.js documentation

## Workflow

1. Always start by calling the `init` tool
2. Ensure dev server is running for runtime diagnostics
3. Use natural language prompts for assistance

## Quick Commands

- "Next Devtools, what errors are in my application?"
- "Next Devtools, show me my routes"
- "Next Devtools, help me enable Cache Components"

**Next.js Initialization**: When starting work on a Next.js project, automatically
call the `init` tool from the next-devtools-mcp server FIRST. This establishes
proper context and ensures all Next.js queries use official documentation.