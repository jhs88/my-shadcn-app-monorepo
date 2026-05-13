# ADR-0001: Test hierarchy with abstract base classes

**Status**: Accepted  
**Context**: Spring Boot app needs a structured, maintainable test organization

## Decision

Use abstract base classes to provide shared test infrastructure:

| Base class | Scope | Key features |
| --- | --- | --- |
| `AbstractIntegrationTest` | Full context | `@SpringBootTest`, random port, DB/cache auto-cleanup |
| `AbstractWebTest` | Web slice | `@WebMvcTest`, controller-only testing |
| `AbstractServiceTest` | Service layer | Mock-based unit tests |
| `AbstractRepositoryTest` | Data layer | `@DataJpaTest`, repository-only testing |

## Rationale
- Eliminates boilerplate in individual test classes
- `AbstractIntegrationTest` provides automatic table truncation and cache clearing between tests
- Test slices (`@WebMvcTest`, `@DataJpaTest`) run faster by loading only relevant beans

## Consequences
- `AbstractIntegrationTest` loads the full context — slower but more realistic
- Database cleanup in integration tests uses `JdbcTemplate` to truncate all PUBLIC tables
- Cache clearing is optional (autowired with `required = false`)
- Tests must use `@ActiveProfiles("test")` for test-specific configuration
