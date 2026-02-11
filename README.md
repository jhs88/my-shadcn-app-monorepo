# turbo shadcn/ui monorepo template

This template is for creating a turbo monorepo with shadcn/ui.

## Getting Started

### Requirements

The following programs are required:

- `node` >= 20
- `pnpm` >= 10
- `java` >= 21
- `docker`
- `git`

The following programs are recommended:

- [`nvm`](https://github.com/nvm-sh/nvm) ([Windows](https://github.com/coreybutler/nvm-windows)) for managing Node.js versions
- [`sdkman`](https://sdkman.io/) for managing Java SDK versions
- [`vscode`](https://code.visualstudio.com/) for a better development experience with plugin integration

#### Installation

```bash
# install node, pnpm, & java
nvm install lts/*

# enable corepack and pnpm
corepack enable

# change to current version
sdkman install java 21.0.6-tem 

# add dependencies & run the project
pnpm i & pnpm run dev
```

## What's inside?

This Turborepo includes the following:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `react-router-web`: a [React Router v7](https://reactrouter.com/) app
- `api`: an [Express](https://expressjs.com/) server
- `@repo/ui`: a React component library made from `shadcn/ui`.
- `@repo/logger`: Isomorphic logger (a small wrapper around console.log)
- `@repo/eslint-config`: ESLint presets
- `@repo/typescript-config`: tsconfig.json's used throughout the monorepo
- `@repo/jest-presets`: Jest configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Docker

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Install dependencies
pnpm install

# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create app_network

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open http://localhost:3000.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

This example includes optional remote caching. In the Dockerfiles of the apps, uncomment the build arguments for `TURBO_TEAM` and `TURBO_TOKEN`. Then, pass these build arguments to your Docker build.

You can test this behavior using a command like:

`docker build -f apps/web/Dockerfile . --build-arg TURBO_TEAM=“your-team-name” --build-arg TURBO_TOKEN=“your-token“ --no-cache`

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting

### UI Library

#### Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

#### Tailwind

Your `globals.css` are already set up to use the components from the `ui` package.

#### Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@repo/ui/components/button";
```
