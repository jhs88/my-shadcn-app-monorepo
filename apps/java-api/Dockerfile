FROM node:20-alpine AS base
ARG TURBO_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=$TURBO_TELEMETRY_DISABLED
ENV PNPM_HOME="/pnpm" 
ENV PATH="$PNPM_HOME:$PATH"
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable
WORKDIR /app


FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i -g turbo
COPY . .
RUN turbo prune java-api --docker


FROM base AS installer

COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i

COPY --from=builder /app/out/full/ .

ENV JAVA_HOME="/opt/java/openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"
COPY --from=eclipse-temurin:21-alpine ${JAVA_HOME} ${JAVA_HOME} 

ARG TURBO_API
ENV TURBO_API=$TURBO_API

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN --mount=type=bind,source=.git,target=.git \
    --mount=type=cache,id=maven,target=/root/.m2 \
    --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
    pnpm build


FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 java \
    && adduser --system --uid 1001 java

USER java 

COPY --from=installer --chown=java:java /app/apps/java-api/target/*.jar .
CMD java -jar demo*.jar