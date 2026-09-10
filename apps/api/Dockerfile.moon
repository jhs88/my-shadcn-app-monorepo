FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare pnpm@10.28.0 --activate \
    && pnpm add --global @moonrepo/cli@2.4.6

WORKDIR /app


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


FROM node:20-alpine AS runner

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
