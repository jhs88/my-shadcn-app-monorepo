---
name: spring-integtration-test-optimization
---
# Optimizing Spring Integration Tests - Performance Guide

This skill provides comprehensive strategies for optimizing Spring integration tests based on established patterns and performance considerations. Learn how to maintain fast, reliable test suites while ensuring comprehensive test coverage.

## Overview

Integration tests are essential for Spring applications but can become performance bottlenecks. This guide focuses on techniques to optimize test execution speed while maintaining test effectiveness and reliability.

## Key Performance Challenges

### 1. Context Caching Issues

- Every `@MockBean` creates a new ApplicationContext
- Multiple profiles trigger context recreation
- `@DirtiesContext` forces cache invalidation

### 2. State Management Problems

- Shared state between tests causes flakiness
- Database cleanup overhead
- Cache and external service state pollution

### 3. Test Scope Misconfiguration

- Loading entire application context unnecessarily
- Testing too many layers in single tests
- Over-reliance on integration tests for unit-level scenarios

## Optimization Strategies

### 1. Profile Management

#### Problem

Using multiple profiles in tests creates separate ApplicationContexts:

```java
// BAD - Creates new context for each profile
@Test
@ActiveProfiles("dev")
public void devTest() { }

@Test
@ActiveProfiles("prod")
public void prodTest() { }
```

#### Solution: Aggregate Test Profile

Create a unified test profile:

```java
// application-test.properties
spring.profiles.active=test
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
logging.level.org.hibernate.SQL=DEBUG
```

```java
@SpringBootTest
@ActiveProfiles("test")
abstract class AbstractIntegrationTest {
    // Centralized test configuration
}
```

#### Benefits

- Single ApplicationContext for all tests
- Consistent test environment
- Faster context startup
- Easier maintenance

### 2. @MockBean Optimization

#### Problem

`@MockBean` marks context as dirty:

```java
// SLOW - Each test class gets new context
@WebMvcTest(UserController.class)
public class UserControllerTest {
    @MockBean  // Forces context reload
    private UserService userService;
}
```

#### Alternative 1: Test Without Mocking

Test HTTP boundaries instead of mocking:

```java
// FASTER - Reuses cached context
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void whenCreateUser_thenUserExists() {
        // POST to create user
        restTemplate.postForEntity("/users", userRequest, Void.class);

        // GET to verify creation
        ResponseEntity<User> response = restTemplate.getForEntity("/users/" + username, User.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getName()).isEqualTo(username);
    }
}
```

#### Alternative 2: Custom Test Configuration

Replace mocks with test implementations:

```java
@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public UserService testUserService(UserRepository repository) {
        return new TestUserService(repository); // Real implementation for testing
    }
}

@SpringBootTest
@Import(TestConfig.class)
public class UserControllerTest {
    @Autowired
    private UserService userService; // Real service, not mock
}
```

### 3. Test Slice Strategy

#### Use Appropriate Test Slices

Choose the smallest possible test scope:

```java
// For JSON serialization only
@JsonTest
public class UserSerializationTest {
    @Autowired
    private JacksonTester<User> json;

    @Test
    public void userSerializationTest() throws IOException {
        User user = new User("john@example.com");
        assertThat(json.write(user)).isEqualToJson("expected-user.json");
    }
}

// For repository layer only
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void whenFindByName_thenReturnUser() {
        User user = new User("test@example.com");
        entityManager.persistAndFlush(user);

        Optional<User> found = userRepository.findByEmail("test@example.com");
        assertThat(found).isPresent();
    }
}

// For MVC layer only
@WebMvcTest(UserController.class)
public class UserControllerWebTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void whenGetUsers_thenReturnJson() throws Exception {
        mockMvc.perform(get("/users"))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
```

### 4. Base Class Architecture

#### Create Optimized Base Test Class

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "logging.level.org.hibernate.SQL=DEBUG"
})
abstract class AbstractIntegrationTest {

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    protected List< JpaRepository<?, ?>> repositories;

    @Autowired
    protected CacheManager cacheManager;

