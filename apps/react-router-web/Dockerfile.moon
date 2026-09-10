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
RUN moon docker scaffold react-router-web


FROM base AS build

ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

COPY --from=skeleton /app/.moon/docker/configs/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    moon docker setup \
    && pnpm install --frozen-lockfile --filter react-router-web...

COPY --from=skeleton /app/.moon/docker/sources/ .
RUN moon run react-router-web:build \
    && moon docker prune


FROM node:24-alpine AS runner

ENV NODE_ENV="production"
ENV PORT="3000"

WORKDIR /app/apps/react-router-web

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 reactrouter

COPY --from=build --chown=reactrouter:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=reactrouter:nodejs /app/apps/react-router-web/node_modules ./node_modules
COPY --from=build --chown=reactrouter:nodejs /app/apps/react-router-web/package.json ./package.json
COPY --from=build --chown=reactrouter:nodejs /app/apps/react-router-web/public ./public
COPY --from=build --chown=reactrouter:nodejs /app/apps/react-router-web/build ./build

USER reactrouter

CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]
