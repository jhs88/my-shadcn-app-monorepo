FROM node:24.22.1-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PNPM_HOME:$PATH"

WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY .husky/install.mjs ./.husky/install.mjs
RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare "$(node -p 'require("./package.json").packageManager')" --activate \
    && pnpm add --global "@moonrepo/cli@$(node -p 'require("./package.json").devDependencies["@moonrepo/cli"]')"


FROM base AS skeleton

COPY . .
RUN moon docker scaffold api


FROM base AS build

COPY --from=skeleton /app/.moon/docker/configs/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    moon docker setup \
    && pnpm install --frozen-lockfile --filter api...

COPY --from=skeleton /app/.moon/docker/sources/ .
RUN moon run api:build \
    && moon docker prune


FROM node:24.22.1-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs

COPY --from=build --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=expressjs:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=expressjs:nodejs /app/packages/logger/package.json ./packages/logger/package.json
COPY --from=build --chown=expressjs:nodejs /app/packages/logger/dist ./packages/logger/dist
COPY --from=build --chown=expressjs:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=expressjs:nodejs /app/apps/api/dist ./apps/api/dist

USER expressjs

CMD ["node", "./apps/api/dist/index.js"]
