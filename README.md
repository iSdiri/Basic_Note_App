# Basic .NET API

A fullstack app built with ASP.NET Core 8 and React demonstrating a clean project structure with controllers, DTOs, mappers, repositories, models, JWT authentication and input validation.

## Tech Stack

**Backend**
- .NET 8 / C#
- Entity Framework Core
- PostgreSQL
- Swagger / OpenAPI
- JWT Authentication
- FluentValidation

**Frontend**
- React + Vite
- React Router
- Axios

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/)

## Project Structure
```
├── Controllers        # HTTP endpoints
├── Data               # DbContext and seed data
├── DTOs               # Data Transfer Objects
├── Mappers            # DTO <-> Model conversion
├── Models             # Domain entities
├── Repositories       # Data access layer
├── Services           # TokenService (JWT)
├── Validators         # FluentValidation rules
└── client/            # React frontend
```

## Getting Started

### Backend
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
  },
  "Jwt": {
    "Key": "your-secret-key-min-32-characters",
    "Issuer": "BasicDotnetAPI",
    "Audience": "BasicDotnetAPIUsers"
  }
}
```

Apply migrations and run:
```bash
dotnet ef database update
dotnet run
```

Swagger UI available at: `http://localhost:5092/swagger`

### Frontend
```bash
cd client
npm install
npm run dev
```

App available at: `http://localhost:5173`

## Authentication

This API uses JWT Bearer tokens. To access protected routes:

1. Register via `POST /api/auth/register`
2. Login via `POST /api/auth/login`
3. Copy the token from the response
4. Click **Authorize** in Swagger and paste the token

## Endpoints

### Auth

| Method | Route | Description | Protected |
|--------|-------|-------------|-----------|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and get token | No |

### Users

| Method | Route | Description | Protected |
|--------|-------|-------------|-----------|
| GET | /api/user | Get all users | Yes |
| GET | /api/user/{id} | Get user by ID | Yes |
| POST | /api/user | Create a user | Yes |
| PUT | /api/user/{id} | Update a user | Yes |
| DELETE | /api/user/{id} | Delete a user | Yes |

### Tasks

| Method | Route | Description | Protected |
|--------|-------|-------------|-----------|
| GET | /api/task | Get all tasks | Yes |
| GET | /api/task/{id} | Get task by ID | Yes |
| POST | /api/task | Create a task | Yes |
| PUT | /api/task/{id} | Update a task | Yes |
| DELETE | /api/task/{id} | Delete a task | Yes |

## Roadmap

- [x] PostgreSQL database
- [x] JWT Authentication
- [x] Input validation (FluentValidation)
- [x] React frontend
- [ ] Unit tests
- [ ] Deployment
