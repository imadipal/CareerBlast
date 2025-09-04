# Multi-stage build for Spring Boot application
FROM gradle:8.5-jdk17 AS builder

WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle gradle
COPY src src

# Build the application
RUN gradle build -x test --no-daemon

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r careerblast && useradd -r -g careerblast careerblast

# Copy the built JAR file
COPY --from=builder /app/build/libs/*.jar app.jar

# Change ownership to non-root user
RUN chown careerblast:careerblast app.jar

# Switch to non-root user
USER careerblast

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