    @BeforeEach
    void resetDatabaseState() {
        // Clean all tables
        String[] tableNames = jdbcTemplate.queryForObject(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'PUBLIC'",
            String[].class);

        if (tableNames != null) {
            Arrays.stream(tableNames)
                  .filter(table -> !table.startsWith("DATABASECHANGELOG"))
                  .forEach(table -> jdbcTemplate.execute("TRUNCATE TABLE " + table));
        }

        // Reset auto-increment sequences
        jdbcTemplate.queryForObject(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'PUBLIC'",
            String[].class);

        // Clear all repositories
        if (repositories != null) {
            repositories.forEach(JpaRepository::deleteAll);
        }
    }

    @BeforeEach
    void resetCacheState() {
        if (cacheManager != null) {
            cacheManager.getCacheNames().forEach(name ->
                cacheManager.getCache(name).clear());
        }
    }
}
```

#### Usage Example

```java
public class UserServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private UserService userService;

    @Test
    public void whenCreateUser_thenUserIsPersisted() {
        User user = userService.createUser("test@example.com", "John Doe");

        assertThat(user.getId()).isNotNull();
        assertThat(user.getEmail()).isEqualTo("test@example.com");
    }
}
```

### 5. State Management Best Practices

#### Isolation Through HTTP Boundaries

```java
@Test
public void whenCreateAndRetrieveUser_thenWorksEndToEnd() {
    // Create user via HTTP
    ResponseEntity<Void> createResponse = restTemplate.postForEntity(
        "/users",
        new CreateUserRequest("test@example.com", "Test User"),
        Void.class);

    assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

    // Verify via HTTP (not database inspection)
    ResponseEntity<User> getResponse = restTemplate.getForEntity(
        "/users/test@example.com", User.class);

    assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(getResponse.getBody().getEmail()).isEqualTo("test@example.com");
}
```

#### Test Data Builders

```java
@Component
public class TestDataFactory {

    public User createTestUser(String email) {
        return User.builder()
                .email(email)
                .name("Test User " + email.substring(0, email.indexOf("@")))
                .active(true)
                .build();
    }

    public CreateUserRequest createCreateUserRequest(String email) {
        return CreateUserRequest.builder()
                .email(email)
                .name("Test User " + email.substring(0, email.indexOf("@")))
                .build();
    }
}
```

### 6. Performance Monitoring

#### Test Execution Time Tracking

```java
@ExtendWith(SpringExtension.class)
public class PerformanceTrackingExtension implements BeforeEachCallback, AfterEachCallback {

    @Override
    public void beforeEach(ExtensionContext context) {
        context.store(Instant.now(), "startTime");
    }

    @Override
    public void afterEach(ExtensionContext context) {
        Instant startTime = context.getStore(ExtensionContext.Namespace.create(this))
                                .get("startTime", Instant.class);
        Duration duration = Duration.between(startTime, Instant.now());

        if (duration.getSeconds() > 5) {
            System.out.printf("WARNING: Test %s took %d seconds%n",
                            context.getDisplayName(), duration.getSeconds());
        }
    }
}
```

#### Context Startup Monitoring

```java
@Test
public void contextLoads() {
    // Monitor context startup time
    long startTime = System.currentTimeMillis();
    // Context already loaded by @SpringBootTest
    long loadTime = System.currentTimeMillis() - startTime;

    assertThat(loadTime).isLessThan(10000); // Context should load in < 10 seconds
}
```

## Maven Configuration for Fast Testing

### Separate Test Execution

```xml
<profiles>
    <!-- Unit tests only -->
    <profile>
        <id>unit-tests</id>
        <build>
            <plugins>
                <plugin>
                    <artifactId>maven-surefire-plugin</artifactId>
                    <configuration>
                        <includes>
                            <include>**/*Test.java</include>
                        </includes>
                        <excludes>
                            <exclude>**/*IntegrationTest.java</exclude>
                            <exclude>**/*E2ETest.java</exclude>
                        </excludes>
                        <parallel>methods</parallel>
                        <threadCount>4</threadCount>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>

    <!-- Integration tests only -->
    <profile>
        <id>integration-tests</id>
        <build>
            <plugins>
                <plugin>
                    <artifactId>maven-failsafe-plugin</artifactId>
                    <configuration>
                        <includes>
                            <include>**/*IntegrationTest.java</include>
                        </includes>
                        <parallel>classes</parallel>
                        <threadCount>2</threadCount>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>

    <!-- Full test suite -->
    <profile>
        <id>full-tests</id>
        <build>
            <plugins>
                <plugin>
                    <artifactId>maven-failsafe-plugin</artifactId>
                </plugin>
                <plugin>
                    <artifactId>maven-surefire-plugin</artifactId>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

