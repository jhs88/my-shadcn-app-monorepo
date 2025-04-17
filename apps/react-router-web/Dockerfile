FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Set working directory
WORKDIR /app


FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i -g turbo
COPY . .
RUN turbo prune react-router-web --docker


# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
ARG TURBO_API
ENV TURBO_API=$TURBO_API

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN --mount=type=bind,source=.git,target=.git \
    # --mount=type=secret,id=TURBO_TOKEN \
    # TURBO_TOKEN=$(cat /run/secrets/TURBO_TOKEN) pnpm build 
    pnpm build


FROM base AS runner

# First install prod dependencies
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 reactrouter
USER reactrouter

# Copy only the source code for the app, not the entire project
ARG APP_PATH="/app/apps/react-router-web"
COPY --from=installer --chown=reactrouter:nodejs ${APP_PATH}/public ${APP_PATH}/public
COPY --from=installer --chown=reactrouter:nodejs ${APP_PATH}/package.json ${APP_PATH}/
COPY --from=installer --chown=reactrouter:nodejs ${APP_PATH}/build ${APP_PATH}/build

WORKDIR ${APP_PATH}
CMD ["npx", "react-router-serve", "./build/server/index.js"]