# URL Shortener API

> ⚠️ **Work In Progress** - This project is currently under active development.

A high-performance URL shortener API built with modern technologies including Elysia, Bun runtime, PostgreSQL, Redis, and Better Auth.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh) v1.2.22
- **Framework**: [Elysia](https://elysiajs.com) - Fast and ergonomic web framework
- **Database**: PostgreSQL 17.2
- **Cache**: Redis 7.4
- **ORM**: [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- **Authentication**: [Better Auth](https://www.better-auth.com)
- **Validation**: Zod
- **API Documentation**: OpenAPI/Swagger
- **Code Quality**: Biome (linting & formatting)
- **CI/CD**: GitHub Actions with Semantic Release

## 📋 Features

- ✅ User authentication with Better Auth
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Redis caching support
- ✅ UUIDv7 for sortable, time-ordered IDs
- ✅ OpenAPI/Swagger documentation
- ✅ CORS configuration
- ✅ Docker & Docker Compose support
- ✅ Automated CI/CD pipeline
- ✅ Semantic versioning and releases
- 🚧 URL shortening functionality (coming soon)
- 🚧 Analytics and tracking (coming soon)

## 🏗️ Project Structure

\`\`\`
src/
├── db/
│   ├── schema/           # Database schema definitions
│   │   ├── users.ts      # User table
│   │   ├── sessions.ts   # Session management
│   │   ├── accounts.ts   # OAuth accounts
│   │   └── verifications.ts
│   ├── client.ts         # Database connection
│   └── migrations/       # Database migrations
├── lib/
│   └── auth.ts          # Better Auth configuration
├── env.ts               # Environment variables schema
└── index.ts             # Application entry point
\`\`\`

## 🛠️ Prerequisites

- [Bun](https://bun.sh) >= 1.2.22
- [Docker](https://www.docker.com/) & Docker Compose (for database services)
- PostgreSQL 17+ (or use Docker)
- Redis 7+ (or use Docker)

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd url-shortener-api
\`\`\`

2. Install dependencies:
\`\`\`bash
bun install
\`\`\`

3. Copy environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure your \`.env\` file with the required values:
\`\`\`env
NODE_ENV=development
PORT=3333

DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name

REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

CLIENT_URL=http://localhost:3000

BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3333
\`\`\`

## 🚀 Quick Start

### Using Docker (Recommended)

1. Start database services (PostgreSQL & Redis):
\`\`\`bash
bun run docker:up
\`\`\`

2. Generate and run database migrations:
\`\`\`bash
bun run db:generate
bun run db:migrate
\`\`\`

3. Start the development server:
\`\`\`bash
bun run dev
\`\`\`

4. Open [http://localhost:3333](http://localhost:3333) in your browser.

### Without Docker

Ensure PostgreSQL and Redis are running locally, then:

\`\`\`bash
bun run db:migrate
bun run dev
\`\`\`

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

### Code Quality
- \`bun run lint\` - Lint code with Biome
- \`bun run lint:fix\` - Fix linting issues
- \`bun run format\` - Check code formatting
- \`bun run format:fix\` - Format code
- \`bun run check\` - Run all checks (lint + format)
- \`bun run check:fix\` - Fix all issues

## 🗄️ Database Schema

The project uses Drizzle ORM with the following tables:

- **users** - User accounts with email/password authentication
- **sessions** - Active user sessions
- **accounts** - OAuth provider accounts
- **verifications** - Email verification tokens

All tables use UUIDv7 for primary keys, providing:
- Time-ordered IDs for better indexing
- Sortable by creation time
- Better database performance

## 🔐 Authentication

Authentication is handled by [Better Auth](https://www.better-auth.com) with:
- Email/password authentication
- Session management
- PostgreSQL adapter via Drizzle ORM

## 🐳 Docker Support

### Services

The \`docker-compose.yaml\` includes:
- **PostgreSQL 17.2** - Main database
- **Redis 7.4** - Caching layer

### Building the Application

\`\`\`bash
# Build with latest tag and git SHA
bun run docker:build:prod

# Run the container
bun run docker:run
\`\`\`

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow that:
- ✅ Runs code quality checks (Biome)
- ✅ Builds the application
- ✅ Handles semantic versioning and releases
- 🚧 Unit tests (coming soon)
- 🚧 E2E tests (coming soon)
- 🚧 Docker image publishing (configured, not enabled)
- 🚧 AWS deployment (configured, not enabled)

## 🌐 API Documentation

API documentation is available via OpenAPI/Swagger at:
- Development: [http://localhost:3333/swagger](http://localhost:3333/swagger)

## 🧪 Testing

Testing infrastructure is configured but test implementation is in progress:
- Unit tests with Bun's test runner
- E2E tests with database setup

## 📄 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`NODE_ENV\` | Environment (development/production/test) | Yes |
| \`PORT\` | Server port | Yes |
| \`DATABASE_URL\` | PostgreSQL connection string | Yes |
| \`DATABASE_USERNAME\` | Database username | Yes |
| \`DATABASE_PASSWORD\` | Database password | Yes |
| \`DATABASE_NAME\` | Database name | Yes |
| \`REDIS_URL\` | Redis connection string | Yes |
| \`REDIS_PASSWORD\` | Redis password | Yes |
| \`CLIENT_URL\` | Frontend URL for CORS | Yes |
| \`BETTER_AUTH_SECRET\` | Secret key for auth tokens | Yes |
| \`BETTER_AUTH_URL\` | Base URL of the API | Yes |

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
