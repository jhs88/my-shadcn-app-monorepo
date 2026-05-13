# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`** — system-wide ADRs that apply to all contexts.
- **`apps/<context>/docs/adr/`** — context-scoped ADRs for the specific app being worked on.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## File structure

Multi-context monorepo:

```
/
├── CONTEXT-MAP.md              ← points to per-app CONTEXT.md files
├── docs/adr/                   ← system-wide decisions (e.g. pnpm, turbo)
└── apps/
    ├── api/
    │   ├── CONTEXT.md          ← API domain language
    │   └── docs/adr/           ← API-specific decisions
    ├── java-api/
    │   ├── CONTEXT.md          ← Java API domain language
    │   └── docs/adr/           ← Java API-specific decisions
    ├── react-router-web/
    │   ├── CONTEXT.md          ← React Router web app domain
    │   └── docs/adr/           ← web-specific decisions
    └── web/
        ├── CONTEXT.md          ← web app domain
        └── docs/adr/           ← web-specific decisions
```

Shared packages (`packages/ui`, `packages/types`, etc.) are utility layers and typically don't need their own context files unless they develop significant domain language.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/grill-with-docs`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 — but worth reopening because…_
