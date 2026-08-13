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
RUN turbo prune api --docker


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

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN --mount=type=bind,source=.git,target=.git \
    --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
    pnpm build


FROM base AS runner

# First install prod dependencies
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs
USER expressjs

# Be more explicit with what is copied over
# COPY --from=installer /app .

# Copy required prod internal packages
# TODO: Copying internal deps should not be manual process
COPY --from=installer --chown=expressjs:nodejs /app/packages/logger/dist ./packages/logger/dist
COPY --from=installer --chown=expressjs:nodejs /app/packages/logger/package.json ./packages/logger/

# Copy only the source code for the app, not the entire project
ARG APP_PATH="/app/apps/api"
COPY --from=installer --chown=expressjs:nodejs ${APP_PATH}/package.json ${APP_PATH}/package.json
COPY --from=installer --chown=expressjs:nodejs ${APP_PATH}/dist ${APP_PATH}/dist

CMD ["node", "./apps/api/dist/index.js"]