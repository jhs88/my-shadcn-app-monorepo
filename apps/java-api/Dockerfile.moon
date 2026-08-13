FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV JAVA_HOME="/opt/java/openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"

RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare pnpm@10.28.0 --activate \
    && pnpm add --global @moonrepo/cli@2.4.6

COPY --from=eclipse-temurin:21-alpine $JAVA_HOME $JAVA_HOME

WORKDIR /app


FROM base AS skeleton

COPY . .
RUN moon docker scaffold java-api


FROM base AS build

COPY --from=skeleton /app/.moon/docker/configs/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    moon docker setup \
    && pnpm install --frozen-lockfile

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
