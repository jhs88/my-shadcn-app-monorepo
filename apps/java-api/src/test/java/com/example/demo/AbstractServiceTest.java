package com.example.demo;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

/**
 * Base class for service layer integration tests.
 * Uses @SpringBootTest to load the full application context.
 * Use this for testing service logic with real dependencies.
 * For pure unit tests, use @ExtendWith(MockitoExtension.class) instead.
 */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.main.allow-bean-definition-overriding=true"
})
public abstract class AbstractServiceTest {

}