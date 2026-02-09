package com.example.demo;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Base class for controller (web layer) tests.
 * Subclasses should add @WebMvcTest(YourController.class) to load only the web layer components.
 * Dependencies should be mocked with @MockitoBean.
 * 
 * Example usage:
 * <pre>
 * @WebMvcTest(MyController.class)
 * class MyControllerTest extends AbstractWebTest {
 *     @MockitoBean
 *     private MyService myService;
 *     // ... tests
 * }
 * </pre>
 */
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "logging.level.org.hibernate.SQL=DEBUG",
    "spring.security.enabled=false"
})
public abstract class AbstractWebTest {

    @Autowired
    protected MockMvc mockMvc;

}