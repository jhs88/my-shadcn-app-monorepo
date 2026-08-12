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
RUN moon docker scaffold react-router-web

FROM base AS build
COPY --from=skeleton /app/.moon/docker/configs .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=skeleton /app/.moon/docker/sources .

ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

RUN rm -rf apps/react-router-web/build \
    && moon run react-router-web:build \
    && moon docker prune

FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 reactrouter

COPY --from=build --chown=reactrouter:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=reactrouter:nodejs /app/apps/react-router-web/node_modules ./apps/react-router-web/node_modules
COPY --from=build --chown=reactrouter:nodejs /app/apps/react-router-web/package.json ./apps/react-router-web/package.json
COPY --from=build --chown=reactrouter:nodejs /app/apps/react-router-web/public ./apps/react-router-web/public
COPY --from=build --chown=reactrouter:nodejs /app/apps/react-router-web/build ./apps/react-router-web/build

USER reactrouter
WORKDIR /app/apps/react-router-web
CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]
