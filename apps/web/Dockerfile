FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Set working directory
WORKDIR /app


FROM base AS builder
ARG TURBO_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=$TURBO_TELEMETRY_DISABLED
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i -g turbo
COPY . .
RUN turbo prune web --docker


# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i

# Build the project
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
ARG TURBO_API
ENV TURBO_API=$TURBO_API

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

ARG TURBO_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=$TURBO_TELEMETRY_DISABLED

ARG NEXT_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED

ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

RUN --mount=type=bind,source=.git,target=.git \
    --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
    pnpm build


FROM base AS runner

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs \ 
    && adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ARG NEXT_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED

CMD ["node", "./apps/web/server.js"]
