# Spring Boot 3.x Migration Guide

This document provides guidance for developers working with the Spring Boot 3.x upgrade of this application.

## Overview

The application has been successfully migrated from Spring Boot 2.6.3 to Spring Boot 3.1.12, which required several breaking changes and dependency updates. All 68 tests pass successfully after the migration.

## Prerequisites

### Java Version
- **Minimum Required**: Java 17
- **Previous Version**: Java 11
- **Why**: Spring Boot 3.x requires Java 17 as the baseline

### Gradle Version
- **Updated to**: Gradle 8.5
- **Previous Version**: Gradle 7.4
- **Why**: Spring Boot 3.x requires Gradle 7.5+ for proper support

## Breaking Changes

### 1. Jakarta EE Migration (javax.* → jakarta.*)

Spring Boot 3.x adopts Jakarta EE 9+, which renamed all `javax.*` packages to `jakarta.*`. This affects 21 files in the codebase.

#### Affected Packages
- `javax.validation.*` → `jakarta.validation.*`
- `javax.servlet.*` → `jakarta.servlet.*`
- `javax.persistence.*` → `jakarta.persistence.*` (if applicable)

#### Files Updated
All validation and servlet-related imports were updated:
- **Validation**: `NewArticleParam.java`, `RegisterParam.java`, `UpdateUserParam.java`, constraint validators, etc.
- **Servlet**: `JwtTokenFilter.java` (FilterChain, ServletException, HttpServletRequest, HttpServletResponse)
- **API Controllers**: `ArticlesApi.java`, `CommentsApi.java`, `UsersApi.java`, `CurrentUserApi.java`, `ArticleApi.java`

#### Migration Pattern
```java
// Before (Spring Boot 2.x)
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.servlet.FilterChain;

// After (Spring Boot 3.x)
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.servlet.FilterChain;
```

### 2. Spring Security Configuration

Spring Boot 3.x removes the deprecated `WebSecurityConfigurerAdapter` class in favor of component-based security configuration.

#### Key Changes in `WebSecurityConfig.java`
- Removed: `extends WebSecurityConfigurerAdapter`
- Added: `SecurityFilterChain` bean with method chaining configuration
- Changed: `antMatchers()` → `requestMatchers()`
- Changed: Method chaining syntax from `.and()` to lambda-based configuration

#### Migration Pattern
```java
// Before (Spring Boot 2.x)
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .cors().and()
            .authorizeRequests()
            .antMatchers(HttpMethod.GET, "/articles/**").permitAll()
            .anyRequest().authenticated();
        
        http.addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}

// After (Spring Boot 3.x)
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(HttpMethod.GET, "/articles/**").permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### 3. JJWT API Updates (0.11.2 → 0.12.6)

The JJWT library updated its API in version 0.12.x with breaking changes to token generation and parsing.

#### Key Changes in `DefaultJwtService.java`
- **Token Generation**: `signWith()` signature changed - now requires explicit key, removed algorithm parameter (inferred from key)
- **Token Parsing**: Parser API updated - `parseClaimsJws()` → `parseSignedClaims()`, new `verifyWith()` method

#### Migration Pattern
```java
// Before (JJWT 0.11.2)
Jwts.builder()
    .setSubject(user.getId())
    .signWith(signingKey, signatureAlgorithm)  // algorithm parameter
    .compact();

Jwts.parserBuilder()
    .setSigningKey(signingKey)
    .build()
    .parseClaimsJws(token);

// After (JJWT 0.12.6)
Jwts.builder()
    .setSubject(user.getId())
    .signWith(signingKey)  // algorithm inferred from key
    .compact();

Jwts.parser()
    .verifyWith(signingKey)  // new method name
    .build()
    .parseSignedClaims(token);  // new method name
```

### 4. Exception Handler Updates

Spring Framework 6 (used by Spring Boot 3.x) changed some method signatures in exception handlers.

#### Change in `CustomizeExceptionHandler.java`
- Method parameter type changed: `HttpStatus` → `HttpStatusCode`
- Reason: `HttpStatusCode` is now the parent interface, providing more flexibility

```java
// Before
protected ResponseEntity<Object> handleMethodArgumentNotValid(
    MethodArgumentNotValidException e,
    HttpHeaders headers,
    HttpStatus status,  // Old type
    WebRequest request) { ... }

// After
protected ResponseEntity<Object> handleMethodArgumentNotValid(
    MethodArgumentNotValidException e,
    HttpHeaders headers,
    HttpStatusCode status,  // New type
    WebRequest request) { ... }
```

## Dependency Version Matrix

| Dependency | Spring Boot 2.x Version | Spring Boot 3.x Version |
|------------|------------------------|------------------------|
| Spring Boot | 2.6.3 | 3.1.12 |
| MyBatis Spring Boot Starter | 2.2.2 | 3.0.3 |
| Netflix DGS Framework | 4.9.21 | 9.1.1 |
| JJWT | 0.11.2 | 0.12.6 |
| REST Assured | 4.5.1 | 5.5.0 |
| Gradle | 7.4 | 8.5 |
| Java | 11 | 17 |

## New Spring Boot 3.x Features Utilized

### 1. Component-Based Security Configuration
The application now uses the modern `SecurityFilterChain` bean pattern, which provides:
- Better testability (can be unit tested as a regular bean)
- Clearer configuration through lambda-based DSL
- Improved type safety

### 2. Updated Request Matching
The new `requestMatchers()` API provides:
- Better path matching patterns
- Improved HTTP method handling
- More intuitive configuration

## Testing Strategy

All 68 existing tests pass after the migration. The test suite covers:
- API endpoint functionality
- Authentication and authorization
- Repository operations
- GraphQL queries and mutations

Run tests with:
```bash
./gradlew test
```

## Rollback Considerations

If you need to rollback to Spring Boot 2.x:
1. Revert all `jakarta.*` imports back to `javax.*`
2. Restore `WebSecurityConfigurerAdapter` pattern in security configuration
3. Downgrade all dependencies to Spring Boot 2.x compatible versions
4. Change Java version back to 11
5. Downgrade Gradle to 7.4

## Additional Resources

- [Spring Boot 3.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide)
- [Spring Security 6.0 Migration Guide](https://docs.spring.io/spring-security/reference/migration/index.html)
- [Jakarta EE 9 Migration](https://jakarta.ee/resources/)
- [JJWT 0.12.0 Release Notes](https://github.com/jwtk/jjwt/releases/tag/0.12.0)

## Support

For questions or issues related to the Spring Boot 3.x upgrade, please:
1. Check this migration guide
2. Review the [upgrade commit](https://github.com/BlakeUsenick2/spring-boot-realworld-example-app/commit/e9e2014)
3. Open an issue with detailed information about the problem
