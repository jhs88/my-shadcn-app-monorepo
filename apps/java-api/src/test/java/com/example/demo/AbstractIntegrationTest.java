package com.example.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.cache.CacheManager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

/**
 * Base class for full integration tests.
 * Loads the complete application context with all beans.
 * Use for end-to-end testing scenarios.
 * Provides automatic cleanup of database and cache state between tests.
 */
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "logging.level.org.hibernate.SQL=DEBUG"
})
public abstract class AbstractIntegrationTest {

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    protected List<JpaRepository<?, ?>> repositories;

    @Autowired(required = false)
    protected CacheManager cacheManager;

    protected String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;
        
        // Configure rest template to support PATCH/PUT requests with body
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        restTemplate.getRestTemplate().setRequestFactory(requestFactory);
    }

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
        // This is a simplified version - in practice, you'd need to handle DB-specific sequences
    }

    @BeforeEach
    void resetCacheState() {
        if (cacheManager != null) {
            cacheManager.getCacheNames().forEach(name ->
                cacheManager.getCache(name).clear());
        }
    }
}