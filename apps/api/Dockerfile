FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# moon cannot install its managed Node toolchain on Alpine. Use the image's
# Node and the repository's package-manager version instead.
ENV MOON_TOOLCHAIN_FORCE_GLOBALS=true

RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && npm install --global @moonrepo/cli@2.4.6

WORKDIR /app


FROM base AS skeleton

COPY . .
RUN moon docker scaffold api


FROM base AS build

# Manifests and moon configuration form the dependency-install cache layer.
COPY --from=skeleton /app/.moon/docker/configs .
# `javascript.installDependencies` is intentionally false in this workspace so
# moon never installs behind pnpm's back. Preserve that seam inside Docker too.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# The source skeleton contains api plus its internal dependency closure.
COPY --from=skeleton /app/.moon/docker/sources .

# Prove the build does not succeed because the host supplied stale artifacts.
RUN rm -rf apps/api/dist packages/logger/dist \
    && moon run api:build \
    && moon docker prune


FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs

# Preserve pnpm's workspace symlink structure after moon focuses production
# dependencies, then copy only the application and internal runtime package.
COPY --from=build --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=expressjs:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=expressjs:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=expressjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=build --chown=expressjs:nodejs /app/packages/logger/package.json ./packages/logger/package.json
COPY --from=build --chown=expressjs:nodejs /app/packages/logger/dist ./packages/logger/dist

USER expressjs

CMD ["node", "./apps/api/dist/index.js"]
