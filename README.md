# TODO Application

A task management (TODO) application developed with NestJS, following the best software architecture and development patterns.

## 🎯 Overview

This project is a RESTful API for task management that allows:

- ✅ User authentication with code validation system
- 📁 Complete category management (CRUD)
- ✏️ Complete task management (CRUD) with status and notes
- 🔍 Search and filtering of categories and tasks
- 📄 Pagination and sorting of results
- 📖 Automatic documentation via Swagger

## ✨ Technical Highlights

- **SOLID Principles** - Well-structured and extensible code
- **Clean Code** - Readability and maintainability
- **Hexagonal Architecture** - Clear separation between domain and infrastructure
- **Domain-Driven Design (DDD)** - Rich domain modeling
- **Event-Driven Architecture** - Decoupled communication via events
- **Strategy Pattern** - Flexibility for different implementations
- **Dependency Injection** - Low coupling and high testability

## 🗗️ Project Architecture

The project follows Hexagonal Architecture (Ports and Adapters) combined with Domain-Driven Design:

```
src/
├── modules/                                      # Domain modules
│   ├── auth/                                     # Authentication module
│   │   ├── application/                          # Application layer
│   │   │   ├── controllers/                      # Controllers (HTTP Adapters)
│   │   │   ├── dtos/                             # Data Transfer Objects
│   │   │   ├── handlers/                         # Event/Queue Handlers
│   │   │   └── use-cases/                        # Application use cases
│   │   ├── domain/                               # Domain layer
│   │   │   ├── entities/                         # Domain entities
│   │   │   ├── events/                           # Domain events
│   │   │   ├── errors/                           # Domain exceptions
│   │   │   └── repositories/                     # Repository interfaces (Ports)
│   │   └── infra/                                # Infrastructure layer
│   │       ├── guards/                           # Authentication guards
│   │       └── mappers/                          # Data mappers
│   ├── categories/                               # Categories module
│   │   ├── application/                          # Application layer
│   │   │   ├── controllers/                      # REST Controllers
│   │   │   ├── dtos/                             # Data Transfer Objects
│   │   │   │   ├── controllers/                  # DTOs for controllers
│   │   │   │   └── use-cases/                    # DTOs for use cases
│   │   │   ├── enums/                            # Application enumerations
│   │   │   └── use-cases/                        # Use cases (Business Logic)
│   │   ├── domain/                               # Domain layer
│   │   │   ├── entities/                         # Domain entities
│   │   │   ├── errors/                           # Domain-specific exceptions
│   │   │   └── repositories/                     # Repository interfaces (Ports)
│   │   ├── infra/                                # Infrastructure layer
│   │   │   └── mappers/                          # Data mappers
│   │   └── categories.module.ts                  # NestJS Module
│   ├── todos/                                    # Todos module
│   │   ├── application/                          # Application layer
│   │   │   ├── controllers/                      # REST Controllers
│   │   │   ├── dtos/                             # Data Transfer Objects
│   │   │   │   ├── controllers/                  # REST Controllers
│   │   │   │   └── use-cases/                    # DTOs for use cases
│   │   │   ├── enums/                            # Application enumerations
│   │   │   └── use-cases/                        # Use cases (Business Logic)
│   │   ├── domain/                               # Domain layer
│   │   │   ├── entities/                         # Domain entities
│   │   │   ├── errors/                           # Domain-specific exceptions
│   │   │   └── repositories/                     # Repository interfaces (Ports)
│   │   ├── infra/                                # Infrastructure layer
│   │   │   └── mappers/                          # Data mappers
│   │   └── todos.module.ts                       # NestJS Module
│   └── users/                                    # Users module
│       ├── domain/                               # Domain layer
│       │   ├── entities/                         # Domain entities
│       │   ├── errors/                           # Domain-specific exceptions
│       │   └── repositories/                     # Repository interfaces (Ports)
├── shared/                                       # Shared code
│   ├── config/                                   # Application configurations
│   ├── domain-events/                            # Domain event system
│   ├── errors/                                   # Global exceptions
│   ├── infra/                                    # Shared infrastructure
│   │   ├── factories/                            # Factories for instance creation
│   │   ├── implementations/                      # Concrete implementations (Adapters)
│   │   ├── ports/                                # Interfaces/Ports
│   │   └── orm/                                  # Prisma configuration
│   ├── interceptors/                             # Global interceptors
│   ├── presenters/                               # Presentation layer
│   │   └── base.presenter.ts                     # Base presenter for field formatting
│   ├── types/                                    # Shared types
│   ├── utils/                                    # Utilities
│   └── value-objects/                            # Value objects
└── app.module.ts                                 # Main application module
```

## 📋 Layer Description

### Domain Layer

- **Entities**: Main business rules and behaviors
- **Value Objects**: Immutable objects with validations
- **Repositories**: Persistence interfaces (Ports)
- **Events**: Domain events for asynchronous communication
- **Errors**: Domain-specific exceptions

### Application Layer

- **Use Cases**: Business logic orchestration
- **Controllers**: HTTP adapters (REST API)
- **DTOs**: Data transfer objects
- **Handlers**: Event and queue processors

### Infrastructure Layer

- **Repositories**: Concrete persistence implementations
- **Strategies**: Different algorithm implementations
- **Providers**: External service providers
- **Mappers**: Layer conversion

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Docker and Docker Compose
- npm or yarn

### Installation and Setup

1. **Clone the repository**

```bash
git clone https://github.com/PabloFerrari027/todo.git
cd todo
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
# Copy the example file
cp .env.example .env

# Edit environment variables as needed
```

4. **Start Docker containers**

```bash
npm run docker:compose
```

5. **Set up the database**

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migration:deploy

# (Optional) View database in browser
npm run prisma:studio
```

6. **Start the application**

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🛠️ Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build application
npm run start:prod         # Start in production mode

# Code quality
npm run format             # Format with Prettier
npm run lint               # Check with ESLint

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:studio      # Database web interface
npm run prisma:migration:deploy  # Run migrations

# Docker
npm run docker:compose     # Start containers
```

## 📚 API Documentation

Complete API documentation is available via Swagger:
**http://localhost:3000/api/docs**

## 🛡️ Technologies and Patterns

### Core Technologies

- **NestJS** - Robust and scalable Node.js framework
- **TypeScript** - Static typing for JavaScript
- **Prisma** - Modern ORM for TypeScript/Node.js
- **PostgreSQL** - Relational database
- **Redis** - In-memory cache and queues
- **Docker** - Application containerization

### Architecture and Patterns

- **Clean Architecture** - Clear separation of responsibilities
- **Hexagonal Architecture** - Ports and Adapters
- **Domain-Driven Design** - Rich domain modeling
- **SOLID Principles** - Well-structured code
- **Strategy Pattern** - Interchangeable algorithms
- **Repository Pattern** - Persistence abstraction
- **Event-Driven Architecture** - Asynchronous communication

### Infrastructure

- **Bull** - Queue processing
- **JWT** - Stateless authentication
- **Docker Compose** - Local orchestration
- **Prisma Studio** - Visual database interface

## 🔒 Security

- 🔐 JWT Authentication with secure tokens
- ✅ Validation pipes for input sanitization
- 🌐 Configurable CORS
- 🛡️ Guards for route protection
- ⚠️ Error handling without sensitive data exposure

---

Developed with ❤️ using the best software development practices.