### Test Execution Commands

```bash
# Fast unit tests only
mvn test -Punit-tests

# Integration tests only
mvn verify -Pintegration-tests

# Full test suite (CI/CD)
mvn verify -Pfull-tests

# Skip tests for development (use sparingly)
mvn compile -DskipTests
```

## When to Refactor from Integration to Unit Tests

### Identify Candidates for Refactoring

#### Signs of Over-Testing with Integration Tests

1. **Multiple business scenarios** in single integration test
2. **Complex setup** for simple business logic verification
3. **Slow execution** due to unnecessary infrastructure
4. **Flaky tests** due to external dependencies

#### Refactoring Pattern

**Before (Slow Integration Test)**:

```java
@SpringBootTest
public class BusinessLogicIntegrationTest {

    @Test
    public void testAllDiscountScenarios() {
        // Scenario 1: Regular discount
        User regularUser = createRegularUser();
        ResponseEntity<Order> response1 = restTemplate.postForEntity(
            "/orders", createOrderRequest(regularUser), Order.class);
        assertThat(response1.getBody().getDiscount()).isEqualTo(0.1);

        // Scenario 2: VIP discount
        User vipUser = createVipUser();
        ResponseEntity<Order> response2 = restTemplate.postForEntity(
            "/orders", createOrderRequest(vipUser), Order.class);
        assertThat(response2.getBody().getDiscount()).isEqualTo(0.2);

        // Scenario 3: No discount
        User newUser = createNewUser();
        ResponseEntity<Order> response3 = restTemplate.postForEntity(
            "/orders", createOrderRequest(newUser), Order.class);
        assertThat(response3.getBody().getDiscount()).isEqualTo(0.0);
    }
}
```

**After (Fast Unit Tests + Single Integration Test)**:

```java
// Unit tests for business logic
@ExtendWith(MockitoExtension.class)
public class DiscountServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DiscountService discountService;

    @Test
    public void regularUserGetsTenPercentDiscount() {
        User user = User.builder().type(UserType.REGULAR).build();
        when(userRepository.findByType(UserType.REGULAR)).thenReturn(user);

        BigDecimal discount = discountService.calculateDiscount(user);

        assertThat(discount).isEqualTo(new BigDecimal("0.10"));
    }

    @Test
    public void vipUserGetsTwentyPercentDiscount() {
        User user = User.builder().type(UserType.VIP).build();

        BigDecimal discount = discountService.calculateDiscount(user);

        assertThat(discount).isEqualTo(new BigDecimal("0.20"));
    }

    @Test
    public void newUserGetsNoDiscount() {
        User user = User.builder().type(UserType.NEW).build();

        BigDecimal discount = discountService.calculateDiscount(user);

        assertThat(discount).isEqualTo(BigDecimal.ZERO);
    }
}

// Single integration test for happy path
@SpringBootTest
public class OrderControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    public void whenCreateOrder_thenApplyCorrectDiscount() {
        // Test one representative scenario end-to-end
        User user = createAndSaveUser(UserType.VIP);
        CreateOrderRequest request = createOrderRequest(user.getEmail());

        ResponseEntity<Order> response = restTemplate.postForEntity(
            "/orders", request, Order.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getDiscount()).isEqualTo(new BigDecimal("0.20"));
    }
}
```

## Best Practices Summary

### Do's

- ✅ Use aggregate test profiles
- ✅ Choose smallest test slice possible
- ✅ Create optimized base test classes
- ✅ Test HTTP boundaries, not implementation details
- ✅ Separate unit and integration test execution
- ✅ Monitor test performance regularly

### Don'ts

- ❌ Use `@MockBean` unnecessarily
- ❌ Mix multiple profiles in tests
- ❌ Use `@DirtiesContext` for cleanup
- ❌ Test business logic through HTTP extensively
- ❌ Inspect databases directly in integration tests
- ❌ Run full test suite on every small change

## Performance Metrics to Monitor

1. **Context Startup Time**: < 10 seconds
2. **Single Test Execution**: < 5 seconds
3. **Full Test Suite**: < 2 minutes for unit tests, < 5 minutes for integration tests
4. **Context Cache Hit Rate**: > 80%

By implementing these optimization strategies, you can maintain comprehensive test coverage while ensuring fast, reliable build processes that don't slow down development cycles.
