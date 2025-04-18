FROM maven:3-eclipse-temurin-21-alpine AS java

FROM node:20-alpine AS base

ENV JAVA_HOME="/opt/java/openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"
COPY --from=java ${JAVA_HOME} ${JAVA_HOME} 

ENV MAVEN_HOME="/usr/share/maven"
ENV MAVEN_CONFIG="/root/.m2"
COPY --from=java ${MAVEN_HOME} ${MAVEN_HOME}
COPY --from=java /usr/local/bin/mvn-entrypoint.sh /usr/local/bin/mvn-entrypoint.sh
COPY --from=java ${MAVEN_HOME}/ref/settings-docker.xml ${MAVEN_HOME}/ref/settings-docker.xml
RUN ln -s ${MAVEN_HOME}/bin/mvn /usr/bin/mvn

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

ARG TURBO_API
ENV TURBO_API=$TURBO_API

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN --mount=type=bind,source=.git,target=.git \
    --mount=type=cache,target=/root/.m2 \
    --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
    mvn-entrypoint.sh pnpm build


FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 java

USER java

COPY --from=installer --chmod=755 --chown=java:nodejs /app/apps/java-api/target/*.jar .
CMD java -jar demo*.jar