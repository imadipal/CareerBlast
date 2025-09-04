# CareerBlast Backend API

A comprehensive Spring Boot backend for the CareerBlast job portal application.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: User registration, email verification, profile management
- **Job Management**: Create, update, search, and manage job postings
- **Company Profiles**: Employer company profile management
- **Job Applications**: Apply to jobs, track application status
- **Skills Management**: Skill categorization and matching
- **Search & Filtering**: Advanced job search with multiple filters
- **Email Notifications**: Automated email notifications for various events
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Database Migrations**: Flyway database version control
- **Caching**: Redis-compatible caching for improved performance
- **Monitoring**: Actuator endpoints for health checks and metrics

## Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security with JWT
- **Documentation**: SpringDoc OpenAPI 3
- **Build Tool**: Gradle
- **Database Migration**: Flyway
- **Mapping**: MapStruct
- **Email**: Spring Mail
- **Caching**: Spring Cache
- **Testing**: JUnit 5, Testcontainers

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Gradle 8.5 or higher (or use the included wrapper)

## Quick Start

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE careerblast;
CREATE USER careerblast WITH PASSWORD 'careerblast';
GRANT ALL PRIVILEGES ON DATABASE careerblast TO careerblast;
```

### 2. Environment Configuration

Create an `application-local.yml` file in `src/main/resources/` for local development:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/careerblast
    username: careerblast
    password: careerblast
  
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password

app:
  jwt:
    secret: your-super-secret-jwt-key-here
  cors:
    allowed-origins: http://localhost:3000,http://localhost:5173
```

### 3. Run the Application

```bash
# Using Gradle wrapper
./gradlew bootRun

# Or with specific profile
./gradlew bootRun --args='--spring.profiles.active=local'
```

The API will be available at `http://localhost:8080/api/v1`

### 4. API Documentation

Once the application is running, access the Swagger UI at:
- http://localhost:8080/swagger-ui.html

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/verify-email` - Verify email address
- `POST /auth/refresh-token` - Refresh access token

### Jobs
- `GET /jobs/search` - Search jobs with filters
- `GET /jobs/{id}` - Get job by ID
- `POST /jobs` - Create new job (Employer only)
- `PUT /jobs/{id}` - Update job (Employer only)
- `DELETE /jobs/{id}` - Delete job (Employer only)
- `GET /jobs/featured` - Get featured jobs
- `GET /jobs/latest` - Get latest jobs

### Companies
- `GET /companies` - List companies
- `GET /companies/{id}` - Get company by ID
- `GET /companies/{id}/jobs` - Get jobs by company

### Applications
- `POST /applications` - Apply to a job
- `GET /applications` - Get user's applications
- `PUT /applications/{id}` - Update application status

## Database Schema

The application uses the following main entities:

- **Users**: User accounts with authentication details
- **UserProfiles**: Extended user information for job seekers
- **Companies**: Company profiles for employers
- **Jobs**: Job postings with requirements and details
- **JobApplications**: Applications submitted by users
- **Skills**: Skill categories and definitions
- **WorkExperiences**: User work history
- **Educations**: User education background
- **Certifications**: User certifications

## Security

- JWT-based authentication
- Role-based authorization (USER, EMPLOYER, ADMIN)
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Input validation and sanitization

## Configuration

Key configuration properties:

```yaml
app:
  jwt:
    secret: ${JWT_SECRET}
    expiration: 86400000  # 24 hours
    refresh-expiration: 604800000  # 7 days
  
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS}
  
  pagination:
    default-page-size: 20
    max-page-size: 100
```

## Development

### Running Tests

```bash
./gradlew test
```

### Database Migration

Flyway migrations are automatically applied on startup. To run migrations manually:

```bash
./gradlew flywayMigrate
```

### Code Quality

The project uses:
- MapStruct for entity-DTO mapping
- Lombok for reducing boilerplate code
- Spring Boot DevTools for development
- Comprehensive exception handling

## Deployment

### Environment Variables

Set the following environment variables for production:

```bash
SPRING_PROFILES_ACTIVE=prod
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=careerblast
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-production-jwt-secret
MAIL_HOST=your-smtp-host
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-email-password
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Building for Production

```bash
./gradlew build
java -jar build/libs/careerblast-backend-1.0.0.jar
```

## Monitoring

The application includes Actuator endpoints for monitoring:

- `/actuator/health` - Health check
- `/actuator/info` - Application information
- `/actuator/metrics` - Application metrics
- `/actuator/prometheus` - Prometheus metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
