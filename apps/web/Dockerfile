FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV MOON_TOOLCHAIN_FORCE_GLOBALS=true

RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && npm install --global @moonrepo/cli@2.4.6

WORKDIR /app

FROM base AS skeleton
COPY . .
RUN moon docker scaffold web

FROM base AS build
COPY --from=skeleton /app/.moon/docker/configs .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=skeleton /app/.moon/docker/sources .

ARG NEXT_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

RUN rm -rf apps/web/.next \
    && moon run web:build

FROM node:24-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
CMD ["node", "./apps/web/server.js"]
