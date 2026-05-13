# java-api — Spring Boot REST API

## Overview

**Demo example** of a Spring Boot 3 REST API showing Item CRUD operations with JPA/H2. Demonstrates a comprehensive test hierarchy using abstract base classes (`AbstractIntegrationTest`, `AbstractWebTest`, `AbstractServiceTest`, `AbstractRepositoryTest`) as a pattern for structuring Spring Boot tests.

## Tech stack

- **Framework**: Spring Boot 3.4.4
- **Language**: Java 21
- **Database**: H2 (in-memory)
- **ORM**: Spring Data JPA (Hibernate)
- **Build**: Maven (wrapper `./mvnw`)
- **Code gen**: Lombok (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`)
- **API docs**: SpringDoc OpenAPI (Swagger UI at `/swagger-ui.html`)
- **Monitoring**: Spring Boot Actuator (health endpoint at `/actuator/health`)

## Domain model

### Item entity

```java
@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;
}
```

Simple entity with auto-incrementing ID and a required name field.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/items` | List all items |
| GET | `/items/{id}` | Get item by ID (404 if not found) |
| POST | `/items` | Create new item (validates `@NotBlank` on name) |
| PUT | `/items/{id}` | Update or create item by ID |
| DELETE | `/items/{id}` | Delete item by ID |

### Error handling

- `ItemNotFoundException` — thrown when item not found by ID
- `ApplicationExceptionHandler` — global exception handler, converts domain exceptions to HTTP responses

## Test hierarchy

Abstract base classes for test composition:

| Class | Purpose | Annotations |
| --- | --- | --- |
| `AbstractIntegrationTest` | Full app context with random port, auto-cleanup of DB and cache | `@SpringBootTest`, `@ActiveProfiles("test")` |
| `AbstractWebTest` | Web layer slice testing | `@WebMvcTest` (assumed) |
| `AbstractServiceTest` | Service layer unit testing | Mock-based (assumed) |
| `AbstractRepositoryTest` | Repository layer testing | `@DataJpaTest` (assumed) |

`AbstractIntegrationTest` provides:
- `TestRestTemplate` for HTTP testing
- `JdbcTemplate` for direct DB access
- Auto-truncation of all tables before each test
- Cache clearing before each test
- DDL auto create-drop for test isolation

## Configuration

| Property | Value | Purpose |
| --- | --- | --- |
| `spring.datasource.url` | `jdbc:h2:mem:test` | In-memory H2 database |
| `spring.jpa.hibernate.ddl-auto` | `update` | Auto-create/update schema |
| `management.endpoints.web.exposure.include` | `health` | Expose health endpoint |

## Build in monorepo

The Java API is built via the pnpm/turborepo pipeline:
- `pnpm run build` triggers `./mvnw -B -ntp clean package -Dmaven.test.skip`
- Output: `target/demo*.jar`
- Docker container exposes port 8080 (mapped to 8081 in docker-compose)

## Glossary

| Term | Definition |
| --- | --- |
| **Item** | The sole domain entity — a named record with an auto-generated ID |
| **Test hierarchy** | Abstract base classes that provide shared test infrastructure and annotations |
| **DDL auto** | Hibernate's schema management mode (`update` = alter existing schema, `create-drop` = recreate for tests) |
