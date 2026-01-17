# URL Shortener API

> ⚠️ **Work In Progress** - This project is currently under active development.

A high-performance URL shortener API built with modern technologies including Elysia, Bun runtime, PostgreSQL, Redis, and Better Auth.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh) v1.2.22
- **Framework**: [Elysia](https://elysiajs.com) - Fast and ergonomic web framework
- **Database**: PostgreSQL 17.2 - User management, authentication, and URL storage
- **Cache**: Redis 7.4 - Caching and analytics
- **ORM**: [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM for PostgreSQL
- **Authentication**: [Better Auth](https://www.better-auth.com)
- **Validation**: Zod
- **API Documentation**: OpenAPI/Swagger
- **Code Quality**: Biome (linting & formatting)
- **CI/CD**: GitHub Actions with Semantic Release

## 📋 Features

### Core Features
- ✅ User authentication with Better Auth
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Redis caching support with cache invalidation
- ✅ UUIDv7 for sortable, time-ordered IDs
- ✅ OpenAPI/Swagger documentation
- ✅ CORS configuration
- ✅ Docker & Docker Compose support with multi-arch builds
- ✅ Automated CI/CD pipeline
- ✅ Semantic versioning and releases

### URL Management
- ✅ URL shortening with public/private access control
- ✅ High-performance URL storage in PostgreSQL
- ✅ Like/Unlike public URLs with duplicate prevention
- ✅ Fetch public URLs with filtering, sorting, and pagination
- ✅ URL access tracking with Redis

### Analytics & Ranking
- ✅ Dual ranking system (most viewed & most liked URLs)
- ✅ Real-time analytics with Redis-based view counter
- ✅ PostgreSQL for scalable URL read operations

### Quality Assurance
- ✅ Comprehensive test coverage (97+ tests)
- ✅ Type-safe error handling
- ✅ Domain-driven design architecture

## 🏗️ Project Structure

```
src/
├── core/
│   ├── entities/        # Base entities and value objects
│   ├── errors/          # Custom error classes
│   └── repositories/    # Base repository interfaces
├── domain/
│   └── url-shortening/
│       ├── application/
│       │   ├── repositories/      # Repository interfaces
│       │   ├── use-cases/         # Business use cases
│       │   └── url-code/          # URL code generation
│       └── enterprise/
│           ├── entities/          # Domain entities (Url, User)
│           └── value-objects/     # Value objects
├── infra/
│   ├── http/
│   │   └── controllers/   # HTTP controllers
│   ├── db/
│   │   ├── drizzle/       # PostgreSQL implementation
│   │   │   ├── repositories/  # Drizzle repositories
│   │   │   ├── mappers/       # Domain <-> Drizzle mappers
│   │   │   ├── schema/        # Database schema
│   │   │   └── client.ts      # Database connection
│   │   └── redis/         # Redis implementation
│   │       ├── repositories/  # Redis repositories
│   │       └── client.ts      # Redis connection
│   ├── factories/         # Dependency injection factories
│   ├── url-code/          # URL code generator implementation
│   ├── lib/
│   │   └── auth.ts        # Better Auth configuration
│   └── env.ts             # Environment variables schema
├── test/
│   ├── repositories/      # In-memory repository implementations
│   │   ├── in-memory-urls-repository.ts
│   │   ├── in-memory-users-repository.ts
│   │   └── in-memory-analysis-repository.ts
│   ├── factories/         # Test data factories
│   └── url-code/          # URL code generator for tests
└── index.ts             # Application entry point
```

## 🛠️ Prerequisites

- [Bun](https://bun.sh) >= 1.2.22
- [Docker](https://www.docker.com/) & Docker Compose (recommended)
- PostgreSQL 17+ (or use Docker)
- Redis 7+ (or use Docker)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener-api
```

2. Install dependencies:
```bash
bun install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your \`.env\` file with the required values:
```env
NODE_ENV=development
PORT=3333

DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=your_redis_password
REDIS_CODE_ID=1000

SECRET_HASH_KEY=your_secret_hash_key_for_url_encoding

CLIENT_URL=http://localhost:3000

BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3333
```

## 🚀 Quick Start

### Using Docker (Recommended)

1. Start all services (PostgreSQL & Redis):
```bash
bun run docker:up
```

2. Generate and run PostgreSQL migrations:
```bash
bun run db:generate
bun run db:migrate
```

3. Start the development server:
```bash
bun run dev
```

4. Open [http://localhost:3333](http://localhost:3333) in your browser.

### Without Docker

Ensure PostgreSQL and Redis are running locally, then:

```bash
bun run db:migrate
bun run dev
```

## 📝 Available Scripts

### Development
- \`bun run dev\` - Start development server with hot reload
- \`bun run db:studio\` - Open Drizzle Studio (database GUI)

### Database
- \`bun run db:generate\` - Generate migration files from schema
- \`bun run db:migrate\` - Run pending migrations
- \`bun run db:push\` - Push schema changes directly (dev only)

### Docker
- \`bun run docker:up\` - Start PostgreSQL and Redis containers
- \`bun run docker:down\` - Stop and remove containers
- \`bun run docker:logs\` - View container logs
- \`bun run docker:restart\` - Restart containers
- \`bun run docker:build\` - Build application Docker image
- \`bun run docker:build:prod\` - Build optimized production image
- \`bun run docker:run\` - Run application in Docker
- \`bun run docker:tag:hub\` - Tag images for Docker Hub (viniciusaf/url-shortener-api)
- \`bun run docker:push\` - Push images to Docker Hub
- \`bun run docker:build:push\` - Build production image, tag, and push to Docker Hub

### Code Quality
- \`bun run lint\` - Lint code with Biome
- \`bun run lint:fix\` - Fix linting issues
- \`bun run format\` - Check code formatting
- \`bun run format:fix\` - Format code
- \`bun run check\` - Run all checks (lint + format)
- \`bun run check:fix\` - Fix all issues

## 🗄️ Database Architecture

### PostgreSQL (via Drizzle ORM)
The application uses PostgreSQL as its primary database, handling:

**User Management & Authentication:**
- **users** - User accounts with email/password authentication
- **sessions** - Active user sessions
- **accounts** - OAuth provider accounts
- **verifications** - Email verification tokens

**URL Management:**
- **urls** - Shortened URLs with metadata, including:
  - URL code for short links
  - Original destination URL
  - Public/private access control
  - Like counts and analytics
  - Author relationships

All tables use UUIDv7 for primary keys, providing:
- Time-ordered IDs for better indexing
- Sortable by creation time
- Better database performance

### Redis
- **Caching** - Reduces database load for frequently accessed data
- **Analytics** - Real-time URL access tracking and ranking
- **Session storage** - Fast session lookups
- **View counters** - Atomic increment operations for URL views

## 🔐 Authentication

Authentication is handled by [Better Auth](https://www.better-auth.com) with:
- Email/password authentication
- Session management
- PostgreSQL adapter via Drizzle ORM

## 🐳 Docker Support

### Services

The \`docker-compose.yaml\` includes:
- **PostgreSQL 17.2** - User management, authentication, and URL storage
- **Redis 7.4** - Caching layer and URL access tracking

### Building the Application

```bash
# Build with latest tag and git SHA
bun run docker:build:prod

# Run the container
bun run docker:run
```

## Publishing to Docker Hub

The project includes scripts to build, tag, and push Docker images to Docker Hub under the \`viniciusaf\` username:

```bash
# Tag images for Docker Hub
bun run docker:tag:hub

# Push images to Docker Hub (requires authentication)
bun run docker:push

# One-command build, tag, and push
bun run docker:build:push
```

**Requirements:**
- Docker Hub account (username: \`viniciusaf\`)
- Logged in to Docker: \`docker login\`
- Images are tagged with:
  - \`latest\` - Current production build
  - Git short SHA - Specific commit version

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yaml`) that automatically:
- ✅ Runs code quality checks (Biome linting & formatting)
- ✅ Runs unit tests (Bun test runner)
- ✅ Builds the application
- ✅ Builds production Docker image with multi-stage build
- ✅ Pushes Docker images to Docker Hub with tags:
  - `latest` - Current production build
  - Git commit SHA - Specific version
- ✅ Handles semantic versioning and releases
- 🚧 AWS deployment (configured, not enabled)

### Docker Hub Integration

Images are automatically published to Docker Hub under:
- **Registry**: `viniciusaf/url-shortener-api`
- **Authentication**: Uses GitHub secret `DOCKER_HUB_TOKEN` (personal access token)
- **Variables Used**:
  - `DOCKER_HUB_USERNAME` - GitHub repository variable
  - `SERVICE_NAME` - GitHub repository variable
  - `DOCKER_HUB_TOKEN` - GitHub secret (personal access token)

## 🌐 API Documentation

API documentation is available via OpenAPI/Swagger at:
- Development: [http://localhost:3333/swagger](http://localhost:3333/swagger)

## 📚 Use Cases

The application implements domain-driven design with comprehensive use cases for URL management:

### URL Management
- **CreateUrlUseCase** - Create shortened URLs with unique codes
- **UpdateUrlUseCase** - Update URL properties (name, value, description, visibility)
- **DeleteUrlUseCase** - Delete URLs with ownership verification
- **GetUrlByIdUseCase** - Retrieve URL by ID
- **GetUrlByCodeUseCase** - Retrieve URL by shortening code (for redirects)
- **FetchManyPublicUrlsUseCase** - Browse public URLs with:
  - Pagination (page, perPage)
  - Search by name
  - Sorting (by created_at, updated_at)
  - Date filtering (createdAtGte, updatedAtGte)
  - Built-in caching with cache invalidation

### User Interactions
- **LikeUrlUseCase** - Like public URLs (prevents:
  - Liking private URLs (NotAllowedError)
  - Duplicate likes (UrlAlreadyLikedError)
  - Non-existent URLs (ResourceNotFoundError)
- **UnlikeUrlUseCase** - Unlike URLs with automatic count management

### Analytics & Ranking
- **GetRankingUseCase** - Get top 10 most accessed URLs
  - Tracks URL access count via Redis cache
  - Returns URLs sorted by view count (descending)
  - Automatically increments on each URL access via `GetUrlByCodeUseCase`
  - Uses Redis ZREVRANGE format for efficient ranking
- **GetRankingByMostLikedUseCase** - Get top most liked URLs
  - Returns public URLs sorted by like count (descending)
  - Configurable limit (default: 10)
  - Only includes public URLs in ranking
  - Real-time data from database

### Key Features
- ✅ Authorization checks (verify user ownership)
- ✅ Type-safe error handling with Either pattern
- ✅ Pagination with metadata
- ✅ Cache layer with TTL support
- ✅ Atomic operations for likes/unlikes
- ✅ URL access tracking with Redis
- ✅ Dual ranking system (by views and by likes)
- ✅ Comprehensive test coverage (97+ tests)

## 🏭 Dependency Injection

The application uses the **Factory Pattern** for dependency injection, located in `src/infra/factories/`. Each use case has a corresponding factory function that wires up all required dependencies.

### Factory Functions

All use case factories are available through a barrel export:

```typescript
import {
  makeCreateUrlUseCase,
  makeGetUrlByCodeUseCase,
  makeLikeUrlUseCase,
  // ... and 9 more factories
} from '@/infra/factories';
```

### Available Factories

**URL Management:**
- `makeCreateUrlUseCase` - Create shortened URLs
- `makeGetUrlByCodeUseCase` - Retrieve URLs by code
- `makeGetUrlByIdUseCase` - Retrieve URLs by ID
- `makeUpdateUrlUseCase` - Update URL properties
- `makeDeleteUrlUseCase` - Delete URLs

**User Interactions:**
- `makeLikeUrlUseCase` - Like URLs
- `makeUnlikeUrlUseCase` - Unlike URLs

**Data Fetching:**
- `makeFetchUserUrlsUseCase` - Fetch user's URLs
- `makeFetchUserLikedUrlsUseCase` - Fetch liked URLs
- `makeFetchManyPublicUrlsUseCase` - Browse public URLs

**Analytics:**
- `makeGetRankingUseCase` - Get most accessed URLs
- `makeGetRankingByMostLikedUseCase` - Get most liked URLs

### Usage Example

```typescript
// In your HTTP controller
import { makeCreateUrlUseCase } from '@/infra/factories';

const createUrlUseCase = makeCreateUrlUseCase();

const result = await createUrlUseCase.execute({
  authorId: user.id,
  name: 'My Link',
  destinationUrl: 'https://example.com',
  isPublic: true
});

if (result.isRight()) {
  const { url } = result.value;
  // Handle success
} else {
  // Handle error
}
```

### Injected Dependencies

Each factory automatically wires up:
- **DrizzleUrlsRepository** - PostgreSQL URL storage
- **DrizzleUsersRepository** - PostgreSQL user management
- **RedisAnalysisRepository** - Redis analytics and caching
- **HashUrlCodeGenerator** - URL code generation using Hashids with base64 URL-safe alphabet

This approach ensures:
- ✅ Clean separation of concerns
- ✅ Easy testing with dependency substitution
- ✅ Centralized dependency configuration
- ✅ Type safety throughout the application

## 🧪 Testing

### Test Infrastructure

The project uses **Bun's native test runner** with in-memory repository implementations for fast, isolated unit tests.

### In-Memory Repositories

Located in `src/test/repositories/`, these implementations allow testing without a database:

- **InMemoryUrlsRepository** - Implements `UrlsRepository` interface
  - Manages URL entities with full CRUD operations
  - Supports sorting (by created_at, updated_at, title, description, value, isPublic)
  - Implements pagination
  - Provides methods to query public URLs and filter by author
  - `findManyByIds` - Bulk fetch URLs with author information
  - `findManyByMostLiked` - Get top URLs sorted by like count

- **InMemoryUsersRepository** - Implements `UsersRepository` interface
  - Manages user entities
  - Supports lookup by email (for authentication)
  - Supports lookup by ID

- **InMemoryCacheRepository** - Implements `CacheRepository` interface
  - Manages ID counter for URL code generation
  - Provides atomic increment operations
  - Stores and retrieves cached data with TTL support
  - Supports cache expiration and invalidation
  - `incrementBy` - Atomic increment for URL view tracking
  - `getUrlRanking` - Retrieve top URLs in Redis ZREVRANGE format

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch
```

Tests are located in:
- `src/core/**/*.test.ts` - Core layer tests
- `src/domain/**/*.test.ts` - Domain layer tests

**Testing Best Practices:**

1. Use in-memory repositories for unit tests to avoid database dependencies
2. Test use cases and business logic in isolation
3. Focus on behavior rather than implementation details
4. Mock external dependencies

## 📄 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| \`NODE_ENV\` | Environment (development/production/test) | Yes | development |
| \`PORT\` | Server port | Yes | 3333 |
| \`DATABASE_URL\` | PostgreSQL connection string | Yes | - |
| \`DATABASE_USERNAME\` | Database username | Yes | - |
| \`DATABASE_PASSWORD\` | Database password | Yes | - |
| \`DATABASE_NAME\` | Database name | Yes | - |
| \`REDIS_HOST\` | Redis server hostname | Yes | localhost |
| \`REDIS_PORT\` | Redis server port | Yes | 6379 |
| \`REDIS_DB\` | Redis database number | Yes | 0 |
| \`REDIS_PASSWORD\` | Redis password | Yes | - |
| \`REDIS_CODE_ID\` | Starting ID for URL code generation | Yes | - |
| \`SECRET_HASH_KEY\` | Secret key for Hashids URL encoding | Yes | - |
| \`CLIENT_URL\` | Frontend URL for CORS | Yes | - |
| \`BETTER_AUTH_SECRET\` | Secret key for auth tokens | Yes | - |
| \`BETTER_AUTH_URL\` | Base URL of the API | Yes | - |

## 🤝 Contributing

This is a portfolio project currently under active development. Contributions, issues, and feature requests are welcome!

## 📝 License

This project is part of a portfolio and is available for reference and learning purposes.

## 🔗 Links

- [Bun Documentation](https://bun.sh/docs)
- [Elysia Documentation](https://elysiajs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Better Auth Documentation](https://www.better-auth.com)

---

Built with ❤️ using Bun and Elysia
