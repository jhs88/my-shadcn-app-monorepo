FROM node:20-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update \
    && apk add --no-cache libc6-compat \
    && corepack enable
# Set working directory
WORKDIR /app


FROM base AS builder
RUN npm i -g turbo
COPY . .
RUN turbo prune react-router-web --docker


# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm i

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm build


FROM base AS runner
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 reactrouter
USER reactrouter

# Allows pnpm to find its packages
COPY --from=installer --chown=reactrouter:nodejs /app/pnpm*.yaml /app/*.json /app/
COPY --from=installer --chown=reactrouter:nodejs /app/node_modules /app/node_modules
# COPY --from=installer --chown=expressjs:nodejs /app/packages /app/packages

# Copy only the source code for the app, not the entire project
ARG SOURCE_PATH="/app/apps/react-router-web"
COPY --from=installer --chown=reactrouter:nodejs ${SOURCE_PATH}/public ${SOURCE_PATH}/public
COPY --from=installer --chown=reactrouter:nodejs ${SOURCE_PATH}/package.json ${SOURCE_PATH}/
COPY --from=installer --chown=reactrouter:nodejs ${SOURCE_PATH}/node_modules ${SOURCE_PATH}/node_modules
COPY --from=installer --chown=reactrouter:nodejs ${SOURCE_PATH}/build ${SOURCE_PATH}/build

WORKDIR ${SOURCE_PATH}
CMD ["npx", "react-router-serve", "./build/server/index.js"]