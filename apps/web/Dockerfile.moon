FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare pnpm@10.28.0 --activate \
    && pnpm add --global @moonrepo/cli@2.4.6

WORKDIR /app


FROM base AS skeleton

COPY . .
RUN moon docker scaffold web


FROM base AS build

ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_API_HOST="http://127.0.0.1:3001"
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST
ENV NEXT_TELEMETRY_DISABLED="1"

COPY --from=skeleton /app/.moon/docker/configs/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    moon docker setup \
    && pnpm install --frozen-lockfile --filter web...

COPY --from=skeleton /app/.moon/docker/sources/ .
RUN moon run web:build


FROM node:24-alpine AS runner

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED="1"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

CMD ["node", "./apps/web/server.js"]
