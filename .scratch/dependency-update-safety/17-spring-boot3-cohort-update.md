---
title: "Update the Spring Boot 3 Maven cohort"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update the Spring Boot Item example within its current framework and documentation-tool majors using the Maven verification adapter as the test seam.

## Depends on

- `07-maven-docker-update-adapters.md`

## Scope

- Update Spring Boot within major 3.
- Update SpringDoc within major 2 and JaCoCo within its compatible line.
- Let Spring Boot dependency management move its managed dependency graph coherently.
- Review migration notes affecting JPA, validation, actuator health, and test execution.

## Acceptance criteria

- [ ] Spring Boot remains on major 3 and SpringDoc remains on major 2.
- [ ] Maven `verify` passes unit tests, matching integration tests, JaCoCo checks, and packaging.
- [ ] Item CRUD, validation, not-found behavior, persistence, and actuator health tests pass through existing seams.
- [ ] The Java image builds from the produced JAR.
- [ ] No Spring Boot 4, Java major, Item contract, or database migration is introduced.
- [ ] Relevant migration-note review is summarized in the pull request.

## Out of scope

- Spring Boot 4.
- Java 22+.
- Item domain or HTTP contract changes.
