FROM node:24.22.1-alpine AS base
ENV PNPM_CONFIG_IGNORE_SCRIPTS=true

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PNPM_HOME:$PATH"
ENV JAVA_HOME="/opt/java/openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"

WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare "$(node -p 'require("./package.json").packageManager')" --activate \
    && pnpm add --global "@moonrepo/cli@$(node -p 'require("./package.json").devDependencies["@moonrepo/cli"]')"

COPY --from=eclipse-temurin:21-alpine $JAVA_HOME $JAVA_HOME


FROM base AS skeleton

COPY . .
RUN moon docker scaffold java-api


FROM base AS build

COPY --from=skeleton /app/.moon/docker/configs/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    moon docker setup \
    && pnpm install --frozen-lockfile --filter java-api...

COPY --from=skeleton /app/.moon/docker/sources/ .
RUN --mount=type=cache,id=maven,target=/root/.m2 \
    moon run java-api:build


FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 java \
    && adduser --system --uid 1001 java

COPY --from=build --chown=java:java /app/apps/java-api/target/*.jar ./

USER java

CMD ["sh", "-c", "java -jar demo*.jar"]
