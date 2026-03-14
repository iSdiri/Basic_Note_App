# Basic .NET API

A RESTful API built with ASP.NET Core 8 demonstrating a clean project structure with controllers, DTOs, mappers, repositories and models.

## Tech Stack

- .NET 8
- C#
- Entity Framework Core
- PostgreSQL
- Swagger / OpenAPI

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/)

## Getting Started
```bash
git clone https://github.com/TON_USERNAME/Basic_dotnet_API.git
cd Basic_dotnet_API
dotnet restore
```

Update `appsettings.json` with your PostgreSQL credentials:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=BasicApiDb;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
  }
}
```

Apply migrations and run:
```bash
dotnet ef database update
dotnet run
```

Swagger UI available at: `http://localhost:5092/swagger`

## Endpoints

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/user | Get all users |
| GET | /api/user/{id} | Get user by ID |
| POST | /api/user | Create a user |
| PUT | /api/user/{id} | Update a user |
| DELETE | /api/user/{id} | Delete a user |

### Tasks

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/task | Get all tasks |
| GET | /api/task/{id} | Get task by ID |
| POST | /api/task | Create a task |
| PUT | /api/task/{id} | Update a task |
| DELETE | /api/task/{id} | Delete a task |

## Roadmap

- [x] PostgreSQL database
- [ ] Input validation (FluentValidation)
- [x] JWT Authentication
- [ ] Unit tests